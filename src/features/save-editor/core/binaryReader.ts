/**
 * Unreal Engine 4 Little-Endian Binary Stream Reader
 */
export class Ue4BinaryReader {
  public buffer: Uint8Array;
  public view: DataView;
  public offset: number;

  constructor(input: Uint8Array | ArrayBuffer, offset = 0) {
    if (input instanceof Uint8Array) {
      this.buffer = input;
      this.view = new DataView(input.buffer, input.byteOffset, input.byteLength);
    } else {
      this.buffer = new Uint8Array(input);
      this.view = new DataView(input);
    }
    this.offset = offset;
  }

  public hasRemaining(bytes = 1): boolean {
    return this.offset + bytes <= this.buffer.length;
  }

  public readUInt8(): number {
    if (!this.hasRemaining(1)) throw new Error(`Offset ${this.offset} out of bounds for readUInt8`);
    const val = this.view.getUint8(this.offset);
    this.offset += 1;
    return val;
  }

  public readInt16(): number {
    if (!this.hasRemaining(2)) throw new Error(`Offset ${this.offset} out of bounds for readInt16`);
    const val = this.view.getInt16(this.offset, true);
    this.offset += 2;
    return val;
  }

  public readUInt16(): number {
    if (!this.hasRemaining(2)) throw new Error(`Offset ${this.offset} out of bounds for readUInt16`);
    const val = this.view.getUint16(this.offset, true);
    this.offset += 2;
    return val;
  }

  public readInt32(): number {
    if (!this.hasRemaining(4)) throw new Error(`Offset ${this.offset} out of bounds for readInt32`);
    const val = this.view.getInt32(this.offset, true);
    this.offset += 4;
    return val;
  }

  public readUInt32(): number {
    if (!this.hasRemaining(4)) throw new Error(`Offset ${this.offset} out of bounds for readUInt32`);
    const val = this.view.getUint32(this.offset, true);
    this.offset += 4;
    return val;
  }

  public readInt64(): bigint {
    if (!this.hasRemaining(8)) throw new Error(`Offset ${this.offset} out of bounds for readInt64`);
    const val = this.view.getBigInt64(this.offset, true);
    this.offset += 8;
    return val;
  }

  public readUInt64(): bigint {
    if (!this.hasRemaining(8)) throw new Error(`Offset ${this.offset} out of bounds for readUInt64`);
    const val = this.view.getBigUint64(this.offset, true);
    this.offset += 8;
    return val;
  }

  public readFloat32(): number {
    if (!this.hasRemaining(4)) throw new Error(`Offset ${this.offset} out of bounds for readFloat32`);
    const val = this.view.getFloat32(this.offset, true);
    this.offset += 4;
    return val;
  }

  public readFloat(): number {
    return this.readFloat32();
  }

  public readBytes(length: number): Uint8Array {
    if (!this.hasRemaining(length)) throw new Error(`Offset ${this.offset}+${length} out of bounds`);
    const slice = this.buffer.subarray(this.offset, this.offset + length);
    this.offset += length;
    return slice;
  }

  public readFixedAsciiString(length: number): string {
    const bytes = this.readBytes(length);
    return new TextDecoder('latin1').decode(bytes);
  }

  public readFString(): string {
    if (!this.hasRemaining(4)) return '';
    const len = this.readInt32();
    if (len === 0) return '';

    if (len > 0) {
      if (!this.hasRemaining(len)) throw new Error(`FString UTF-8 len ${len} out of bounds at ${this.offset}`);
      const strBytes = this.buffer.subarray(this.offset, this.offset + len - 1);
      this.offset += len;
      return new TextDecoder('utf-8').decode(strBytes);
    } else {
      const charCount = -len;
      const byteLen = charCount * 2;
      if (!this.hasRemaining(byteLen)) throw new Error(`FString UTF-16 len ${charCount} out of bounds at ${this.offset}`);
      const strBytes = this.buffer.subarray(this.offset, this.offset + byteLen - 2);
      this.offset += byteLen;
      return new TextDecoder('utf-16le').decode(strBytes);
    }
  }

  public readFName(): string {
    return this.readFString();
  }

  public readGuid(): string {
    const bytes = this.readBytes(16);
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}
