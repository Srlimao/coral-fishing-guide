import React, { useState } from 'react';
import { useFishing } from '../../context/FishingContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { FishRarity, FishSize, RodTier } from '../../types/fishing';
import {
  DateWeatherFilterSection,
  GearFilterSection,
  StatusFilterSection
} from './FishListFilterSections';
import {
  Search,
  Flame,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const FishListRightSidebar: React.FC = () => {
  const {
    gameState,
    setSeason,
    setDay,
    setTimeOfDay,
    setWeather,
    setGameState,
    filters,
    setFilters
  } = useFishing();

  const { t } = useLanguage();
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const resetAllFilters = () => {
    setFilters((prev: any) => ({
      ...prev,
      search: '',
      season: 'all',
      location: 'all',
      rarity: 'all',
      size: 'all',
      onlyActiveNow: false,
      onlyNeededForOfferings: false,
      onlyMissingMuseum: false,
      onlyUncaught: false
    }));
  };

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    (filters.onlyUncaught ? 1 : 0) +
    (filters.onlyNeededForOfferings ? 1 : 0) +
    (filters.onlyMissingMuseum ? 1 : 0) +
    (filters.rarity !== 'all' ? 1 : 0) +
    (filters.size !== 'all' ? 1 : 0) +
    (gameState.liveFilterOnlyActive ? 1 : 0);

  const rarities: Array<FishRarity | 'all'> = ['all', 'Common', 'Uncommon', 'Rare', 'Legendary'];
  const sizes: Array<FishSize | 'all'> = ['all', 'Small', 'Medium', 'Large'];

  // Desktop Collapsed Compact Button
  if (isDesktopCollapsed) {
    return (
      <aside className="hidden lg:flex flex-col items-center glass-panel p-2.5 sticky top-6 self-start shadow-xl z-20">
        <button
          onClick={() => setIsDesktopCollapsed(false)}
          title="Expand Filters & Settings"
          aria-label="Expand Filters"
          className="cg-pill p-2 flex flex-col items-center gap-2 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4 text-amber-400" />
          <SlidersHorizontal className="w-4 h-4" />
          {activeFilterCount > 0 && (
            <span className="bg-amber-400 text-black text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      </aside>
    );
  }

  return (
    <aside className="glass-panel p-4 shadow-xl text-xs space-y-3.5 w-full lg:w-72 xl:w-80 flex-shrink-0 sticky top-6 self-start">
      
      {/* Top Header with Collapse Toggle */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          <span>Filters & Simulation</span>
          {activeFilterCount > 0 && (
            <span className="bg-amber-400 text-black text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Desktop Collapse Button */}
          <button
            onClick={() => setIsDesktopCollapsed(true)}
            title="Collapse Filters Panel"
            aria-label="Collapse Filters"
            className="hidden lg:flex cg-pill p-1.5 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Mobile Accordion Toggle Button */}
          <button
            onClick={() => setIsMobileExpanded(prev => !prev)}
            aria-label="Toggle Filters"
            className="lg:hidden cg-pill p-1.5 hover:text-white"
          >
            {isMobileExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 1. Search Box (Always visible) */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-[#c4b5a0] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          placeholder={t('search_placeholder')}
          className="w-full bg-white/5 border-2 border-white/20 rounded-full pl-9 pr-8 py-2 text-xs text-white placeholder:text-[#c4b5a0] focus:outline-none focus:border-white focus:bg-white/10 transition-all"
        />
        {filters.search && (
          <button
            onClick={() => handleFilterChange('search', '')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#c4b5a0] hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Main Filter Panel Body */}
      <div className={`${isMobileExpanded ? 'block space-y-4 pt-1' : 'hidden lg:block lg:space-y-4'}`}>
        
        {/* 2. Active RIGHT NOW Capsule Toggle */}
        <button
          onClick={() =>
            setGameState(prev => ({ ...prev, liveFilterOnlyActive: !prev.liveFilterOnlyActive }))
          }
          className={`cg-pill w-full py-2.5 px-3.5 text-xs justify-between ${
            gameState.liveFilterOnlyActive ? 'cg-pill-active' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5" />
            <span>{t('active_right_now')}</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            gameState.liveFilterOnlyActive ? 'bg-[#13181b] text-white' : 'bg-white/15 text-white'
          }`}>
            {gameState.liveFilterOnlyActive ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* 3. In-Game Date & Weather Sub-Section */}
        <DateWeatherFilterSection
          season={gameState.season}
          day={gameState.day}
          timeOfDay={gameState.timeOfDay}
          weather={gameState.weather}
          setSeason={setSeason}
          setDay={setDay}
          setTimeOfDay={setTimeOfDay}
          setWeather={setWeather}
        />

        {/* 4. Player Gear & Fishing Level */}
        <GearFilterSection
          fishingLevel={gameState.fishingLevel}
          equippedRod={gameState.equippedRod}
          onLevelChange={(lvl) => setGameState(prev => ({ ...prev, fishingLevel: lvl }))}
          onRodChange={(rod: RodTier) => setGameState(prev => ({ ...prev, equippedRod: rod }))}
        />

        {/* 5. Quick Status Filters */}
        <StatusFilterSection
          onlyUncaught={filters.onlyUncaught}
          onlyNeededForOfferings={filters.onlyNeededForOfferings}
          onlyMissingMuseum={filters.onlyMissingMuseum}
          onToggle={handleFilterChange}
        />

        {/* 6. Rarity Filter */}
        <div className="border-t border-white/10 pt-3 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#c4b5a0] block">
            {t('filter_rarity')}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {rarities.map(r => (
              <button
                key={r}
                onClick={() => handleFilterChange('rarity', r)}
                className={`cg-pill px-2.5 py-1 text-[10px] ${
                  filters.rarity === r ? 'cg-pill-active' : ''
                }`}
              >
                {r === 'all' ? t('rarity_all') : t(`rarity_${r.toLowerCase()}` as any, r)}
              </button>
            ))}
          </div>
        </div>

        {/* 7. Size Filter */}
        <div className="border-t border-white/10 pt-3 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#c4b5a0] block">
            {t('filter_size')}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sizes.map(s => (
              <button
                key={s}
                onClick={() => handleFilterChange('size', s)}
                className={`cg-pill px-2.5 py-1 text-[10px] ${
                  filters.size === s ? 'cg-pill-active' : ''
                }`}
              >
                {s === 'all' ? t('size_all') : t(`size_${s.toLowerCase()}` as any, s)}
              </button>
            ))}
          </div>
        </div>

        {/* 8. Reset Button */}
        <button
          onClick={resetAllFilters}
          className="cg-pill w-full py-2 px-3 text-xs justify-center hover:text-white mt-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('reset_filters')}</span>
        </button>

      </div>

    </aside>
  );
};
