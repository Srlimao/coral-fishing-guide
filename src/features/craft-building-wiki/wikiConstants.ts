import { UnlockSourceType } from './types';

export type CatalogDomain = 'crafting' | 'buildings' | 'tools' | 'lab' | 'ocean';

export const CRAFTING_CATEGORIES = [
  'All',
  'Artisan & Processing',
  'Farming & Sprinklers',
  'Storage & Chests',
  'Baits & Traps',
  'Bombs & Mining',
  'Ocean & Diving',
  'Consumables & Survival',
  'Fences & Paths',
  'Decor & Lighting'
];

export const BUILDING_CATEGORIES = [
  'All',
  'Animal Housing',
  'Farm Production',
  'Specialty Facilities',
  'House Upgrades'
];

export const TOOL_CATEGORIES = [
  'All',
  'Farming Tools',
  'Gathering & Mining',
  'Exploration & Trapping',
  'Inventory & Storage'
];

export const LAB_CATEGORIES = [
  'All',
  'Crop & Quality Tech',
  'Farm Automation',
  'Material Synthesis',
  'Ocean Tech'
];

export const OCEAN_CATEGORIES = [
  'All',
  'Diving & Exploration',
  'Lumina Tech',
  'Underwater Farming',
  'Merfolk Crafts'
];

export const UNLOCK_SOURCES: UnlockSourceType[] = [
  'Default',
  'Farming',
  'Mining',
  'Foraging',
  'Diving',
  'Fishing',
  'Catching',
  'Combat',
  'TownRank',
  'Lab',
  'Altar',
  'Quest'
];

