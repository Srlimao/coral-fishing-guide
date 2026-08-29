import { inflate, deflate } from 'pako';
import { Ue4BinaryReader } from './binaryReader';
import { Ue4BinaryWriter } from './binaryWriter';

export const UE4_PACKAGE_MAGIC = 0x9e2a83c1;
export const CHUNK_BLOCK_SIZE = 131072; // 128 KB

export interface DecompressedSavePackage {
  outerPrefixBytes: Uint8Array;
  outerTrailingBytes: Uint8Array;
  decompressedBytes: Uint8Array;
}

/**
 * Decompresses a Coral Island .sav file into uncompressed GVAS byte stream
 */
export function decompressSaveGame(rawBuffer: Uint8Array): DecompressedSavePackage {
  let magicIdx = -1;
  const view = new DataView(rawBuffer.buffer, rawBuffer.byteOffset, rawBuffer.byteLength);

  for (let i = 0; i < rawBuffer.length - 16; i++) {
    if (view.getUint32(i, true) === UE4_PACKAGE_MAGIC) {
      magicIdx = i;
      break;
    }
  }

  if (magicIdx === -1) {
    throw new Error('Invalid Coral Island save file: Compression magic 0x9E2A83C1 not found.');
  }

  const outerPrefixBytes = rawBuffer.subarray(0, magicIdx);
  const decompressedChunks: Uint8Array[] = [];
  let cur = magicIdx;

  while (cur < rawBuffer.length) {
    if (cur + 48 > rawBuffer.length) break;

    const magic = Number(view.getBigUint64(cur, true));
    if (magic !== UE4_PACKAGE_MAGIC && (magic & 0xffffffff) !== UE4_PACKAGE_MAGIC) {
      break;
    }

    const chunkCompSize = Number(view.getBigUint64(cur + 32, true));
    if (cur + 48 + chunkCompSize > rawBuffer.length) {
      throw new Error(`Chunk size ${chunkCompSize} exceeds buffer bounds at offset ${cur}`);
    }

    const chunkData = rawBuffer.subarray(cur + 48, cur + 48 + chunkCompSize);
    try {
      const decomp = inflate(chunkData);
      decompressedChunks.push(decomp);
    } catch (err: unknown) {
      throw new Error(`ZLIB Inflation failed at offset ${cur}: ${err instanceof Error ? err.message : String(err)}`);
    }

    cur += 48 + chunkCompSize;
  }

  const outerTrailingBytes = rawBuffer.subarray(cur);

  const totalLength = decompressedChunks.reduce((sum, c) => sum + c.length, 0);
  const decompressedBytes = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of decompressedChunks) {
    decompressedBytes.set(chunk, offset);
    offset += chunk.length;
  }

  return {
    outerPrefixBytes,
    outerTrailingBytes,
    decompressedBytes
  };
}

/**
 * Re-compresses uncompressed payload and packs into valid Unreal Engine .sav container
 */
export function recompressSaveGame(
  outerPrefixBytes: Uint8Array,
  decompressedBytes: Uint8Array,
  outerTrailingBytes: Uint8Array = new Uint8Array(0)
): Uint8Array {
  // 1. Ensure inner 4-byte TArray length is synchronized at offset 0
  const payload = new Uint8Array(decompressedBytes.length);
  payload.set(decompressedBytes);
  const innerPayloadView = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
  innerPayloadView.setUint32(0, payload.length - 4, true);

  // 2. Compress payload into sequential 128 KB UE4 package chunks
  const chunkWriter = new Ue4BinaryWriter(payload.length / 2);
  const totalLength = payload.length;

  for (let i = 0; i < totalLength; i += CHUNK_BLOCK_SIZE) {
    const block = payload.subarray(i, Math.min(i + CHUNK_BLOCK_SIZE, totalLength));
    const compBlock = deflate(block);

    const chunkSize = compBlock.length;
    const uncompSize = block.length;

    // 48-byte chunk header
    chunkWriter.writeUInt64(BigInt(UE4_PACKAGE_MAGIC));
    chunkWriter.writeUInt64(BigInt(CHUNK_BLOCK_SIZE));
    chunkWriter.writeUInt64(BigInt(chunkSize));
    chunkWriter.writeUInt64(BigInt(uncompSize));
    chunkWriter.writeUInt64(BigInt(chunkSize));
    chunkWriter.writeUInt64(BigInt(uncompSize));

    chunkWriter.writeBytes(compBlock);
  }

  const compressedStream = chunkWriter.getBytes();

  // 3. Patch outer ArrayProperty header in outerPrefixBytes
  const newOuterHeader = new Uint8Array(outerPrefixBytes.length);
  newOuterHeader.set(outerPrefixBytes);

  const prefixText = new TextDecoder('latin1').decode(newOuterHeader);
  const propNameIdx = prefixText.indexOf('compressedSaveData\x00');
  if (propNameIdx !== -1) {
    const reader = new Ue4BinaryReader(newOuterHeader, propNameIdx - 4);
    reader.readFString(); // 'compressedSaveData'
    reader.readFString(); // 'ArrayProperty'
    const propSizeOffset = reader.offset;
    reader.readInt64();
    reader.readFString(); // 'ByteProperty'
    reader.readUInt8(); // terminator
    const arrayLenOffset = reader.offset;

    const outerHeaderView = new DataView(newOuterHeader.buffer, newOuterHeader.byteOffset, newOuterHeader.byteLength);
    outerHeaderView.setBigUint64(propSizeOffset, BigInt(compressedStream.length + 4), true);
    outerHeaderView.setUint32(arrayLenOffset, compressedStream.length, true);
  }

  // 4. Concatenate new outer header + compressed chunks + trailing bytes
  const finalSize = newOuterHeader.length + compressedStream.length + outerTrailingBytes.length;
  const result = new Uint8Array(finalSize);
  result.set(newOuterHeader, 0);
  result.set(compressedStream, newOuterHeader.length);
  if (outerTrailingBytes.length > 0) {
    result.set(outerTrailingBytes, newOuterHeader.length + compressedStream.length);
  }

  return result;
}
