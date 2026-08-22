import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ActiveGameState,
  UserProgress,
  Season,
  Weather,
  TimeOfDay,
  RodTier,
  BaitType,
  TackleType,
  FishItem,
  FishingLocationPin,
  MapSpotCoordinate
} from '../types/fishing';
import { FISH_LIST } from '../data/fishData';
import { DEFAULT_FISHING_LOCATIONS } from '../data/locationsData';
import { isFishSpawnActive } from '../features/calculator/FishingCalculations';
import {
  FilterOptions,
  LOCAL_STORAGE_KEY_PROGRESS,
  LOCAL_STORAGE_KEY_GAMESTATE,
  LOCAL_STORAGE_KEY_LOCATIONS,
  LOCAL_STORAGE_KEY_MAP_IMG,
  defaultGameState,
  defaultUserProgress,
  defaultFilters,
  filterAndSortFish
} from './fishingContextHelpers';

interface FishingContextType {
  gameState: ActiveGameState;
  userProgress: UserProgress;
  filters: FilterOptions;
  selectedFish: FishItem | null;
  activeTab: 'catalog' | 'calendar' | 'map' | 'bundles' | 'stats' | 'backoffice';
  customLocations: FishingLocationPin[];
  customMapImage: string | null;
  setGameState: React.Dispatch<React.SetStateAction<ActiveGameState>>;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  setSelectedFish: (fish: FishItem | null) => void;
  setActiveTab: (tab: 'catalog' | 'calendar' | 'map' | 'bundles' | 'stats' | 'backoffice') => void;
  toggleCaught: (fishId: string) => void;
  toggleDonated: (fishId: string) => void;
  toggleOffered: (fishId: string) => void;
  setFishingLevel: (lvl: number) => void;
  setEquippedRod: (rod: RodTier) => void;
  setEquippedBait: (bait: BaitType) => void;
  setEquippedTackle: (tackle: TackleType) => void;
  setSeason: (season: Season) => void;
  setDay: (day: number) => void;
  setTimeOfDay: (time: TimeOfDay) => void;
  setWeather: (weather: Weather) => void;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  resetProgress: () => void;
  filteredFish: FishItem[];
  activeNowCount: number;
  addSpotToLocation: (locationId: string, spot: Omit<MapSpotCoordinate, 'id'>) => void;
  removeSpotFromLocation: (locationId: string, spotId: string) => void;
  updateSpotCoordinate: (locationId: string, spotId: string, x: number, y: number) => void;
  addNewLocation: (location: FishingLocationPin) => void;
  deleteLocation: (locationId: string) => void;
  resetLocationsToDefault: () => void;
  setCustomMapImage: (imgUrl: string | null) => void;
}

const FishingContext = createContext<FishingContextType | undefined>(undefined);

export const FishingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<ActiveGameState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_GAMESTATE);
      return saved ? { ...defaultGameState, ...JSON.parse(saved) } : defaultGameState;
    } catch {
      return defaultGameState;
    }
  });

  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PROGRESS);
      return saved ? { ...defaultUserProgress, ...JSON.parse(saved) } : defaultUserProgress;
    } catch {
      return defaultUserProgress;
    }
  });

  const [customLocations, setCustomLocations] = useState<FishingLocationPin[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_LOCATIONS);
      return saved ? JSON.parse(saved) : DEFAULT_FISHING_LOCATIONS;
    } catch {
      return DEFAULT_FISHING_LOCATIONS;
    }
  });

  const [customMapImage, setCustomMapImageState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEY_MAP_IMG);
    } catch {
      return null;
    }
  });

  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [selectedFish, setSelectedFish] = useState<FishItem | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'calendar' | 'map' | 'bundles' | 'stats' | 'backoffice'>('catalog');

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_GAMESTATE, JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PROGRESS, JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_LOCATIONS, JSON.stringify(customLocations));
  }, [customLocations]);

  const setCustomMapImage = (img: string | null) => {
    setCustomMapImageState(img);
    if (img) {
      localStorage.setItem(LOCAL_STORAGE_KEY_MAP_IMG, img);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_MAP_IMG);
    }
  };

  const addSpotToLocation = (locationId: string, spot: Omit<MapSpotCoordinate, 'id'>) => {
    const newSpot: MapSpotCoordinate = {
      ...spot,
      id: `spot_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`
    };
    setCustomLocations(prev =>
      prev.map(loc => {
        if (loc.id === locationId) {
          const currentSpots = loc.spots || [{ id: 'main', x: loc.x, y: loc.y, label: 'Spot 1' }];
          return { ...loc, spots: [...currentSpots, newSpot] };
        }
        return loc;
      })
    );
  };

  const removeSpotFromLocation = (locationId: string, spotId: string) => {
    setCustomLocations(prev =>
      prev.map(loc => {
        if (loc.id === locationId) {
          const currentSpots = (loc.spots || []).filter(s => s.id !== spotId);
          return {
            ...loc,
            spots: currentSpots,
            x: currentSpots[0]?.x ?? loc.x,
            y: currentSpots[0]?.y ?? loc.y
          };
        }
        return loc;
      })
    );
  };

  const updateSpotCoordinate = (locationId: string, spotId: string, x: number, y: number) => {
    setCustomLocations(prev =>
      prev.map(loc => {
        if (loc.id === locationId) {
          const currentSpots = (loc.spots || []).map(s => (s.id === spotId ? { ...s, x, y } : s));
          return { ...loc, spots: currentSpots };
        }
        return loc;
      })
    );
  };

  const toggleCaught = (id: string) => {
    setUserProgress(prev => ({ ...prev, caught: { ...prev.caught, [id]: !prev.caught[id] } }));
  };

  const toggleDonated = (id: string) => {
    setUserProgress(prev => ({ ...prev, donatedMuseum: { ...prev.donatedMuseum, [id]: !prev.donatedMuseum[id] } }));
  };

  const toggleOffered = (id: string) => {
    setUserProgress(prev => ({ ...prev, offeredTemple: { ...prev.offeredTemple, [id]: !prev.offeredTemple[id] } }));
  };

  const setFishingLevel = (fishingLevel: number) => setGameState(prev => ({ ...prev, fishingLevel }));
  const setEquippedRod = (equippedRod: RodTier) => setGameState(prev => ({ ...prev, equippedRod }));
  const setEquippedBait = (equippedBait: BaitType) => setGameState(prev => ({ ...prev, equippedBait }));
  const setEquippedTackle = (equippedTackle: TackleType) => setGameState(prev => ({ ...prev, equippedTackle }));
  const setSeason = (season: Season) => setGameState(prev => ({ ...prev, season }));
  const setDay = (day: number) => setGameState(prev => ({ ...prev, day: Math.max(1, Math.min(28, day)) }));
  const setTimeOfDay = (timeOfDay: TimeOfDay) => setGameState(prev => ({ ...prev, timeOfDay }));
  const setWeather = (weather: Weather) => setGameState(prev => ({ ...prev, weather }));

  const exportData = () => JSON.stringify({ gameState, userProgress, customLocations }, null, 2);
  const importData = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.userProgress) setUserProgress(parsed.userProgress);
      if (parsed.gameState) setGameState(parsed.gameState);
      if (parsed.customLocations) setCustomLocations(parsed.customLocations);
      return true;
    } catch {
      return false;
    }
  };

  const resetProgress = () => setUserProgress(defaultUserProgress);

  const activeNowCount = FISH_LIST.filter(f =>
    isFishSpawnActive(f, gameState.season, gameState.day, gameState.timeOfDay, gameState.weather, gameState.equippedBait)
  ).length;

  const filteredFish = filterAndSortFish(filters, gameState, userProgress);

  return (
    <FishingContext.Provider
      value={{
        gameState,
        userProgress,
        filters,
        selectedFish,
        activeTab,
        customLocations,
        customMapImage,
        setGameState,
        setFilters,
        setSelectedFish,
        setActiveTab,
        toggleCaught,
        toggleDonated,
        toggleOffered,
        setFishingLevel,
        setEquippedRod,
        setEquippedBait,
        setEquippedTackle,
        setSeason,
        setDay,
        setTimeOfDay,
        setWeather,
        setUserProgress,
        exportData,
        importData,
        resetProgress,
        filteredFish,
        activeNowCount,
        addSpotToLocation,
        removeSpotFromLocation,
        updateSpotCoordinate,
        addNewLocation: (loc) => setCustomLocations(prev => [...prev, loc]),
        deleteLocation: (id) => setCustomLocations(prev => prev.filter(l => l.id !== id)),
        resetLocationsToDefault: () => {
          setCustomLocations(DEFAULT_FISHING_LOCATIONS);
          localStorage.removeItem(LOCAL_STORAGE_KEY_LOCATIONS);
        },
        setCustomMapImage
      }}
    >
      {children}
    </FishingContext.Provider>
  );
};

export const useFishing = () => {
  const context = useContext(FishingContext);
  if (!context) throw new Error('useFishing must be used within a FishingProvider');
  return context;
};
