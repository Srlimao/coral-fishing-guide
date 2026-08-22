import { FishItem, Season, Weather, TimeOfDay, FishRarity, FishSize, ActiveGameState, UserProgress } from '../types/fishing';
import { FISH_LIST } from '../data/fishData';
import { isFishSpawnActive, getFishExclusivityInfo } from '../features/calculator/FishingCalculations';
import { FISH_NAME_TRANSLATIONS } from '../i18n/fishTranslations';
import { LOCATION_TRANSLATIONS } from '../i18n/locationTranslations';

export const LOCAL_STORAGE_KEY_PROGRESS = 'coral_fishing_guide_progress_v1';
export const LOCAL_STORAGE_KEY_GAMESTATE = 'coral_fishing_guide_gamestate_v1';
export const LOCAL_STORAGE_KEY_LOCATIONS = 'coral_fishing_guide_locations_v1';
export const LOCAL_STORAGE_KEY_MAP_IMG = 'coral_fishing_guide_map_image_v1';

export interface FilterOptions {
  search: string;
  season: Season | 'all';
  location: string | 'all';
  timeOfDay: TimeOfDay | 'all';
  weather: Weather | 'all';
  rarity: FishRarity | 'all';
  size: FishSize | 'all';
  onlyActiveNow: boolean;
  onlyNeededForOfferings: boolean;
  onlyMissingMuseum: boolean;
  onlyUncaught: boolean;
  sortBy: 'priority' | 'name' | 'sellPrice' | 'exp';
  sortOrder: 'asc' | 'desc';
}

export const defaultGameState: ActiveGameState = {
  season: 'spring',
  day: 1,
  year: 1,
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
  timeOfDay: 'all',
  weather: 'all',
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
      
      // Match localized fish names in any language
      const translations = FISH_NAME_TRANSLATIONS[fish.id];
      const matchTranslated = translations ? Object.values(translations).some(t => t?.toLowerCase().includes(term)) : false;

      const matchLoc = fish.locations.some(l => {
        if (l.toLowerCase().includes(term)) return true;
        const locTrans = LOCATION_TRANSLATIONS[l];
        return locTrans ? Object.values(locTrans).some(t => t?.toLowerCase().includes(term)) : false;
      });

      if (!matchName && !matchTranslated && !matchLoc) return false;
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
