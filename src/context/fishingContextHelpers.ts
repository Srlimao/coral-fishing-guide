import {
  ActiveGameState,
  UserProgress,
  Season,
  FishRarity,
  FishSize,
  FishItem
} from '../types/fishing';
import { FISH_LIST } from '../data/fishData';
import { isFishSpawnActive, getFishExclusivityInfo } from '../features/calculator/FishingCalculations';

export interface FilterOptions {
  search: string;
  season?: Season | 'all';
  location?: string | 'all';
  rarity?: FishRarity | 'all';
  size?: FishSize | 'all';
  onlyActiveNow: boolean;
  onlyNeededForOfferings: boolean;
  onlyMissingMuseum: boolean;
  onlyUncaught: boolean;
  sortBy: 'priority' | 'name' | 'sellPrice' | 'rarity' | 'difficulty' | 'exp';
  sortOrder: 'asc' | 'desc';
}

export const LOCAL_STORAGE_KEY_PROGRESS = 'coral_fish_guide_progress_v1';
export const LOCAL_STORAGE_KEY_GAMESTATE = 'coral_fish_guide_gamestate_v1';
export const LOCAL_STORAGE_KEY_LOCATIONS = 'coral_fish_guide_locations_v4';
export const LOCAL_STORAGE_KEY_MAP_IMG = 'coral_fish_guide_map_img_v2';

export const defaultGameState: ActiveGameState = {
  year: 1,
  season: 'spring',
  day: 1,
  timeOfDay: 'morning',
  weather: 'sunny',
  fishingLevel: 1,
  equippedRod: 'makeshift',
  equippedBait: 'none',
  equippedTackle: 'none',
  liveFilterOnlyActive: false
};

export const defaultUserProgress: UserProgress = {
  caught: {},
  donatedMuseum: {},
  offeredTemple: {},
  customNotes: {}
};

export const defaultFilters: FilterOptions = {
  search: '',
  season: 'all',
  location: 'all',
  rarity: 'all',
  size: 'all',
  onlyActiveNow: false,
  onlyNeededForOfferings: false,
  onlyMissingMuseum: false,
  onlyUncaught: false,
  sortBy: 'priority',
  sortOrder: 'desc'
};

export const filterAndSortFish = (
  filters: FilterOptions,
  gameState: ActiveGameState,
  userProgress: UserProgress
): FishItem[] => {
  return FISH_LIST.filter(fish => {
    if (filters.search) {
      const term = filters.search.toLowerCase();
      const matchName = fish.name.toLowerCase().includes(term);
      const matchLoc = fish.locations.some(l => l.toLowerCase().includes(term));
      if (!matchName && !matchLoc) return false;
    }

    if (filters.season && filters.season !== 'all' && !fish.seasons.includes(filters.season)) return false;
    if (filters.location && filters.location !== 'all' && !fish.locations.includes(filters.location)) return false;
    if (filters.rarity && filters.rarity !== 'all' && fish.rarity !== filters.rarity) return false;
    if (filters.size && filters.size !== 'all' && fish.size !== filters.size) return false;

    if (
      (filters.onlyActiveNow || gameState.liveFilterOnlyActive) &&
      !isFishSpawnActive(fish, gameState.season, gameState.day, gameState.timeOfDay, gameState.weather, gameState.equippedBait)
    ) {
      return false;
    }

    if (filters.onlyNeededForOfferings && fish.offerings.length === 0) return false;
    if (filters.onlyMissingMuseum && userProgress.donatedMuseum[fish.id]) return false;
    if (filters.onlyUncaught && userProgress.caught[fish.id]) return false;

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'priority') {
      const infoA = getFishExclusivityInfo(a, gameState.season, userProgress);
      const infoB = getFishExclusivityInfo(b, gameState.season, userProgress);
      const diff = infoA.priorityScore - infoB.priorityScore;
      return filters.sortOrder === 'desc' ? -diff : diff;
    }

    let comp = 0;
    if (filters.sortBy === 'name') comp = a.name.localeCompare(b.name);
    else if (filters.sortBy === 'sellPrice') comp = a.sellPrice - b.sellPrice;
    else if (filters.sortBy === 'exp') comp = a.expGranted - b.expGranted;
    return filters.sortOrder === 'asc' ? comp : -comp;
  });
};
