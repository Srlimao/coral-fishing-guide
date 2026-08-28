export type Season = 'spring' | 'summer' | 'fall' | 'winter';

export type Weather = 'sunny' | 'rain' | 'storm' | 'snow' | 'blizzard' | 'windy';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export type FishRarity = 'Common' | 'Uncommon' | 'Rare' | 'Legendary';

export type FishSize = 'Small' | 'Medium' | 'Large';

export type FishDifficulty = 'VeryEasy' | 'Easy' | 'Medium' | 'Hard' | 'VeryHard';

export type MovementPattern = 'Stay' | 'Circle' | 'Star';

export type RodTier = 'makeshift' | 'copper' | 'silver' | 'gold' | 'osmium';

export type BaitType = 'none' | 'regular' | 'small' | 'medium' | 'large' | 'magic';

export type TackleType = 'none' | 'floating_lure' | 'heavy_lure' | 'titanium_line' | 'curved_hook';

export interface SpawnSetting {
  key: string;
  spawnArea?: {
    canBeCatchOnCave?: boolean;
    canBeCatchOnLake?: boolean;
    canBeCatchOnOcean?: boolean;
    canBeCatchOnPond?: boolean;
    canBeCatchOnRiver?: boolean;
  };
  spawnLocation?: string[];
  spawnTime?: {
    morning?: boolean;
    afternoon?: boolean;
    evening?: boolean;
    night?: boolean;
  };
  spawnWeather?: {
    sunny?: boolean;
    rain?: boolean;
    snow?: boolean;
    blizzard?: boolean;
    windy?: boolean;
    storm?: boolean;
  };
  spawnSeason?: {
    spring?: boolean;
    summer?: boolean;
    fall?: boolean;
    winter?: boolean;
  };
  isUsingSpecificDate?: boolean;
  dateRangeList?: Array<{
    isValidOnSpecificDate?: boolean;
    isValidIndefinitelyOnceStarted?: boolean;
    random?: boolean;
    startsFrom?: { day: number; season: string; year: number };
    lastsTill?: { day: number; season: string; year: number };
    from?: number;
    to?: number;
  }>;
}

export interface FishOffering {
  altarName: string;
  roomName: string;
  bundleName: string;
  amount: number;
  quality: string;
}

export interface FishItem {
  id: string;
  key: string;
  name: string;
  rarity: FishRarity;
  size: FishSize;
  pattern: MovementPattern;
  difficulty: FishDifficulty;
  minCaughtSize: number;
  maxCaughtSize: number;
  expGranted: number;
  price: number;
  sellPrice: number;
  bronzeSellPrice: number;
  silverSellPrice: number;
  goldSellPrice: number;
  osmiumSellPrice: number;
  iconName: string;
  description: string;
  locations: string[];
  seasons: Season[];
  weathers: Weather[];
  times: TimeOfDay[];
  waterTypes: {
    cave: boolean;
    lake: boolean;
    ocean: boolean;
    pond: boolean;
    river: boolean;
  };
  spawnSettings: SpawnSetting[];
  offerings: FishOffering[];
}

export interface RodData {
  id: RodTier;
  name: string;
  minLevel: number;
  lineStrength: number;
  reelingMultiplier: number;
  maxDistance: string;
  recommendedDifficulty: FishDifficulty;
  description: string;
  color: string;
}

export interface BaitData {
  id: BaitType;
  name: string;
  bonusText: string;
  targetedSize?: FishSize;
  description: string;
}

export interface TackleData {
  id: TackleType;
  name: string;
  bonusText: string;
  description: string;
}

export interface MapSpotCoordinate {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  label?: string;
}

export interface FishingLocationPin {
  id: string;
  name: string;
  category: 'Freshwater' | 'Ocean' | 'Special' | 'Cave';
  x: number; // Primary spot X
  y: number; // Primary spot Y
  spots?: MapSpotCoordinate[]; // Multi-spots support
  description: string;
}

export interface ActiveGameState {
  year: number;
  season: Season;
  day: number;
  timeOfDay: TimeOfDay;
  weather: Weather;
  fishingLevel: number;
  equippedRod: RodTier;
  equippedBait: BaitType;
  equippedTackle: TackleType;
  liveFilterOnlyActive: boolean;
}

export interface UserProgress {
  caught: Record<string, boolean>;
  donatedMuseum: Record<string, boolean>;
  offeredTemple: Record<string, boolean>;
  customNotes: Record<string, string>;
}

export interface ExclusivityInfo {
  isExclusive: boolean;
  flags: string[];
  primaryTag?: string;
  tier: 'exclusive' | 'temple_museum' | 'completion';
  priorityScore: number;
}

export type NavigationTab = 'catalog' | 'calendar' | 'map' | 'bundles' | 'crafting' | 'stats' | 'backoffice' | 'trivia';
