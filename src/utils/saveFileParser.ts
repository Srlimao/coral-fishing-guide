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

function extractDateAndWeather(decompressedBytes: Uint8Array): { date?: SaveGameDate; weather?: Weather; tomorrowWeather?: Weather } {
  const view = new DataView(decompressedBytes.buffer, decompressedBytes.byteOffset, decompressedBytes.byteLength);

  function readFString(offset: number): { str: string; next: number } | null {
    if (offset + 4 > decompressedBytes.length) return null;
    const len = view.getInt32(offset, true);
    if (len === 0) return { str: '', next: offset + 4 };
    if (len > 0 && len < 2000 && offset + 4 + len <= decompressedBytes.length) {
      const bytes = decompressedBytes.subarray(offset + 4, offset + 4 + len - 1);
      const str = new TextDecoder('utf-8').decode(bytes);
      return { str, next: offset + 4 + len };
    }
    return null;
  }

  let season: Season = 'spring';
  let day = 1;
  let year = 1;
  let weather: Weather = 'sunny';
  let tomorrowWeather: Weather | undefined = undefined;

  const maxScan = Math.min(decompressedBytes.length - 30, 150000);
  let pos = 0;

  while (pos < maxScan) {
    const nameRes = readFString(pos);
    if (nameRes && nameRes.str) {
      if (nameRes.str === 'currentDate') {
        const typeRes = readFString(nameRes.next);
        if (typeRes && typeRes.str === 'StructProperty') {
          const structSize = Number(view.getBigUint64(typeRes.next, true));
          const structType = readFString(typeRes.next + 8);
          if (structType && structType.str === 'C_TimeDate') {
            const structStart = structType.next + 17;
            let sp = structStart;
            while (sp < structStart + structSize && sp < decompressedBytes.length - 10) {
              const sName = readFString(sp);
              if (!sName || !sName.str || sName.str === 'None') break;
              const sType = readFString(sName.next);
              if (!sType || !sType.str) break;
              const sValOff = sType.next + 8 + 1;

              if (sName.str === 'day' && sType.str === 'IntProperty') {
                const parsedDay = view.getInt32(sValOff, true);
                if (parsedDay >= 1 && parsedDay <= 28) day = parsedDay;
                sp = sValOff + 4;
              } else if (sName.str === 'year' && sType.str === 'IntProperty') {
                const parsedYear = view.getInt32(sValOff, true);
                if (parsedYear >= 1 && parsedYear <= 99) year = parsedYear;
                sp = sValOff + 4;
              } else if (sName.str === 'season' && sType.str === 'EnumProperty') {
                const eType = readFString(sType.next + 8);
                if (eType) {
                  const eVal = readFString(eType.next + 1);
                  if (eVal && eVal.str) {
                    const rawS = eVal.str.replace(/^EC_Season::/i, '').toLowerCase();
                    if (['spring', 'summer', 'fall', 'winter'].includes(rawS)) {
                      season = rawS as Season;
                    }
                    sp = eVal.next;
                  } else {
                    sp++;
                  }
                } else {
                  sp++;
                }
              } else {
                sp++;
              }
            }
          }
        }
      } else if (nameRes.str === 'currentWeather' || nameRes.str === 'yesterdayWeather' || nameRes.str === 'tomorrowWeather') {
        const typeRes = readFString(nameRes.next);
        if (typeRes && typeRes.str === 'EnumProperty') {
          const eType = readFString(typeRes.next + 8);
          if (eType) {
            const eVal = readFString(eType.next + 1);
            if (eVal && eVal.str) {
              const rawW = eVal.str.replace(/^EC_Weather::/i, '').toLowerCase();
              if (['sunny', 'rain', 'storm', 'snow', 'windy', 'blizzard'].includes(rawW)) {
                if (nameRes.str === 'currentWeather') weather = rawW as Weather;
                else if (nameRes.str === 'tomorrowWeather') tomorrowWeather = rawW as Weather;
              }
            }
          }
        }
      }
    }
    pos++;
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

    const { date, weather, tomorrowWeather } = extractDateAndWeather(decompressedBytes);

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
