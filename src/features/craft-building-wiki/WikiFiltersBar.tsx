import React from 'react';
import { Search, X, ClipboardList, Filter } from 'lucide-react';
import { UnlockSourceType } from './types';

interface WikiFiltersBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedUnlockSource: string;
  onSelectUnlockSource: (src: string) => void;
  unlockSources: UnlockSourceType[];
  plannerItemCount: number;
  onOpenPlanner: () => void;
  sortBy: 'name' | 'unlock' | 'cost';
  onSortChange: (sort: 'name' | 'unlock' | 'cost') => void;
  searchPlaceholder?: string;
}

export const WikiFiltersBar: React.FC<WikiFiltersBarProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
  selectedUnlockSource,
  onSelectUnlockSource,
  unlockSources,
  plannerItemCount,
  onOpenPlanner,
  sortBy,
  onSortChange,
  searchPlaceholder = 'Search items, buildings, materials, unlock conditions...'
}) => {
  return (
    <div className="space-y-3 bg-[#182228]/80 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/10 shadow-lg">
      {/* Top Search & Planner Button Row */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        {/* Search Input Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#c4b5a0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-8 py-2 bg-[#13181b] border border-white/15 rounded-xl text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-cyan-400/80 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Unlock Source Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <Filter className="w-3.5 h-3.5 text-[#c4b5a0] absolute left-3 pointer-events-none" />
            <select
              value={selectedUnlockSource}
              onChange={e => onSelectUnlockSource(e.target.value)}
              className="pl-8 pr-7 py-2 bg-[#13181b] border border-white/15 rounded-xl text-xs text-[#c4b5a0] hover:text-white focus:outline-none focus:border-cyan-400 cursor-pointer transition-colors"
            >
              <option value="All">All Unlock Sources</option>
              {unlockSources.map(src => (
                <option key={src} value={src}>
                  {src === 'TownRank' ? 'Town Rank' : src}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={e => onSortChange(e.target.value as 'name' | 'unlock' | 'cost')}
            className="px-3 py-2 bg-[#13181b] border border-white/15 rounded-xl text-xs text-[#c4b5a0] hover:text-white focus:outline-none focus:border-cyan-400 cursor-pointer transition-colors"
          >
            <option value="name">Sort: Name (A-Z)</option>
            <option value="unlock">Sort: Unlock Level</option>
            <option value="cost">Sort: Cost / Value</option>
          </select>

          {/* Planner Quick Action Button */}
          <button
            onClick={onOpenPlanner}
            aria-label="Planner"
            data-testid="wiki-planner-btn"
            title="Open Project Planner"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 transition-all flex-shrink-0"
          >
            <ClipboardList className="w-4 h-4" />
            <span className="hidden md:inline">Planner</span>
            {plannerItemCount > 0 && (
              <span className="bg-cyan-400 text-black text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {plannerItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Filter Pills (Horizontal Scroll on Mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10">
        {categories.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white text-[#13181b] font-bold shadow-md shadow-black/30'
                  : 'bg-white/5 text-[#c4b5a0] hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
