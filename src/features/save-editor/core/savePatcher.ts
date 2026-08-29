import { Ue4BinaryReader } from './binaryReader';

export interface PropertyLocation {
  propName: string;
  propType: string;
  headerStart: number;
  sizeOffset: number;
  size: number;
  valueOffset: number;
}

/**
 * Finds the exact byte offset and size of a property within a UE4 tagged property buffer
 */
export function findPropertyOffset(
  buffer: Uint8Array,
  targetPropName: string,
  searchStart = 0,
  searchEnd?: number
): PropertyLocation | null {
  const reader = new Ue4BinaryReader(buffer, searchStart);
  const end = searchEnd !== undefined ? searchEnd : buffer.length;

  while (reader.offset < end - 8 && reader.hasRemaining(4)) {
    const headerStart = reader.offset;
    const propName = reader.readFString();
    if (!propName || propName === 'None') break;

    const propType = reader.readFString();
    const sizeOffset = reader.offset;
    const size = Number(reader.readInt64());

    if (propType === 'StructProperty') {
      reader.readFString();
      reader.readGuid();
      reader.readUInt8();
    } else if (propType === 'ArrayProperty' || propType === 'SetProperty') {
      reader.readFString();
      reader.readUInt8();
    } else if (propType === 'MapProperty') {
      reader.readFString();
      reader.readFString();
      reader.readUInt8();
    } else if (propType === 'EnumProperty' || propType === 'ByteProperty') {
      reader.readFString();
      reader.readUInt8();
    } else if (propType === 'BoolProperty') {
      const valueOffset = reader.offset;
      reader.readUInt8();
      reader.readUInt8();
      if (propName === targetPropName) {
        return { propName, propType, headerStart, sizeOffset, size: 0, valueOffset };
      }
      continue;
    } else {
      reader.readUInt8();
    }

    const valueOffset = reader.offset;
    if (propName === targetPropName) {
      return { propName, propType, headerStart, sizeOffset, size, valueOffset };
    }

    reader.offset = valueOffset + size;
  }

  return null;
}

/**
 * Applies all user-modified model values into the decompressed GVAS byte buffer
 */
export function applyStagedModelToBuffer(
  buffer: Uint8Array,
  model: {
    money: number;
    health: number;
    maxHealth: number;
    stamina: number;
    maxStamina: number;
    day: number;
    year: number;
    farmingLevel?: number;
    ranchingLevel?: number;
    foragingLevel?: number;
    miningLevel?: number;
    catchingLevel?: number;
    fishingLevel?: number;
    combatLevel?: number;
    divingLevel?: number;
    npcFriendships?: Record<string, number>;
    completedQuestsCount?: number;
  }
): Uint8Array {
  const result = new Uint8Array(buffer);
  const text = new TextDecoder('latin1').decode(result);
  const view = new DataView(result.buffer, result.byteOffset, result.byteLength);

  // 1. Patch playerCurrentGold
  let goldIdx = text.indexOf('playerCurrentGold\x00');
  while (goldIdx !== -1) {
    const reader = new Ue4BinaryReader(result, goldIdx - 4);
    const pName = reader.readFString();
    const pType = reader.readFString();
    if (pName === 'playerCurrentGold' && pType === 'IntProperty') {
      reader.readInt64();
      reader.readUInt8();
      view.setInt32(reader.offset, model.money, true);
    }
    goldIdx = text.indexOf('playerCurrentGold\x00', goldIdx + 18);
  }

  // 2. Patch Stamina
  const staIdx = text.indexOf('EC_PlayerStatistic::Stamina\x00');
  if (staIdx !== -1) {
    const curIdx = text.indexOf('currentValue\x00\x0e\x00\x00\x00FloatProperty\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00', staIdx);
    if (curIdx !== -1 && curIdx - staIdx < 200) view.setFloat32(curIdx + 40, model.stamina, true);
    const maxIdx = text.indexOf('maximumValue\x00\x0e\x00\x00\x00FloatProperty\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00', staIdx);
    if (maxIdx !== -1 && maxIdx - staIdx < 300) view.setFloat32(maxIdx + 40, model.maxStamina, true);
  }

  // 3. Patch Health
  const hpIdx = text.indexOf('EC_PlayerStatistic::Health\x00');
  if (hpIdx !== -1) {
    const curIdx = text.indexOf('currentValue\x00\x0e\x00\x00\x00FloatProperty\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00', hpIdx);
    if (curIdx !== -1 && curIdx - hpIdx < 200) view.setFloat32(curIdx + 40, model.health, true);
    const maxIdx = text.indexOf('maximumValue\x00\x0e\x00\x00\x00FloatProperty\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00', hpIdx);
    if (maxIdx !== -1 && maxIdx - hpIdx < 300) view.setFloat32(maxIdx + 40, model.maxHealth, true);
  }

  // 4. Patch Date (day and year)
  const curDateIdx = text.indexOf('currentDate\x00');
  if (curDateIdx !== -1) {
    const reader = new Ue4BinaryReader(result, curDateIdx - 4);
    reader.readFString();
    reader.readFString();
    const size = Number(reader.readInt64());
    reader.readFString();
    reader.readGuid();
    reader.readUInt8();
    const end = reader.offset + size;
    while (reader.offset < end && reader.hasRemaining(4)) {
      const fName = reader.readFString();
      if (fName === 'None' || !fName) break;
      const fType = reader.readFString();
      const fSize = Number(reader.readInt64());
      if (fType === 'IntProperty') {
        reader.readUInt8();
        if (fName === 'day') view.setInt32(reader.offset, model.day, true);
        if (fName === 'year') view.setInt32(reader.offset, model.year, true);
        reader.readInt32();
      } else {
        if (fSize > 0 && fSize < 1000 && reader.hasRemaining(fSize)) reader.readBytes(fSize);
        else break;
      }
    }
  }

  // 5. Patch Mastery Skill Levels
  const masteryMap: Array<[string, number | undefined]> = [
    ['Farming', model.farmingLevel],
    ['Ranching', model.ranchingLevel],
    ['Foraging', model.foragingLevel],
    ['Mining', model.miningLevel],
    ['Catching', model.catchingLevel],
    ['Fishing', model.fishingLevel],
    ['Combat', model.combatLevel],
    ['Diving', model.divingLevel]
  ];

  for (const [mt, lvl] of masteryMap) {
    if (lvl === undefined) continue;
    let mtIdx = text.indexOf(`EC_MasteryType::${mt}\x00`);
    while (mtIdx !== -1) {
      const lvlIdx = text.indexOf('Level\x00\x0f\x00\x00\x00UInt32Property\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00', mtIdx);
      if (lvlIdx !== -1 && lvlIdx - mtIdx < 120) {
        view.setUint32(lvlIdx + 34, lvl, true);
      }
      mtIdx = text.indexOf(`EC_MasteryType::${mt}\x00`, mtIdx + 20);
    }
  }

  // 6. Patch NPC Heart Points
  if (model.npcFriendships) {
    for (const [npcName, hearts] of Object.entries(model.npcFriendships)) {
      const heartTarget = hearts * 250;
      let npcIdx = text.indexOf(`${npcName}\x00`);
      while (npcIdx !== -1) {
        const hpIdx = text.indexOf('heartPoints\x00\x0c\x00\x00\x00IntProperty\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00', npcIdx);
        if (hpIdx !== -1 && hpIdx - npcIdx < 120) {
          view.setInt32(hpIdx + 37, heartTarget, true);
          break;
        }
        npcIdx = text.indexOf(`${npcName}\x00`, npcIdx + npcName.length + 1);
      }
    }
  }

  return result;
}
