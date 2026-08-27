import React, { useEffect } from 'react';
import { useFishing } from '../../context/FishingContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { FishRarity, FishSize, RodTier } from '../../types/fishing';
import {
  DateWeatherFilterSection,
  GearFilterSection,
  StatusFilterSection
} from './FishListFilterSections';
import { SlidersHorizontal, Flame, RotateCcw, X } from 'lucide-react';

interface FishListMobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FishListMobileFilterModal: React.FC<FishListMobileFilterModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    gameState,
    setSeason,
    setDay,
    setTimeOfDay,
    setWeather,
    setGameState,
    filters,
    setFilters,
    filteredFish
  } = useFishing();

  const { t } = useLanguage();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-Up Bottom Sheet */}
      <aside
        className="relative bg-[#182228] border-t border-white/20 rounded-t-3xl shadow-2xl z-10 max-h-[90vh] flex flex-col w-full text-xs animate-in slide-in-from-bottom duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Filters & Simulation"
      >
        {/* Drag Handle & Header */}
        <div className="pt-2.5 pb-3 px-5 border-b border-white/10 flex-shrink-0">
          <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-2" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-white text-base">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Filters & Simulation</span>
              {activeFilterCount > 0 && (
                <span className="bg-amber-400 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close Filters"
              className="p-1.5 rounded-xl bg-white/10 text-neutral-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Filter Options Body */}
        <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1">
          {/* 1. Active RIGHT NOW Capsule Toggle */}
          <button
            onClick={() =>
              setGameState(prev => ({ ...prev, liveFilterOnlyActive: !prev.liveFilterOnlyActive }))
            }
            className={`cg-pill w-full py-3 px-4 text-xs justify-between font-bold ${
              gameState.liveFilterOnlyActive ? 'cg-pill-active' : ''
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-sm">{t('active_right_now')}</span>
            </div>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                gameState.liveFilterOnlyActive ? 'bg-[#13181b] text-white' : 'bg-white/15 text-white'
              }`}
            >
              {gameState.liveFilterOnlyActive ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* 2. In-Game Date & Weather Sub-Section */}
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

          {/* 3. Player Gear & Fishing Level */}
          <GearFilterSection
            fishingLevel={gameState.fishingLevel}
            equippedRod={gameState.equippedRod}
            onLevelChange={lvl => setGameState(prev => ({ ...prev, fishingLevel: lvl }))}
            onRodChange={(rod: RodTier) => setGameState(prev => ({ ...prev, equippedRod: rod }))}
          />

          {/* 4. Quick Status Filters */}
          <StatusFilterSection
            onlyUncaught={filters.onlyUncaught}
            onlyNeededForOfferings={filters.onlyNeededForOfferings}
            onlyMissingMuseum={filters.onlyMissingMuseum}
            onToggle={handleFilterChange}
          />

          {/* 5. Rarity Filter */}
          <div className="border-t border-white/10 pt-3 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#c4b5a0] block">
              {t('filter_rarity')}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {rarities.map(r => (
                <button
                  key={r}
                  onClick={() => handleFilterChange('rarity', r)}
                  className={`cg-pill px-3 py-1.5 text-xs ${
                    filters.rarity === r ? 'cg-pill-active' : ''
                  }`}
                >
                  {r === 'all' ? t('rarity_all') : t(`rarity_${r.toLowerCase()}` as any, r)}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Size Filter */}
          <div className="border-t border-white/10 pt-3 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#c4b5a0] block">
              {t('filter_size')}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map(s => (
                <button
                  key={s}
                  onClick={() => handleFilterChange('size', s)}
                  className={`cg-pill px-3 py-1.5 text-xs ${
                    filters.size === s ? 'cg-pill-active' : ''
                  }`}
                >
                  {s === 'all' ? t('size_all') : t(`size_${s.toLowerCase()}` as any, s)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Bottom Actions */}
        <div className="p-4 border-t border-white/15 bg-[#141b20] flex items-center gap-3 flex-shrink-0">
          <button
            onClick={resetAllFilters}
            className="cg-pill py-3 px-4 text-xs font-bold justify-center gap-2 hover:text-white"
            title="Reset All Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('reset_filters')}</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-2xl bg-white text-[#13181b] font-bold text-xs hover:bg-neutral-200 transition-all shadow-lg text-center"
          >
            Show {filteredFish.length} Fish
          </button>
        </div>
      </aside>
    </div>
  );
};
