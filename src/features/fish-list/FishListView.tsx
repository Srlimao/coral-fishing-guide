import React, { useState } from 'react';
import { useFishing } from '../../context/FishingContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { FishCard } from './FishCard';
import { FishListMobileFilterModal } from './FishListMobileFilterModal';
import { SlidersHorizontal, Search, Flame } from 'lucide-react';

export const FishListView: React.FC = () => {
  const { filters, setFilters, filteredFish, gameState, setGameState } = useFishing();
  const { t } = useLanguage();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [by, order] = e.target.value.split('-');
    setFilters((prev: any) => ({ ...prev, sortBy: by as any, sortOrder: order as any }));
  };

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    (filters.onlyUncaught ? 1 : 0) +
    (filters.onlyNeededForOfferings ? 1 : 0) +
    (filters.onlyMissingMuseum ? 1 : 0) +
    (filters.rarity !== 'all' ? 1 : 0) +
    (filters.size !== 'all' ? 1 : 0) +
    (gameState.liveFilterOnlyActive ? 1 : 0);

  const seasonIcons: Record<string, string> = {
    spring: '🌸',
    summer: '☀️',
    fall: '🍂',
    winter: '❄️'
  };

  const timeIcons: Record<string, string> = {
    morning: '🌅',
    afternoon: '☀️',
    evening: '🌇',
    night: '🌙'
  };

  return (
    <div className="space-y-4">
      {/* Mobile Top Controls (Visible only on < lg) */}
      <div className="lg:hidden space-y-2.5">
        {/* Mobile Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#c4b5a0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters((prev: any) => ({ ...prev, search: e.target.value }))}
            placeholder={t('search_placeholder')}
            className="w-full bg-white/5 border-2 border-white/20 rounded-2xl pl-9 pr-8 py-2 text-xs text-white placeholder:text-[#c4b5a0] focus:outline-none focus:border-white focus:bg-white/10 transition-all shadow-md"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev: any) => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#c4b5a0] hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Mobile Filter & Simulation Trigger Row */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            aria-label="Toggle Filters"
            className="flex-1 cg-pill py-2 px-3 justify-between font-bold text-xs bg-white/10 hover:bg-white/15"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>Filters & Simulation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#c4b5a0] font-semibold hidden sm:inline">
                {seasonIcons[gameState.season] || '🌸'} Day {gameState.day}
              </span>
              {activeFilterCount > 0 && (
                <span className="bg-amber-400 text-black text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
          </button>

          <button
            onClick={() =>
              setGameState(prev => ({ ...prev, liveFilterOnlyActive: !prev.liveFilterOnlyActive }))
            }
            aria-label="Toggle Active Right Now"
            className={`cg-pill py-2 px-3 text-xs font-bold ${
              gameState.liveFilterOnlyActive ? 'cg-pill-active' : ''
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t('active_right_now')}</span>
            <span className="sm:hidden">Active</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Active Match Count & Sorting */}
      <div className="glass-panel p-3 sm:px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs shadow-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-white text-sm">
            {t('nav_journal')} ({filteredFish.length})
          </span>
          <span className="text-[#c4b5a0] font-medium">
            • {seasonIcons[gameState.season] || ''} {t(`season_${gameState.season}` as any, gameState.season).toUpperCase()}, {t('day_label')} {gameState.day} ({timeIcons[gameState.timeOfDay] || ''} {t(`time_${gameState.timeOfDay}` as any, gameState.timeOfDay)})
          </span>
          {gameState.liveFilterOnlyActive && (
            <span className="cg-pill px-2.5 py-0.5 text-[10px] cg-pill-active">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              {t('active_right_now')}
            </span>
          )}
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#c4b5a0]" />
          <span className="text-[#c4b5a0] font-semibold text-[11px]">{t('sort_label')}</span>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={handleSortChange}
            className="bg-white/5 border-2 border-white/20 text-xs font-bold text-white rounded-full px-3 py-1 focus:outline-none focus:border-white transition-all cursor-pointer"
          >
            <option value="priority-desc" className="bg-[#13181b] text-white">🚩 Priority: Exclusives First</option>
            <option value="name-asc" className="bg-[#13181b] text-white">{t('sort_name_asc')}</option>
            <option value="name-desc" className="bg-[#13181b] text-white">{t('sort_name_desc')}</option>
            <option value="sellPrice-desc" className="bg-[#13181b] text-white">{t('sort_sell_high')}</option>
            <option value="sellPrice-asc" className="bg-[#13181b] text-white">{t('sort_sell_low')}</option>
            <option value="exp-desc" className="bg-[#13181b] text-white">{t('sort_exp_high')}</option>
          </select>
        </div>
      </div>

      {/* Fish Cards Grid (Max 3 columns on large screens down to 1 on mobile) */}
      {filteredFish.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredFish.map(fish => (
            <FishCard key={fish.id} fish={fish} />
          ))}
        </div>
      ) : (
        <div className="cg-card p-10 text-center space-y-3">
          <span className="text-4xl block">🎣</span>
          <h3 className="text-lg font-bold text-[#3d2f1a]">{t('empty_no_matching_fish')}</h3>
          <p className="text-xs text-[#8c785b] max-w-sm mx-auto">
            No fish match your current filters. Try adjusting season, time, weather, or resetting filters.
          </p>
          <button
            onClick={() =>
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
              }))
            }
            className="cg-pill cg-pill-active text-xs py-1.5 px-4 mt-1"
          >
            {t('reset_filters')}
          </button>
        </div>
      )}

      {/* Mobile Floating Action Pill (FAB) */}
      <div className="lg:hidden fixed bottom-6 right-4 z-30">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          aria-label="Open Filters & Simulation Modal"
          className="flex items-center gap-2 bg-[#182228] text-white px-4 py-2.5 rounded-full shadow-2xl border-2 border-amber-400/80 font-bold text-xs active:scale-95 transition-transform"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
          <span>Filters & Sim</span>
          {activeFilterCount > 0 && (
            <span className="bg-amber-400 text-black text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filter & Simulation Modal Sheet */}
      <FishListMobileFilterModal
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
      />
    </div>
  );
};

