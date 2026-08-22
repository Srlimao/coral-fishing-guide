import { inflate } from 'pako';
import { FISH_MAP } from '../data/fishData';
import { Season, Weather } from '../types/fishing';

export interface SaveGameDate {
  season: Season;
  day: number;
  year: number;
}

export interface SavePlayerProfile {
  playerName?: string;
  farmName?: string;
  fishingLevel?: number;
  money?: number;
  townRank?: string;
}

export interface SaveCompletionsResult {
  success: boolean;
  error?: string;
  worldName?: string;
  gameDate?: SaveGameDate;
  weather?: Weather;
  tomorrowWeather?: Weather;
  profile?: SavePlayerProfile;
  caughtFish: Record<string, boolean>;
  donatedMuseum: Record<string, boolean>;
  offeredTemple: Record<string, boolean>;
  stats: {
    totalFishCaught: number;
    totalFishDonated: number;
    totalFishOffered: number;
    catalogTotal: number;
  };
}

/**
 * Decompresses Unreal Engine 4 GVAS chunked save game buffer
 */
export function decompressUe4SaveGame(buffer: Uint8Array): Uint8Array {
  const dataView = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  let pos = 0;
  const decompressedChunks: Uint8Array[] = [];

  while (pos < buffer.length - 16) {
    let magicIdx = -1;
    for (let i = pos; i < buffer.length - 16; i++) {
      if (dataView.getUint32(i, true) === 0x9E2A83C1) {
        magicIdx = i;
        break;
      }
    }

    if (magicIdx === -1) break;

    let hPos = magicIdx + 8;
    const maxBlockSize = Number(dataView.getBigUint64(hPos, true));
    hPos += 8;
    hPos += 8; // Total compressed size
    const totalUncomp = Number(dataView.getBigUint64(hPos, true));
    hPos += 8;

    const chunkCount = Math.ceil(totalUncomp / maxBlockSize);
    const chunkInfos: { compSize: number; uncompSize: number }[] = [];

    for (let c = 0; c < chunkCount; c++) {
      const compSize = Number(dataView.getBigUint64(hPos, true));
      hPos += 8;
      const uncompSize = Number(dataView.getBigUint64(hPos, true));
      hPos += 8;
      chunkInfos.push({ compSize, uncompSize });
    }

    let dPos = hPos;
    for (let c = 0; c < chunkInfos.length; c++) {
      const { compSize } = chunkInfos[c];
      const compData = buffer.subarray(dPos, dPos + compSize);
      try {
        const decomp = inflate(compData);
        decompressedChunks.push(decomp);
      } catch (err) {
        console.warn('Failed inflating chunk at offset', dPos, err);
      }
      dPos += compSize;
    }

    pos = dPos;
  }

  if (decompressedChunks.length === 0) {
    return buffer;
  }

  const totalLength = decompressedChunks.reduce((acc, c) => acc + c.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of decompressedChunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

function extractDateAndWeather(text: string): { date?: SaveGameDate; weather?: Weather; tomorrowWeather?: Weather } {
  let season: Season = 'spring';
  let day = 1;
  let year = 1;
  let weather: Weather = 'sunny';
  let tomorrowWeather: Weather = 'sunny';

  // 1. Season detection
  const seasonMatch = text.match(/(?:CurrentSeason|SeasonName|E_Season::)(Spring|Summer|Fall|Winter)/i);
  if (seasonMatch) {
    const raw = seasonMatch[1].toLowerCase();
    if (raw === 'spring' || raw === 'summer' || raw === 'fall' || raw === 'winter') {
      season = raw as Season;
    }
  }

  // 2. Day & Year detection
  const dayMatch = text.match(/(?:CurrentDay|DayNumber|DayCount)\x00[^\x00]*?\x00(\d{1,2})/);
  if (dayMatch) {
    const parsedDay = parseInt(dayMatch[1], 10);
    if (parsedDay >= 1 && parsedDay <= 28) day = parsedDay;
  }

  const yearMatch = text.match(/(?:CurrentYear|YearNumber)\x00[^\x00]*?\x00(\d{1,2})/);
  if (yearMatch) {
    const parsedYear = parseInt(yearMatch[1], 10);
    if (parsedYear >= 1 && parsedYear <= 99) year = parsedYear;
  }

  // 3. Weather detection
  const weatherMatch = text.match(/(?:TodayWeather|CurrentWeather|WeatherType)[^\x00]*?(Sunny|Rain|Storm|Snow|Windy|Blizzard)/i);
  if (weatherMatch) {
    const rawW = weatherMatch[1].toLowerCase();
    if (['sunny', 'rain', 'storm', 'snow', 'windy', 'blizzard'].includes(rawW)) {
      weather = rawW as Weather;
    }
  }

  const tomorrowMatch = text.match(/(?:TomorrowWeather|ForecastWeather)[^\x00]*?(Sunny|Rain|Storm|Snow|Windy|Blizzard)/i);
  if (tomorrowMatch) {
    const rawTW = tomorrowMatch[1].toLowerCase();
    if (['sunny', 'rain', 'storm', 'snow', 'windy', 'blizzard'].includes(rawTW)) {
      tomorrowWeather = rawTW as Weather;
    }
  }

  return {
    date: { season, day, year },
    weather,
    tomorrowWeather
  };
}

/**
 * Parses a Coral Island .sav file and extracts fishing, museum, temple completions, date, and weather
 */
export function parseCoralIslandSaveFile(fileBuffer: ArrayBuffer): SaveCompletionsResult {
  try {
    const rawBytes = new Uint8Array(fileBuffer);
    const decompressedBytes = decompressUe4SaveGame(rawBytes);

    let decodedText = '';
    for (let i = 0; i < decompressedBytes.length; i += 65536) {
      const chunk = decompressedBytes.subarray(i, Math.min(i + 65536, decompressedBytes.length));
      decodedText += String.fromCharCode.apply(null, Array.from(chunk));
    }

    const caughtFish: Record<string, boolean> = {};
    const donatedMuseum: Record<string, boolean> = {};
    const offeredTemple: Record<string, boolean> = {};

    const catalogIds = Object.keys(FISH_MAP);
    const catalogSet = new Set(catalogIds);

    // 1. Caught Fish from 'fishingCaughtables'
    const caughtablesIdx = decodedText.indexOf('fishingCaughtables');
    if (caughtablesIdx !== -1) {
      const segment = decodedText.substring(caughtablesIdx, caughtablesIdx + 50000);
      const itemMatches = segment.match(/item_\d+/g) || [];
      itemMatches.forEach(id => {
        if (catalogSet.has(id)) caughtFish[id] = true;
      });
    }

    // 2. Museum Donated from 'donatedItemInfo'
    const donatedIdx = decodedText.indexOf('donatedItemInfo');
    if (donatedIdx !== -1) {
      const segment = decodedText.substring(donatedIdx, donatedIdx + 120000);
      const itemMatches = segment.match(/item_\d+/g) || [];
      itemMatches.forEach(id => {
        if (catalogSet.has(id)) donatedMuseum[id] = true;
      });
    }

    // 3. Temple Offerings
    const offeringsIdx = decodedText.indexOf('C_ItemOffering');
    if (offeringsIdx !== -1) {
      const segment = decodedText.substring(offeringsIdx, offeringsIdx + 500000);
      const itemMatches = segment.match(/item_\d+/g) || [];
      itemMatches.forEach(id => {
        if (catalogSet.has(id)) offeredTemple[id] = true;
      });
    }

    const { date, weather, tomorrowWeather } = extractDateAndWeather(decodedText);

    // 4. Player Fishing Level
    let fishingLevel = 1;
    const fishSkillMatch = decodedText.match(/(?:Skill_Fishing|FishingLevel|FishingSkill)[^\x00]*?\x00(\d{1,2})/);
    if (fishSkillMatch) {
      const parsedLvl = parseInt(fishSkillMatch[1], 10);
      if (parsedLvl >= 0 && parsedLvl <= 10) fishingLevel = parsedLvl;
    }

    return {
      success: true,
      gameDate: date,
      weather,
      tomorrowWeather,
      profile: { fishingLevel },
      caughtFish,
      donatedMuseum,
      offeredTemple,
      stats: {
        totalFishCaught: Object.keys(caughtFish).length,
        totalFishDonated: Object.keys(donatedMuseum).length,
        totalFishOffered: Object.keys(offeredTemple).length,
        catalogTotal: catalogIds.length
      }
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error parsing save file';
    return {
      success: false,
      error: errorMsg,
      caughtFish: {},
      donatedMuseum: {},
      offeredTemple: {},
      stats: { totalFishCaught: 0, totalFishDonated: 0, totalFishOffered: 0, catalogTotal: 69 }
    };
  }
}
