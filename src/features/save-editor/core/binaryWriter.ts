/**
 * Unreal Engine 4 Little-Endian Dynamic Binary Stream Writer
 */
export class Ue4BinaryWriter {
  private buffer: Uint8Array;
  private view: DataView;
  public offset: number;

  constructor(initialCapacity = 65536) {
    this.buffer = new Uint8Array(initialCapacity);
    this.view = new DataView(this.buffer.buffer);
    this.offset = 0;
  }

  private ensureCapacity(neededBytes: number): void {
    const required = this.offset + neededBytes;
    if (required <= this.buffer.length) return;

    let newCap = Math.max(this.buffer.length * 2, 65536);
    while (newCap < required) {
      newCap *= 2;
    }

    const newBuf = new Uint8Array(newCap);
    newBuf.set(this.buffer.subarray(0, this.offset));
    this.buffer = newBuf;
    this.view = new DataView(this.buffer.buffer);
  }

  public writeUInt8(val: number): void {
    this.ensureCapacity(1);
    this.view.setUint8(this.offset, val);
    this.offset += 1;
  }

  public writeInt16(val: number): void {
    this.ensureCapacity(2);
    this.view.setInt16(this.offset, val, true);
    this.offset += 2;
  }

  public writeUInt16(val: number): void {
    this.ensureCapacity(2);
    this.view.setUint16(this.offset, val, true);
    this.offset += 2;
  }

  public writeInt32(val: number): void {
    this.ensureCapacity(4);
    this.view.setInt32(this.offset, val, true);
    this.offset += 4;
  }

  public writeUInt32(val: number): void {
    this.ensureCapacity(4);
    this.view.setUint32(this.offset, val, true);
    this.offset += 4;
  }

  public writeInt64(val: bigint | number): void {
    this.ensureCapacity(8);
    const bigVal = typeof val === 'bigint' ? val : BigInt(val);
    this.view.setBigInt64(this.offset, bigVal, true);
    this.offset += 8;
  }

  public writeUInt64(val: bigint | number): void {
    this.ensureCapacity(8);
    const bigVal = typeof val === 'bigint' ? val : BigInt(val);
    this.view.setBigUint64(this.offset, bigVal, true);
    this.offset += 8;
  }

  public writeFloat32(val: number): void {
    this.ensureCapacity(4);
    this.view.setFloat32(this.offset, val, true);
    this.offset += 4;
  }

  public writeBytes(bytes: Uint8Array): void {
    this.ensureCapacity(bytes.length);
    this.buffer.set(bytes, this.offset);
    this.offset += bytes.length;
  }

  public writeFixedAsciiString(str: string): void {
    const bytes = new TextEncoder().encode(str);
    this.writeBytes(bytes);
  }

  public writeFString(str: string): void {
    if (!str || str.length === 0) {
      this.writeInt32(0);
      return;
    }

    // Check if string contains non-ASCII characters that necessitate UTF-16
    let isAsciiOnly = true;
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 127) {
        isAsciiOnly = false;
        break;
      }
    }

    if (isAsciiOnly) {
      const utf8 = new TextEncoder().encode(str);
      this.writeInt32(utf8.length + 1); // Length includes null-terminator
      this.writeBytes(utf8);
      this.writeUInt8(0);
    } else {
      // UTF-16LE encoding (negative length in UE4)
      const utf16Len = str.length + 1;
      this.writeInt32(-utf16Len);
      for (let i = 0; i < str.length; i++) {
        this.writeUInt16(str.charCodeAt(i));
      }
      this.writeUInt16(0); // Null terminator
    }
  }

  public writeFName(name: string): void {
    this.writeFString(name);
  }

  public writeGuid(guidHex: string): void {
    const cleanHex = guidHex.replace(/[^a-fA-F0-9]/g, '');
    const bytes = new Uint8Array(16);
    for (let i = 0; i < 16; i++) {
      const byteHex = cleanHex.substring(i * 2, i * 2 + 2);
      bytes[i] = parseInt(byteHex || '00', 16);
    }
    this.writeBytes(bytes);
  }

  public patchInt32(offset: number, val: number): void {
    this.view.setInt32(offset, val, true);
  }

  public patchUInt32(offset: number, val: number): void {
    this.view.setUint32(offset, val, true);
  }

  public patchUInt64(offset: number, val: bigint | number): void {
    const bigVal = typeof val === 'bigint' ? val : BigInt(val);
    this.view.setBigUint64(offset, bigVal, true);
  }

  public getBytes(): Uint8Array {
    return this.buffer.subarray(0, this.offset);
  }
}
