export type UnlockSourceType =
  | 'Default'
  | 'Farming'
  | 'Foraging'
  | 'Mining'
  | 'Catching'
  | 'Fishing'
  | 'Combat'
  | 'Diving'
  | 'TownRank'
  | 'Lab'
  | 'Altar'
  | 'Quest';

export interface MaterialRequirement {
  name: string;
  amount: number;
  iconEmoji?: string;
  source?: string;
}

export interface UnlockCriteria {
  source: UnlockSourceType;
  level?: number;
  rank?: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  description: string;
}

export type CraftingCategory =
  | 'Artisan & Processing'
  | 'Farming & Sprinklers'
  | 'Storage & Chests'
  | 'Ranching'
  | 'Fences & Paths'
  | 'Decor & Lighting'
  | 'Bombs & Mining'
  | 'Consumables & Survival'
  | 'Baits & Traps'
  | 'Ocean & Diving';

export interface CraftingRecipe {
  id: string;
  name: string;
  category: CraftingCategory;
  yieldCount: number;
  sellPrice: number;
  unlock: UnlockCriteria;
  materials: MaterialRequirement[];
  description: string;
  usageNotes?: string;
  iconEmoji: string;
}

export type BuildingCategory =
  | 'Animal Housing'
  | 'Farm Production'
  | 'Specialty Facilities'
  | 'House Upgrades';

export interface BuildingTier {
  tierNumber: number;
  name: string;
  goldCost: number;
  daysToBuild: number;
  dimensions: string; // e.g. "7x4 Tiles"
  materials: MaterialRequirement[];
  unlock: UnlockCriteria;
  capacityText?: string;
  featuresUnlocked: string[];
  description: string;
}

export interface BuildingInfo {
  id: string;
  name: string;
  category: BuildingCategory;
  builder: string;
  iconEmoji: string;
  tiers: BuildingTier[];
  description: string;
}

export type ToolCategory =
  | 'Farming Tools'
  | 'Gathering & Mining'
  | 'Exploration & Trapping'
  | 'Inventory & Storage';

export interface ToolTier {
  tierNumber: number; // 0=Basic, 1=Bronze, 2=Silver, 3=Gold, 4=Osmium
  name: string;
  goldCost: number;
  daysToUpgrade: number;
  materials: MaterialRequirement[];
  staminaCost: string;
  aoeChargeArea: string;
  perks: string[];
  description: string;
}

export interface ToolInfo {
  id: string;
  name: string;
  category: ToolCategory;
  shop: string;
  iconEmoji: string;
  description: string;
  tiers: ToolTier[];
}

export type LabResearchCategory =
  | 'Crop & Quality Tech'
  | 'Farm Automation'
  | 'Material Synthesis'
  | 'Ocean Tech';

export interface LabResearchTier {
  tierNumber: number;
  name: string;
  goldCost: number;
  unlock: UnlockCriteria;
  materials: MaterialRequirement[];
  benefits: string[];
  description: string;
}

export interface LabResearchInfo {
  id: string;
  name: string;
  category: LabResearchCategory;
  laboratory: string;
  iconEmoji: string;
  description: string;
  tiers: LabResearchTier[];
}

export type OceanTechCategory =
  | 'Diving & Exploration'
  | 'Lumina Tech'
  | 'Underwater Farming'
  | 'Merfolk Crafts';

export interface OceanTechTier {
  tierNumber: number;
  name: string;
  goldCost: number;
  unlock: UnlockCriteria;
  materials: MaterialRequirement[];
  benefits: string[];
  description: string;
}

export interface OceanTechInfo {
  id: string;
  name: string;
  category: OceanTechCategory;
  source: string;
  iconEmoji: string;
  description: string;
  tiers: OceanTechTier[];
}

export interface PlannerItem {
  id: string; // unique cart entry ID
  type: 'crafting' | 'building' | 'tool' | 'lab' | 'ocean';
  targetId: string;
  tierIndex?: number;
  quantity: number;
  name: string;
  goldCost: number;
  materials: MaterialRequirement[];
  completed?: boolean;
}

export interface AggregatedMaterial {
  name: string;
  totalAmount: number;
  source?: string;
  iconEmoji?: string;
}
