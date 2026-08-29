import { Ue4BinaryReader } from '../core/binaryReader';
import { CORAL_ISLAND_NPCS } from '../data/npcCatalog';
import { SavePlayerEntry } from './saveEditorTypes';

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

export function parseSavePlayers(
  decompressedBytes: Uint8Array,
  text: string
): SavePlayerEntry[] {
  const playerMatches = [...text.matchAll(/playerInfo\x00\x0f\x00\x00\x00StructProperty/g)];
  const players: SavePlayerEntry[] = [];

  for (let i = 0; i < playerMatches.length; i++) {
    const pInfoOffset = playerMatches[i].index!;
    const reader = new Ue4BinaryReader(decompressedBytes, pInfoOffset - 4);
    parseFString(reader); // playerInfo
    parseFString(reader); // StructProperty
    const size = Number(reader.readInt64());
    parseFString(reader); // C_PlayerInfo
    reader.readGuid();
    reader.readUInt8();

    let pName = '';
    let fName = '';
    let gender = 'Female';

    const end = reader.offset + size;
    while (reader.offset < end && reader.hasRemaining(4)) {
      const propName = parseFString(reader);
      if (propName === 'None' || !propName) break;
      const propType = parseFString(reader);
      const propSize = Number(reader.readInt64());

      if (propType === 'StrProperty') {
        reader.readUInt8();
        const v = parseFString(reader);
        if (propName === 'Name') pName = v;
        if (propName === 'farmName') fName = v;
      } else if (propType === 'EnumProperty') {
        parseFString(reader);
        reader.readUInt8();
        const v = parseFString(reader);
        if (propName === 'gender') gender = v.includes('Male') && !v.includes('Female') ? 'Male' : 'Female';
      } else {
        if (propSize > 0 && propSize < 1000 && reader.hasRemaining(propSize)) reader.readBytes(propSize);
        else break;
      }
    }

    if (!pName) pName = `Player ${i + 1}`;

    // Find this player's preceding npcRelationshipData
    const lookback = text.substring(Math.max(0, pInfoOffset - 1500000), pInfoOffset);
    const relOffsetInLookback = lookback.lastIndexOf('npcRelationshipData\x00\x0e\x00\x00\x00ArrayProperty');

    const npcFriendships: Record<string, number> = {};
    for (const npc of CORAL_ISLAND_NPCS) {
      npcFriendships[npc.name] = 0;
    }

    if (relOffsetInLookback !== -1) {
      const relOffset = Math.max(0, pInfoOffset - 1500000) + relOffsetInLookback;
      const playerRelSlice = text.substring(relOffset, pInfoOffset);

      for (const npc of CORAL_ISLAND_NPCS) {
        let nIdx = playerRelSlice.indexOf(`${npc.name}\x00`);
        while (nIdx !== -1) {
          const itemSlice = playerRelSlice.substring(nIdx, nIdx + 300);
          if (itemSlice.includes('heartPoints\x00\x0c\x00\x00\x00IntProperty\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00')) {
            const hpIdx = itemSlice.indexOf('heartPoints\x00\x0c\x00\x00\x00IntProperty\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00');
            const absOffset = relOffset + nIdx + hpIdx + 37;
            const pReader = new Ue4BinaryReader(decompressedBytes, absOffset);
            const pts = pReader.readInt32();

            if (pts >= 0 && pts <= 15000) {
              npcFriendships[npc.name] = Math.max(0, Math.min(10, Math.floor(pts / 250)));
            }
            break;
          }
          nIdx = playerRelSlice.indexOf(`${npc.name}\x00`, nIdx + npc.name.length + 1);
        }
      }
    }

    players.push({
      index: i,
      name: pName,
      farmName: fName,
      gender,
      npcFriendships
    });
  }

  // Fallback for singleplayer saves
  if (players.length === 0 || (players.length === 1 && Object.values(players[0].npcFriendships).every(v => v === 0))) {
    const npcIdx = text.indexOf('NPCSaveData\x00');
    if (npcIdx !== -1) {
      const topNpcSlice = text.substring(npcIdx, npcIdx + 7500000);
      for (const npc of CORAL_ISLAND_NPCS) {
        let nIdx = topNpcSlice.indexOf(`${npc.name}\x00`);
        while (nIdx !== -1) {
          const itemSlice = topNpcSlice.substring(nIdx, nIdx + 300);
          if (itemSlice.includes('heartPoints\x00\x0c\x00\x00\x00IntProperty\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00')) {
            const hpIdx = itemSlice.indexOf('heartPoints\x00\x0c\x00\x00\x00IntProperty\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00');
            const absOffset = npcIdx + nIdx + hpIdx + 37;
            const pReader = new Ue4BinaryReader(decompressedBytes, absOffset);
            const pts = pReader.readInt32();
            if (pts >= 0 && pts <= 15000 && players[0]) {
              players[0].npcFriendships[npc.name] = Math.max(0, Math.min(10, Math.floor(pts / 250)));
            }
            break;
          }
          nIdx = topNpcSlice.indexOf(`${npc.name}\x00`, nIdx + npc.name.length + 1);
        }
      }
    }
  }

  return players;
}

export function parseSaveNpcs(
  decompressedBytes: Uint8Array,
  text: string,
  targetPlayerIndex = 0
): {
  npcFriendships: Record<string, number>;
  npcRelationships: Record<string, { hearts: number; rawPoints: number; status: string; talkedToday: boolean }>;
  availablePlayers: SavePlayerEntry[];
} {
  const availablePlayers = parseSavePlayers(decompressedBytes, text);
  const activePlayer = availablePlayers[targetPlayerIndex] || availablePlayers[0];

  const npcFriendships = activePlayer ? { ...activePlayer.npcFriendships } : {};
  const npcRelationships: Record<string, { hearts: number; rawPoints: number; status: string; talkedToday: boolean }> = {};

  for (const npc of CORAL_ISLAND_NPCS) {
    const hearts = npcFriendships[npc.name] ?? 0;
    npcRelationships[npc.name] = {
      hearts,
      rawPoints: hearts * 250,
      status: 'NONE',
      talkedToday: false
    };
  }

  return { npcFriendships, npcRelationships, availablePlayers };
}

export function parseSaveQuests(
  decompressedBytes: Uint8Array,
  text: string
): { completedQuestsCount: number; totalQuestsCount: number } {
  let completedQuestsCount = 0;
  let totalQuestsCount = 0;

  try {
    const qIdx = text.indexOf('quests\x00\x0c\x00\x00\x00MapProperty');
    if (qIdx !== -1) {
      const reader = new Ue4BinaryReader(decompressedBytes, qIdx - 4);
      parseFString(reader); // quests
      parseFString(reader); // MapProperty
      reader.readInt64();
      parseFString(reader); // NameProperty
      parseFString(reader); // EnumProperty
      reader.readUInt8();
      reader.readInt32(); // 0
      const count = reader.readInt32();
      totalQuestsCount = count;

      for (let q = 0; q < count; q++) {
        parseFString(reader); // questId
        const qState = parseFString(reader);
        if (qState.includes('Completed')) {
          completedQuestsCount++;
        }
      }
    }
  } catch (e) {}

  return { completedQuestsCount, totalQuestsCount };
}
