import { inflate } from 'pako';
import { FISH_MAP } from '../data/fishData';

export interface SaveCompletionsResult {
  success: boolean;
  error?: string;
  worldName?: string;
  playerName?: string;
  farmName?: string;
  gameDate?: {
    season: string;
    day: number;
    year: number;
  };
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
    // Locate next 0x9E2A83C1 block magic
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
    // Total compressed size
    hPos += 8;
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
    // If no compressed blocks found, return raw buffer (uncompressed GVAS)
    return buffer;
  }

  // Concatenate all decompressed chunks
  const totalLength = decompressedChunks.reduce((acc, c) => acc + c.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of decompressedChunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

/**
 * Parses a Coral Island .sav file and extracts fishing, museum, and temple completions
 */
export function parseCoralIslandSaveFile(fileBuffer: ArrayBuffer): SaveCompletionsResult {
  try {
    const rawBytes = new Uint8Array(fileBuffer);
    const decompressedBytes = decompressUe4SaveGame(rawBytes);

    // Decode to latin1 string for fast binary string scanning
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

    // 1. Parse Caught Fish from 'fishingCaughtables'
    const caughtablesIdx = decodedText.indexOf('fishingCaughtables');
    if (caughtablesIdx !== -1) {
      const segment = decodedText.substring(caughtablesIdx, caughtablesIdx + 50000);
      const itemMatches = segment.match(/item_\d+/g) || [];
      itemMatches.forEach(id => {
        if (catalogSet.has(id)) {
          caughtFish[id] = true;
        }
      });
    }

    // 2. Parse Museum Donated from 'donatedItemInfo'
    const donatedIdx = decodedText.indexOf('donatedItemInfo');
    if (donatedIdx !== -1) {
      const segment = decodedText.substring(donatedIdx, donatedIdx + 120000);
      const itemMatches = segment.match(/item_\d+/g) || [];
      itemMatches.forEach(id => {
        if (catalogSet.has(id)) {
          donatedMuseum[id] = true;
        }
      });
    }

    // 3. Parse Temple Offerings
    const offeringsIdx = decodedText.indexOf('C_ItemOffering');
    if (offeringsIdx !== -1) {
      const segment = decodedText.substring(offeringsIdx, offeringsIdx + 500000);
      const itemMatches = segment.match(/item_\d+/g) || [];
      itemMatches.forEach(id => {
        if (catalogSet.has(id)) {
          offeredTemple[id] = true;
        }
      });
    }

    const totalCaught = Object.keys(caughtFish).length;
    const totalDonated = Object.keys(donatedMuseum).length;
    const totalOffered = Object.keys(offeredTemple).length;

    return {
      success: true,
      caughtFish,
      donatedMuseum,
      offeredTemple,
      stats: {
        totalFishCaught: totalCaught,
        totalFishDonated: totalDonated,
        totalFishOffered: totalOffered,
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
      stats: {
        totalFishCaught: 0,
        totalFishDonated: 0,
        totalFishOffered: 0,
        catalogTotal: 69
      }
    };
  }
}
