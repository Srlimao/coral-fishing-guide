import { Ue4BinaryReader } from './binaryReader';
import {
  GvasHeader,
  GvasProperty,
  GvasPropertyType,
  StructGvasProperty,
  ArrayGvasProperty,
  MapGvasProperty,
  SetGvasProperty,
  EnumGvasProperty,
  ByteGvasProperty,
  BoolGvasProperty,
  IntGvasProperty,
  Int64GvasProperty,
  FloatGvasProperty,
  StrGvasProperty,
  GenericGvasProperty
} from '../types/saveEditor';

export function parseGvasHeader(reader: Ue4BinaryReader): GvasHeader {
  const magic = reader.readFixedAsciiString(4);
  if (magic !== 'GVAS') {
    throw new Error(`Invalid GVAS header magic: expected GVAS, got ${magic}`);
  }

  const saveGameVersion = reader.readInt32();
  const packageVersion = reader.readInt32();
  const engineMajor = reader.readUInt16();
  const engineMinor = reader.readUInt16();
  const enginePatch = reader.readUInt16();
  const engineBuild = reader.readUInt32();
  const engineBranch = reader.readFString();
  const customVersionFormat = reader.readInt32();
  const customVersionCount = reader.readInt32();

  const customVersions = [];
  for (let i = 0; i < customVersionCount; i++) {
    const guid = reader.readGuid();
    const version = reader.readInt32();
    customVersions.push({ guid, version });
  }

  const saveGameClassName = reader.readFString();

  return {
    magic,
    saveGameVersion,
    packageVersion,
    engineMajor,
    engineMinor,
    enginePatch,
    engineBuild,
    engineBranch,
    customVersionFormat,
    customVersions,
    saveGameClassName
  };
}

export function parseTaggedProperties(
  reader: Ue4BinaryReader,
  endOffset?: number
): Record<string, GvasProperty> {
  const properties: Record<string, GvasProperty> = {};
  const maxOffset = endOffset !== undefined ? endOffset : reader.buffer.length;

  while (reader.offset < maxOffset && reader.hasRemaining(4)) {
    const propName = reader.readFString();
    if (!propName || propName === 'None') {
      break;
    }

    const propType = reader.readFString() as GvasPropertyType;
    const propSize = Number(reader.readInt64());
    const startPayloadOffset = reader.offset;

    try {
      const prop = parseSingleProperty(reader, propName, propType, propSize);
      properties[propName] = prop;
    } catch (err) {
      console.warn(`Failed parsing property ${propName} (${propType}) at offset ${startPayloadOffset}:`, err);
      // Fallback skip
      reader.offset = Math.min(startPayloadOffset + propSize + 1, maxOffset);
    }
  }

  return properties;
}

function parseSingleProperty(
  reader: Ue4BinaryReader,
  name: string,
  type: GvasPropertyType,
  size: number
): GvasProperty {
  if (type === 'BoolProperty') {
    const valueByte = reader.readUInt8();
    reader.readUInt8(); // terminator
    return { name, type, size: 0, value: valueByte === 1 } as BoolGvasProperty;
  }

  if (type === 'IntProperty') {
    reader.readUInt8();
    return { name, type, size, value: reader.readInt32() } as IntGvasProperty;
  }

  if (type === 'Int64Property') {
    reader.readUInt8();
    return { name, type, size, value: reader.readInt64() } as Int64GvasProperty;
  }

  if (type === 'FloatProperty') {
    reader.readUInt8();
    return { name, type, size, value: reader.readFloat32() } as FloatGvasProperty;
  }

  if (type === 'StrProperty' || type === 'NameProperty') {
    reader.readUInt8();
    return { name, type, size, value: reader.readFString() } as StrGvasProperty;
  }

  if (type === 'EnumProperty') {
    const enumType = reader.readFString();
    reader.readUInt8();
    const value = reader.readFString();
    return { name, type, size, enumType, value } as EnumGvasProperty;
  }

  if (type === 'ByteProperty') {
    const enumType = reader.readFString();
    reader.readUInt8();
    const value = enumType === 'None' ? reader.readUInt8() : reader.readFString();
    return { name, type, size, enumType, value } as ByteGvasProperty;
  }

  if (type === 'StructProperty') {
    const structType = reader.readFString();
    const structGuid = reader.readGuid();
    reader.readUInt8(); // terminator
    const payloadStart = reader.offset;
    const payloadEnd = payloadStart + size;

    let value: Record<string, GvasProperty> | Uint8Array;
    // Known atomic structs or fallback to raw
    if (['DateTime', 'LinearColor', 'Vector', 'Rotator', 'Guid'].includes(structType)) {
      value = reader.readBytes(size);
    } else {
      try {
        value = parseTaggedProperties(reader, payloadEnd);
        reader.offset = payloadEnd; // ensure aligned
      } catch {
        reader.offset = payloadStart;
        value = reader.readBytes(size);
      }
    }
    return { name, type, size, structType, structGuid, value } as StructGvasProperty;
  }

  if (type === 'ArrayProperty') {
    const elemType = reader.readFString() as GvasPropertyType;
    reader.readUInt8();
    const count = reader.readInt32();
    const elements: any[] = [];

    if (elemType === 'StructProperty') {
      reader.readFString(); // structName
      reader.readFString(); // sType
      const sSize = Number(reader.readInt64());
      const innerStruct = reader.readFString();
      const sGuid = reader.readGuid();
      reader.readUInt8();

      for (let i = 0; i < count; i++) {
        const itemStart = reader.offset;
        try {
          const itemProps = parseTaggedProperties(reader);
          elements.push(itemProps);
        } catch {
          reader.offset = itemStart + (sSize > 0 ? sSize : 0);
        }
      }
      return { name, type, size, elemType, structType: innerStruct, structGuid: sGuid, elements } as ArrayGvasProperty;
    } else {
      for (let i = 0; i < count; i++) {
        if (elemType === 'IntProperty') elements.push(reader.readInt32());
        else if (elemType === 'NameProperty' || elemType === 'StrProperty') elements.push(reader.readFString());
        else if (elemType === 'ByteProperty') elements.push(reader.readUInt8());
        else if (elemType === 'EnumProperty') elements.push(reader.readFString());
      }
      return { name, type, size, elemType, elements } as ArrayGvasProperty;
    }
  }

  if (type === 'SetProperty') {
    const elemType = reader.readFString() as GvasPropertyType;
    reader.readUInt8();
    reader.readInt32(); // numKeysToRemove
    const count = reader.readInt32();
    const elements: any[] = [];
    for (let i = 0; i < count; i++) {
      if (elemType === 'NameProperty' || elemType === 'StrProperty') elements.push(reader.readFString());
      else if (elemType === 'IntProperty') elements.push(reader.readInt32());
      else if (elemType === 'StructProperty') {
        const itemStart = reader.offset;
        try {
          elements.push(parseTaggedProperties(reader));
        } catch {
          reader.offset = itemStart;
        }
      }
    }
    return { name, type, size, elemType, elements } as SetGvasProperty;
  }

  if (type === 'MapProperty') {
    const keyType = reader.readFString() as GvasPropertyType;
    const valType = reader.readFString() as GvasPropertyType;
    reader.readUInt8();
    reader.readInt32(); // numKeysToRemove
    const count = reader.readInt32();
    const entries: Array<{ key: any; value: any }> = [];
    const payloadEnd = reader.offset + size - 8; // approx

    for (let i = 0; i < count && reader.offset < payloadEnd; i++) {
      let k: any;
      if (keyType === 'NameProperty' || keyType === 'StrProperty') k = reader.readFString();
      else if (keyType === 'IntProperty') k = reader.readInt32();
      else if (keyType === 'EnumProperty') k = reader.readFString();

      let v: any;
      if (valType === 'IntProperty') v = reader.readInt32();
      else if (valType === 'EnumProperty' || valType === 'NameProperty' || valType === 'StrProperty') v = reader.readFString();
      else if (valType === 'BoolProperty') v = reader.readUInt8() === 1;
      else if (valType === 'StructProperty') {
        try {
          v = parseTaggedProperties(reader);
        } catch {
          break;
        }
      }
      entries.push({ key: k, value: v });
    }
    return { name, type, size, keyType, valType, entries } as MapGvasProperty;
  }

  // Generic Fallback
  reader.readUInt8();
  const rawValue = reader.readBytes(size);
  return { name, type, size, rawValue } as GenericGvasProperty;
}
