import { decompressSaveGame } from './gvasDecompressor';
import { Ue4BinaryReader } from './binaryReader';
import { parseGvasHeader, parseTaggedProperties } from './gvasPropertyParser';

export interface ValidationReport {
  valid: boolean;
  error?: string;
  uncompressedSize: number;
  outerSaveClass: string;
  innerSaveClass: string;
  rootPropertiesCount: number;
  discoveredPlayersCount: number;
}

/**
 * Performs an in-memory round-trip self-test validation on an exported .sav binary
 */
export function validateRepackedSaveGame(repackedBuffer: Uint8Array): ValidationReport {
  try {
    // 1. Decompress Layer 2 chunks
    const { outerPrefixBytes, decompressedBytes } = decompressSaveGame(repackedBuffer);

    // 2. Validate Layer 1 Outer GVAS header
    const outerReader = new Ue4BinaryReader(outerPrefixBytes, 0);
    const outerHeader = parseGvasHeader(outerReader);

    // 3. Validate Layer 3 inner buffer TArray length
    if (decompressedBytes.length < 8) {
      return {
        valid: false,
        error: 'Decompressed buffer too short (< 8 bytes)',
        uncompressedSize: decompressedBytes.length,
        outerSaveClass: outerHeader.saveGameClassName,
        innerSaveClass: '',
        rootPropertiesCount: 0,
        discoveredPlayersCount: 0
      };
    }

    const innerView = new DataView(decompressedBytes.buffer, decompressedBytes.byteOffset, decompressedBytes.byteLength);
    const tarrayLen = innerView.getUint32(0, true);
    if (tarrayLen !== decompressedBytes.length - 4) {
      return {
        valid: false,
        error: `Inner TArray length mismatch: header specifies ${tarrayLen} but buffer is ${decompressedBytes.length - 4}`,
        uncompressedSize: decompressedBytes.length,
        outerSaveClass: outerHeader.saveGameClassName,
        innerSaveClass: '',
        rootPropertiesCount: 0,
        discoveredPlayersCount: 0
      };
    }

    // 4. Validate Layer 3 Inner GVAS Header
    const innerReader = new Ue4BinaryReader(decompressedBytes, 4);
    const innerHeader = parseGvasHeader(innerReader);

    // 5. Validate Layer 4 Root Properties in C_SaveGame
    const rootProps = parseTaggedProperties(innerReader);
    const rootCount = Object.keys(rootProps).length;

    let playersCount = 0;
    if (rootProps['saveData'] && rootProps['saveData'].type === 'StructProperty') {
      const saveDataVal = rootProps['saveData'].value;
      if (typeof saveDataVal === 'object' && !('byteLength' in saveDataVal)) {
        if (saveDataVal['players'] && saveDataVal['players'].type === 'ArrayProperty') {
          playersCount = saveDataVal['players'].elements.length;
        }
      }
    }

    return {
      valid: true,
      uncompressedSize: decompressedBytes.length,
      outerSaveClass: outerHeader.saveGameClassName,
      innerSaveClass: innerHeader.saveGameClassName,
      rootPropertiesCount: rootCount,
      discoveredPlayersCount: playersCount
    };
  } catch (err: unknown) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : 'Unknown validation error',
      uncompressedSize: 0,
      outerSaveClass: '',
      innerSaveClass: '',
      rootPropertiesCount: 0,
      discoveredPlayersCount: 0
    };
  }
}
