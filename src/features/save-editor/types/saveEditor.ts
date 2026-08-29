export type GvasPropertyType =
  | 'StructProperty'
  | 'ArrayProperty'
  | 'MapProperty'
  | 'SetProperty'
  | 'EnumProperty'
  | 'ByteProperty'
  | 'BoolProperty'
  | 'IntProperty'
  | 'Int64Property'
  | 'FloatProperty'
  | 'StrProperty'
  | 'NameProperty'
  | 'TextProperty'
  | 'ObjectProperty';

export interface GvasCustomVersion {
  guid: string;
  version: number;
}

export interface GvasHeader {
  magic: string;
  saveGameVersion: number;
  packageVersion: number;
  engineMajor: number;
  engineMinor: number;
  enginePatch: number;
  engineBuild: number;
  engineBranch: string;
  customVersionFormat: number;
  customVersions: GvasCustomVersion[];
  saveGameClassName: string;
}

export interface BaseGvasProperty {
  name: string;
  type: GvasPropertyType;
  size: number;
}

export interface StructGvasProperty extends BaseGvasProperty {
  type: 'StructProperty';
  structType: string;
  structGuid: string;
  value: Record<string, GvasProperty> | Uint8Array;
}

export interface ArrayGvasProperty extends BaseGvasProperty {
  type: 'ArrayProperty';
  elemType: GvasPropertyType | 'StructProperty';
  structType?: string;
  structGuid?: string;
  elements: any[];
}

export interface MapGvasProperty extends BaseGvasProperty {
  type: 'MapProperty';
  keyType: GvasPropertyType;
  valType: GvasPropertyType;
  valStructType?: string;
  valStructGuid?: string;
  entries: Array<{ key: any; value: any }>;
}

export interface SetGvasProperty extends BaseGvasProperty {
  type: 'SetProperty';
  elemType: GvasPropertyType;
  elements: any[];
}

export interface EnumGvasProperty extends BaseGvasProperty {
  type: 'EnumProperty';
  enumType: string;
  value: string;
}

export interface ByteGvasProperty extends BaseGvasProperty {
  type: 'ByteProperty';
  enumType: string;
  value: string | number;
}

export interface BoolGvasProperty extends BaseGvasProperty {
  type: 'BoolProperty';
  value: boolean;
}

export interface IntGvasProperty extends BaseGvasProperty {
  type: 'IntProperty';
  value: number;
}

export interface Int64GvasProperty extends BaseGvasProperty {
  type: 'Int64Property';
  value: bigint | number;
}

export interface FloatGvasProperty extends BaseGvasProperty {
  type: 'FloatProperty';
  value: number;
}

export interface StrGvasProperty extends BaseGvasProperty {
  type: 'StrProperty' | 'NameProperty';
  value: string;
}

export interface GenericGvasProperty extends BaseGvasProperty {
  type: 'TextProperty' | 'ObjectProperty';
  rawValue: Uint8Array;
}

export type GvasProperty =
  | StructGvasProperty
  | ArrayGvasProperty
  | MapGvasProperty
  | SetGvasProperty
  | EnumGvasProperty
  | ByteGvasProperty
  | BoolGvasProperty
  | IntGvasProperty
  | Int64GvasProperty
  | FloatGvasProperty
  | StrGvasProperty
  | GenericGvasProperty;

export interface ParsedSaveGame {
  outerHeader: GvasHeader;
  innerHeader: GvasHeader;
  outerPrefixBytes: Uint8Array;
  outerTrailingBytes: Uint8Array;
  innerTArrayLength: number;
  rootProperties: Record<string, GvasProperty>;
  rawDecompressedBytes: Uint8Array;
}

export interface SaveEditorDiffItem {
  id: string;
  subsystem: string;
  propertyKey: string;
  label: string;
  oldValue: any;
  newValue: any;
  formattedOld: string;
  formattedNew: string;
}

export type SaveEditorSubsystemTab =
  | 'player'
  | 'inventory'
  | 'museum-altars'
  | 'npcs'
  | 'farm-grid'
  | 'calendar-weather'
  | 'multiplayer'
  | 'raw-inspector';
