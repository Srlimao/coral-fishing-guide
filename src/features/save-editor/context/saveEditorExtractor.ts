import { Season } from '../../../types/fishing';
import { Ue4BinaryReader } from '../core/binaryReader';
import { EditableSaveModel } from './saveEditorTypes';
import { parseSaveInventory } from './saveEditorInventoryParser';
import { parseSaveNpcs, parseSaveQuests } from './saveEditorNpcQuestParser';

function parseFString(reader: Ue4BinaryReader): string {
  if (!reader.hasRemaining(4)) return '';
  const len = reader.readInt32();
  if (len === 0) return '';
  if (len > 0) {
    if (!reader.hasRemaining(len)) return '';
    const bytes = reader.readBytes(len);
    return new TextDecoder('utf-8').decode(bytes.subarray(0, len - 1));
  } else {
    const absLen = Math.abs(len);
    if (!reader.hasRemaining(absLen * 2)) return '';
    const bytes = reader.readBytes(absLen * 2);
    return new TextDecoder('utf-16le').decode(bytes.subarray(0, (absLen - 1) * 2));
  }
}

export function extractEditableModel(decompressedBytes: Uint8Array): EditableSaveModel {
  const text = new TextDecoder('latin1').decode(decompressedBytes);

  let playerName = 'Farmer';
  let farmName = 'Coral Farm';
  let gender = 'Female';
  let money = 0;
  let health = 100;
  let maxHealth = 100;
  let stamina = 450;
  let maxStamina = 450;
  let fishingLevel = 0;
  let farmingLevel = 0;
  let ranchingLevel = 0;
  let foragingLevel = 0;
  let miningLevel = 0;
  let catchingLevel = 0;
  let combatLevel = 0;
  let divingLevel = 0;
  let season: Season = 'spring';
  let day = 1;
  let year = 1;
  let weather = 'sunny';
  const tomorrowWeather = 'sunny';

  // 1. Player Info (Name, Farm Name, Gender)
  try {
    const pInfoIdx = text.indexOf('playerInfo\x00');
    if (pInfoIdx !== -1) {
      const reader = new Ue4BinaryReader(decompressedBytes, pInfoIdx - 4);
      parseFString(reader);
      parseFString(reader);
      const size = Number(reader.readInt64());
      parseFString(reader);
      reader.readGuid();
      reader.readUInt8();
      const end = reader.offset + size;
      while (reader.offset < end && reader.hasRemaining(4)) {
        const fName = parseFString(reader);
        if (fName === 'None' || !fName) break;
        const fType = parseFString(reader);
        const fSize = Number(reader.readInt64());
        if (fType === 'StrProperty') {
          reader.readUInt8();
          const v = parseFString(reader);
          if (fName === 'Name') playerName = v;
          if (fName === 'farmName') farmName = v;
        } else if (fType === 'EnumProperty') {
          parseFString(reader);
          reader.readUInt8();
          const v = parseFString(reader);
          if (fName === 'gender') gender = v.includes('Male') && !v.includes('Female') ? 'Male' : 'Female';
        } else {
          if (fSize > 0 && fSize < 50000 && reader.hasRemaining(fSize)) reader.readBytes(fSize);
          else break;
        }
      }
    }
  } catch (e) {}

  // 2. Gold Economy (playerCurrentGold)
  try {
    const goldIdx = text.indexOf('playerCurrentGold\x00');
    if (goldIdx !== -1) {
      const reader = new Ue4BinaryReader(decompressedBytes, goldIdx - 4);
      parseFString(reader);
      parseFString(reader);
      reader.readInt64();
      reader.readUInt8();
      money = reader.readInt32();
    }
  } catch (e) {}

  // 3. Health & Stamina (playerStatistics exact binary offsets)
  try {
    const staIdx = text.indexOf('EC_PlayerStatistic::Stamina\x00');
    if (staIdx !== -1) {
      const curIdx = text.indexOf('currentValue\x00\x0e\x00\x00\x00FloatProperty\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00', staIdx);
      if (curIdx !== -1 && curIdx - staIdx < 200) {
        const reader = new Ue4BinaryReader(decompressedBytes, curIdx + 40);
        stamina = Math.round(reader.readFloat32());
      }
      const maxIdx = text.indexOf('maximumValue\x00\x0e\x00\x00\x00FloatProperty\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00', staIdx);
      if (maxIdx !== -1 && maxIdx - staIdx < 300) {
        const reader = new Ue4BinaryReader(decompressedBytes, maxIdx + 40);
        maxStamina = Math.round(reader.readFloat32());
      }
    }

    const hpIdx = text.indexOf('EC_PlayerStatistic::Health\x00');
    if (hpIdx !== -1) {
      const curIdx = text.indexOf('currentValue\x00\x0e\x00\x00\x00FloatProperty\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00', hpIdx);
      if (curIdx !== -1 && curIdx - hpIdx < 200) {
        const reader = new Ue4BinaryReader(decompressedBytes, curIdx + 40);
        health = Math.round(reader.readFloat32());
      }
      const maxIdx = text.indexOf('maximumValue\x00\x0e\x00\x00\x00FloatProperty\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00', hpIdx);
      if (maxIdx !== -1 && maxIdx - hpIdx < 300) {
        const reader = new Ue4BinaryReader(decompressedBytes, maxIdx + 40);
        maxHealth = Math.round(reader.readFloat32());
      }
    }
  } catch (e) {}

  // 4. Date & Weather
  try {
    const curDateIdx = text.indexOf('currentDate\x00');
    if (curDateIdx !== -1) {
      const reader = new Ue4BinaryReader(decompressedBytes, curDateIdx - 4);
      parseFString(reader);
      parseFString(reader);
      const size = Number(reader.readInt64());
      parseFString(reader);
      reader.readGuid();
      reader.readUInt8();
      const end = reader.offset + size;
      while (reader.offset < end && reader.hasRemaining(4)) {
        const fName = parseFString(reader);
        if (fName === 'None' || !fName) break;
        const fType = parseFString(reader);
        const fSize = Number(reader.readInt64());
        if (fType === 'IntProperty') {
          reader.readUInt8();
          const iv = reader.readInt32();
          if (fName === 'day') day = iv;
          if (fName === 'year') year = iv;
        } else if (fType === 'EnumProperty') {
          parseFString(reader);
          reader.readUInt8();
          const ev = parseFString(reader);
          if (fName === 'season' || ev.includes('EC_Season::')) {
            const s = ev.replace('EC_Season::', '').toLowerCase();
            if (['spring', 'summer', 'fall', 'winter'].includes(s)) season = s as Season;
          }
        } else {
          if (fSize > 0 && fSize < 1000 && reader.hasRemaining(fSize)) reader.readBytes(fSize);
          else break;
        }
      }
    }
  } catch (e) {}

  try {
    const wIdx = text.indexOf('currentWeather\x00');
    if (wIdx !== -1) {
      const reader = new Ue4BinaryReader(decompressedBytes, wIdx - 4);
      parseFString(reader);
      parseFString(reader);
      reader.readInt64();
      parseFString(reader);
      reader.readUInt8();
      weather = parseFString(reader).replace('EC_Weather::', '').toLowerCase();
    }
  } catch (e) {}

  // 5. Mastery Levels (0–10)
  try {
    const masteryTypes = ['Farming', 'Ranching', 'Foraging', 'Mining', 'Catching', 'Fishing', 'Combat', 'Diving'] as const;
    for (const mt of masteryTypes) {
      const mtIdx = text.indexOf(`EC_MasteryType::${mt}\x00`);
      if (mtIdx !== -1) {
        const lvlIdx = text.indexOf('Level\x00\x0f\x00\x00\x00UInt32Property\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00', mtIdx);
        if (lvlIdx !== -1 && lvlIdx - mtIdx < 120) {
          const reader = new Ue4BinaryReader(decompressedBytes, lvlIdx + 34);
          const lvl = reader.readUInt32();
          if (mt === 'Farming') farmingLevel = lvl;
          if (mt === 'Ranching') ranchingLevel = lvl;
          if (mt === 'Foraging') foragingLevel = lvl;
          if (mt === 'Mining') miningLevel = lvl;
          if (mt === 'Catching') catchingLevel = lvl;
          if (mt === 'Fishing') fishingLevel = lvl;
          if (mt === 'Combat') combatLevel = lvl;
          if (mt === 'Diving') divingLevel = lvl;
        }
      }
    }
  } catch (e) {}

  // 6. Subsystem parsers
  const inventorySlots = parseSaveInventory(decompressedBytes, text);
  const { npcFriendships, npcRelationships, availablePlayers } = parseSaveNpcs(decompressedBytes, text, 0);
  const { completedQuestsCount, totalQuestsCount } = parseSaveQuests(decompressedBytes, text);

  const donatedCount = (text.match(/donatedItemInfo/g) || []).length;
  const offeredCount = (text.match(/offeringGroupsMap/g) || []).length;

  return {
    playerName,
    farmName,
    gender,
    money,
    health,
    maxHealth,
    stamina,
    maxStamina,
    fishingLevel,
    farmingLevel,
    ranchingLevel,
    foragingLevel,
    miningLevel,
    catchingLevel,
    combatLevel,
    divingLevel,
    season,
    day,
    year,
    weather,
    tomorrowWeather,
    inventorySlots,
    npcFriendships,
    npcRelationships,
    townRankScore: 1250,
    donatedCount,
    offeredCount,
    completedQuestsCount,
    totalQuestsCount,
    availablePlayers,
    selectedPlayerIndex: 0
  };
}
