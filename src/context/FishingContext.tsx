import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  MapSpotCoordinate,
  NavigationTab
} from '../types/fishing';
import { FISH_LIST } from '../data/fishData';
import { DEFAULT_FISHING_LOCATIONS } from '../data/locationsData';
import { isFishSpawnActive } from '../features/calculator/FishingCalculations';
import { useUserProfile } from '../features/user-profiles/UserProfileContext';
import {
  FilterOptions,
  LOCAL_STORAGE_KEY_PROGRESS,
  LOCAL_STORAGE_KEY_GAMESTATE,
  LOCAL_STORAGE_KEY_LOCATIONS,
  LOCAL_STORAGE_KEY_MAP_IMG,
  defaultFilters,
  filterAndSortFish,
  addSpotHelper,
  removeSpotHelper,
  updateSpotHelper
} from './fishingContextHelpers';

interface FishingContextType {
  gameState: ActiveGameState;
  userProgress: UserProgress;
  filters: FilterOptions;
  selectedFish: FishItem | null;
  activeTab: NavigationTab;
  customLocations: FishingLocationPin[];
  customMapImage: string | null;
  uiScale: number;
  setUiScale: (scale: number) => void;
  setGameState: React.Dispatch<React.SetStateAction<ActiveGameState>>;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  setSelectedFish: (fish: FishItem | null) => void;
  setActiveTab: (tab: NavigationTab) => void;
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
  const { activeProfile, updateActiveProfile } = useUserProfile();

  const [gameState, setGameState] = useState<ActiveGameState>(activeProfile.gameState);
  const [userProgress, setUserProgress] = useState<UserProgress>(activeProfile.userProgress);
  const [customLocations, setCustomLocations] = useState<FishingLocationPin[]>(
    activeProfile.customLocations || DEFAULT_FISHING_LOCATIONS
  );
  const [customMapImage, setCustomMapImageState] = useState<string | null>(activeProfile.customMapImage || null);
  const [uiScale, setUiScale] = useState<number>(activeProfile.settings?.uiScale || 1.05);

  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [selectedFish, setSelectedFish] = useState<FishItem | null>(null);
  const [activeTab, setActiveTab] = useState<NavigationTab>('catalog');

  const currentProfileIdRef = useRef<string>(activeProfile.id);

  // Sync state when active profile switches
  useEffect(() => {
    if (currentProfileIdRef.current !== activeProfile.id) {
      currentProfileIdRef.current = activeProfile.id;
      setGameState(activeProfile.gameState);
      setUserProgress(activeProfile.userProgress);
      setCustomLocations(activeProfile.customLocations || DEFAULT_FISHING_LOCATIONS);
      setCustomMapImageState(activeProfile.customMapImage || null);
      setUiScale(activeProfile.settings?.uiScale || 1.05);
    }
  }, [activeProfile]);

  useEffect(() => {
    document.documentElement.style.setProperty('--ui-scale', uiScale.toString());
    localStorage.setItem('coral_fishing_guide_ui_scale_v1', uiScale.toString());
  }, [uiScale]);

  // Persist and update active profile on state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_GAMESTATE, JSON.stringify(gameState));
    updateActiveProfile({ gameState });
  }, [gameState, updateActiveProfile]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PROGRESS, JSON.stringify(userProgress));
    updateActiveProfile({ userProgress });
  }, [userProgress, updateActiveProfile]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_LOCATIONS, JSON.stringify(customLocations));
    updateActiveProfile({ customLocations });
  }, [customLocations, updateActiveProfile]);

  const setCustomMapImage = (img: string | null) => {
    setCustomMapImageState(img);
    updateActiveProfile({ customMapImage: img });
    if (img) {
      localStorage.setItem(LOCAL_STORAGE_KEY_MAP_IMG, img);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_MAP_IMG);
    }
  };

  const addSpotToLocation = (locationId: string, spot: Omit<MapSpotCoordinate, 'id'>) => {
    setCustomLocations(prev => addSpotHelper(prev, locationId, spot));
  };

  const removeSpotFromLocation = (locationId: string, spotId: string) => {
    setCustomLocations(prev => removeSpotHelper(prev, locationId, spotId));
  };

  const updateSpotCoordinate = (locationId: string, spotId: string, x: number, y: number) => {
    setCustomLocations(prev => updateSpotHelper(prev, locationId, spotId, x, y));
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

  const resetProgress = () => {
    setUserProgress({ caught: {}, donatedMuseum: {}, offeredTemple: {}, customNotes: {} });
  };

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
        uiScale,
        setUiScale,
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
