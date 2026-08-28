import React, { useState } from 'react';
import { BuildingInfo, BuildingTier } from './types';
import { Plus, Check, Info, Clock, Coins, Maximize2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface BuildingCardProps {
  building: BuildingInfo;
  onSelect: (building: BuildingInfo, activeTierIndex: number) => void;
  onAddToPlanner: (building: BuildingInfo, tier: BuildingTier, tierIndex: number) => void;
  isPlanned?: boolean;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({
  building,
  onSelect,
  onAddToPlanner,
  isPlanned = false
}) => {
  const [selectedTierIdx, setSelectedTierIdx] = useState(0);
  const activeTier = building.tiers[selectedTierIdx] || building.tiers[0];
  const { getItemName, getBuildingName, getCategoryName, t } = useLanguage();

  const localizedTierName = getBuildingName(activeTier.name, activeTier.name);
  const localizedCategory = getCategoryName(building.category);

  return (
    <div
      data-building-id={building.id}
      onClick={() => onSelect(building, selectedTierIdx)}
      className="group relative bg-[#182228]/90 hover:bg-[#1f2c34] border border-white/10 hover:border-amber-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-0.5"
    >
      <div>
        {/* Header: Icon, Name & Builder */}
        <div className="flex items-start justify-between gap-2.5 mb-2.5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#13181b] border border-white/15 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform shadow-inner">
              {building.iconEmoji}
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors leading-tight">
                {localizedTierName}
              </h3>
              <span className="text-[11px] text-[#c4b5a0]">{building.builder}</span>
            </div>
          </div>

          <span className="bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full">
            {localizedCategory}
          </span>
        </div>

        {/* Tier Selector Pills (if multi-tier building) */}
        {building.tiers.length > 1 && (
          <div
            className="flex items-center gap-1 bg-[#13181b] p-1 rounded-xl border border-white/10 mb-3"
            onClick={e => e.stopPropagation()}
          >
            {building.tiers.map((tItem, idx) => (
              <button
                key={tItem.tierNumber}
                onClick={() => setSelectedTierIdx(idx)}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all ${
                  selectedTierIdx === idx
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-[#c4b5a0] hover:text-white hover:bg-white/5'
                }`}
              >
                Lvl {tItem.tierNumber}
              </button>
            ))}
          </div>
        )}

        {/* Stats Grid: Gold Cost, Build Days, Dimensions */}
        <div className="grid grid-cols-3 gap-2 bg-[#13181b]/70 p-2.5 rounded-xl border border-white/5 mb-3 text-center">
          <div className="space-y-0.5">
            <span className="text-[10px] text-[#c4b5a0] block uppercase flex items-center justify-center gap-1">
              <Coins className="w-3 h-3 text-amber-400" /> Cost
            </span>
            <span className="text-xs font-bold text-white">
              {activeTier.goldCost > 0 ? `${activeTier.goldCost.toLocaleString()}g` : 'Free'}
            </span>
          </div>

          <div className="space-y-0.5 border-x border-white/10">
            <span className="text-[10px] text-[#c4b5a0] block uppercase flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" /> {t('wiki_days_to_build', 'Days')}
            </span>
            <span className="text-xs font-bold text-white">
              {activeTier.daysToBuild} {activeTier.daysToBuild === 1 ? 'Day' : 'Days'}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-[#c4b5a0] block uppercase flex items-center justify-center gap-1">
              <Maximize2 className="w-3 h-3 text-purple-400" /> {t('wiki_footprint', 'Size')}
            </span>
            <span className="text-xs font-bold text-white">{activeTier.dimensions}</span>
          </div>
        </div>

        {/* Unlock Condition */}
        <div className="mb-2.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border bg-purple-500/20 text-purple-300 border-purple-500/30">
            <span>🔓</span>
            <span>{activeTier.unlock.description}</span>
          </span>
        </div>

        {/* Building Description */}
        <p className="text-xs text-neutral-300 line-clamp-2 mb-3 leading-relaxed">
          {activeTier.description}
        </p>

        {/* Required Materials */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {activeTier.materials.map((mat, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 bg-[#13181b] border border-white/10 text-neutral-200 text-[11px] px-2 py-0.5 rounded-md font-medium"
            >
              <span>{mat.iconEmoji || '📦'}</span>
              <span>
                {mat.amount}x {getItemName(mat.name, mat.name)}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Footer: Details & Add to Planner */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 mt-auto">
        <span className="text-[11px] text-[#c4b5a0] flex items-center gap-1 group-hover:text-white transition-colors">
          <Info className="w-3.5 h-3.5" /> Full Blueprint
        </span>

        <button
          onClick={e => {
            e.stopPropagation();
            onAddToPlanner(building, activeTier, selectedTierIdx);
          }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
            isPlanned
              ? 'bg-amber-500 text-black shadow-amber-500/30'
              : 'bg-white/10 hover:bg-amber-500/20 text-[#c4b5a0] hover:text-amber-300 border border-white/10 hover:border-amber-400/40'
          }`}
        >
          {isPlanned ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{isPlanned ? 'Planned' : 'Plan'}</span>
        </button>
      </div>
    </div>
  );
};
