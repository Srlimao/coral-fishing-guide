import React from 'react';
import { useFishing } from '../../context/FishingContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { FishCard } from './FishCard';
import { SlidersHorizontal } from 'lucide-react';

export const FishListView: React.FC = () => {
  const { filters, setFilters, filteredFish, gameState } = useFishing();
  const { t } = useLanguage();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [by, order] = e.target.value.split('-');
    setFilters((prev: any) => ({ ...prev, sortBy: by as any, sortOrder: order as any }));
  };

  return (
    <div className="space-y-4">
      {/* Top Control Bar: Active Match Count & Sorting */}
      <div className="glass-panel p-3 sm:px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs shadow-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-white text-sm">
            {t('nav_journal')} ({filteredFish.length})
          </span>
          <span className="text-[#c4b5a0] font-medium">
            • {t(`season_${gameState.season}` as any, gameState.season).toUpperCase()}, {t('day_label')} {gameState.day} ({t(`time_${gameState.timeOfDay}` as any, gameState.timeOfDay)})
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
          <span className="text-[#c4b5a0] font-semibold text-[11px]">Sort:</span>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={handleSortChange}
            className="bg-white/5 border-2 border-white/20 text-xs font-bold text-white rounded-full px-3 py-1 focus:outline-none focus:border-white transition-all cursor-pointer"
          >
            <option value="priority-desc" className="bg-[#13181b] text-white">🚩 Priority: Exclusives First</option>
            <option value="name-asc" className="bg-[#13181b] text-white">Name (A-Z)</option>
            <option value="name-desc" className="bg-[#13181b] text-white">Name (Z-A)</option>
            <option value="sellPrice-desc" className="bg-[#13181b] text-white">Sell Value (High to Low)</option>
            <option value="sellPrice-asc" className="bg-[#13181b] text-white">Sell Value (Low to High)</option>
            <option value="exp-desc" className="bg-[#13181b] text-white">XP Granted (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Fish Cards Grid (Adaptive from 1 up to 4 columns depending on available space) */}
      {filteredFish.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3.5">
          {filteredFish.map(fish => (
            <FishCard key={fish.id} fish={fish} />
          ))}
        </div>
      ) : (
        <div className="cg-card p-10 text-center space-y-3">
          <span className="text-4xl block">🎣</span>
          <h3 className="text-lg font-bold text-[#3d2f1a]">No Matching Fish Found</h3>
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
    </div>
  );
};
