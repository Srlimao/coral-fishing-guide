import { Ue4BinaryReader } from '../core/binaryReader';
import { EditableSaveModel } from './saveEditorTypes';

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

export function parseSaveInventory(decompressedBytes: Uint8Array, text: string): EditableSaveModel['inventorySlots'] {
  const inventorySlots: EditableSaveModel['inventorySlots'] = [];

  try {
    const invIdx = text.indexOf('inventory\x00');
    if (invIdx !== -1) {
      const reader = new Ue4BinaryReader(decompressedBytes, invIdx - 4);
      parseFString(reader); // inventory
      parseFString(reader); // ArrayProperty
      reader.readInt64();
      parseFString(reader); // StructProperty
      reader.readUInt8();
      const count = reader.readInt32();
      if (count > 0) {
        parseFString(reader);
        parseFString(reader);
        reader.readInt64();
        parseFString(reader);
        reader.readGuid();
        reader.readUInt8();
        for (let s = 0; s < count; s++) {
          let slotIdx = s;
          let itemId = '';
          let qty = 1;
          let quality = 0;
          while (reader.hasRemaining(4)) {
            const fName = parseFString(reader);
            if (fName === 'None' || !fName) break;
            const fType = parseFString(reader);
            const fSize = Number(reader.readInt64());
            if (fType === 'StrProperty' || fType === 'NameProperty') {
              reader.readUInt8();
              const val = parseFString(reader);
              if (fName === 'ID') itemId = val;
            } else if (fType === 'IntProperty') {
              reader.readUInt8();
              const val = reader.readInt32();
              if (fName === 'desiredSlotIndex') slotIdx = val;
              if (fName === 'quantity') qty = val;
              if (fName === 'quality' || fName === 'itemQuality') quality = val;
            } else if (fType === 'ByteProperty') {
              const enumType = parseFString(reader);
              reader.readUInt8();
              if (enumType === 'None') {
                const b = reader.readUInt8();
                if (fName === 'quality' || fName === 'itemQuality') quality = b;
              } else {
                const eVal = parseFString(reader);
                if (eVal.includes('Bronze')) quality = 1;
                if (eVal.includes('Silver')) quality = 2;
                if (eVal.includes('Gold')) quality = 3;
                if (eVal.includes('Osmium')) quality = 4;
              }
            } else if (fType === 'ArrayProperty') {
              const elemType = parseFString(reader);
              reader.readUInt8();
              const arrCount = reader.readInt32();
              if (elemType === 'ByteProperty') reader.readBytes(arrCount);
              else if (fSize > 4 && reader.hasRemaining(fSize - 4)) reader.readBytes(fSize - 4);
            } else {
              if (fSize > 0 && fSize < 50000 && reader.hasRemaining(fSize)) reader.readBytes(fSize);
              else break;
            }
          }
          if (slotIdx >= 0 && slotIdx < 40) {
            inventorySlots[slotIdx] = { slotIndex: slotIdx, itemId, amount: qty, quality };
          }
        }
      }
    }
  } catch (e) {}

  for (let i = 0; i < 40; i++) {
    if (!inventorySlots[i]) {
      inventorySlots[i] = { slotIndex: i, itemId: '', amount: 0, quality: 0 };
    }
  }

  return inventorySlots;
}
