import React, { useState } from 'react';
import { BuildingInfo, BuildingTier } from './types';
import { X, Plus, Check, Coins, Clock, Maximize2, ShieldCheck, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface BuildingDetailModalProps {
  building: BuildingInfo | null;
  initialTierIndex?: number;
  onClose: () => void;
  onAddToPlanner: (building: BuildingInfo, tier: BuildingTier, tierIndex: number) => void;
  isPlanned?: boolean;
}

export const BuildingDetailModal: React.FC<BuildingDetailModalProps> = ({
  building,
  initialTierIndex = 0,
  onClose,
  onAddToPlanner,
  isPlanned = false
}) => {
  const [selectedTierIdx, setSelectedTierIdx] = useState(initialTierIndex);
  const { getItemName, getBuildingName, getCategoryName, t } = useLanguage();

  if (!building) return null;

  const activeTier = building.tiers[selectedTierIdx] || building.tiers[0];
  const localizedTierName = getBuildingName(activeTier.name, activeTier.name);
  const localizedCategory = getCategoryName(building.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative bg-[#182228] border border-white/20 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl z-10 text-xs space-y-5"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#13181b] border border-white/15 flex items-center justify-center text-3xl shadow-inner">
              {building.iconEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white leading-tight">{localizedTierName}</h2>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {localizedCategory}
                </span>
              </div>
              <span className="text-xs text-[#c4b5a0]">{building.builder}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Upgrade Level Selector Tabs (if multi-tier) */}
        {building.tiers.length > 1 && (
          <div className="flex items-center gap-2 bg-[#13181b] p-1.5 rounded-2xl border border-white/10">
            {building.tiers.map((tier, idx) => (
              <button
                key={tier.tierNumber}
                onClick={() => setSelectedTierIdx(idx)}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                  selectedTierIdx === idx
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                    : 'text-[#c4b5a0] hover:text-white hover:bg-white/5'
                }`}
              >
                Lvl {tier.tierNumber}: {getBuildingName(tier.name, tier.name)}
              </button>
            ))}
          </div>
        )}

        {/* Telemetry Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-[#13181b] p-3 rounded-2xl border border-white/10 space-y-0.5 text-center">
            <span className="text-[10px] text-[#c4b5a0] uppercase font-bold flex items-center justify-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-400" /> Cost
            </span>
            <span className="text-sm font-black text-white">
              {activeTier.goldCost > 0 ? `${activeTier.goldCost.toLocaleString()}g` : 'Free'}
            </span>
          </div>

          <div className="bg-[#13181b] p-3 rounded-2xl border border-white/10 space-y-0.5 text-center">
            <span className="text-[10px] text-[#c4b5a0] uppercase font-bold flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> {t('wiki_days_to_build', 'Build Time')}
            </span>
            <span className="text-sm font-black text-white">
              {activeTier.daysToBuild} {activeTier.daysToBuild === 1 ? 'Day' : 'Days'}
            </span>
          </div>

          <div className="bg-[#13181b] p-3 rounded-2xl border border-white/10 space-y-0.5 text-center">
            <span className="text-[10px] text-[#c4b5a0] uppercase font-bold flex items-center justify-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-purple-400" /> {t('wiki_footprint', 'Size')}
            </span>
            <span className="text-sm font-black text-white">{activeTier.dimensions}</span>
          </div>

          <div className="bg-[#13181b] p-3 rounded-2xl border border-white/10 space-y-0.5 text-center">
            <span className="text-[10px] text-[#c4b5a0] uppercase font-bold flex items-center justify-center gap-1">
              🔓 {t('wiki_unlock_condition', 'Requirement')}
            </span>
            <span className="text-xs font-bold text-amber-300 truncate block" title={activeTier.unlock.description}>
              {activeTier.unlock.description}
            </span>
          </div>
        </div>

        {/* Capacity & Features */}
        <div className="bg-amber-950/30 border border-amber-500/30 p-4 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              {activeTier.capacityText ? `Capacity: ${activeTier.capacityText}` : t('wiki_benefits', 'Building Features')}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeTier.featuresUnlocked.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-neutral-200 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-neutral-300 leading-relaxed">{activeTier.description}</p>

        {/* Required Materials Table */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider block">
            {t('wiki_materials_needed', 'Construction Materials Needed')}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeTier.materials.map((mat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-[#13181b] border border-white/10 rounded-xl"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{mat.iconEmoji || '📦'}</span>
                  <div>
                    <span className="font-bold text-white text-xs block">{getItemName(mat.name, mat.name)}</span>
                    {mat.source && (
                      <span className="text-[10px] text-[#c4b5a0] flex items-center gap-1">
                        <HelpCircle className="w-2.5 h-2.5 text-neutral-400" /> {mat.source}
                      </span>
                    )}
                  </div>
                </div>

                <span className="font-black text-amber-400 text-xs">{mat.amount}x</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              onAddToPlanner(building, activeTier, selectedTierIdx);
              onClose();
            }}
            className={`flex-1 py-2.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
              isPlanned
                ? 'bg-amber-400 text-black shadow-amber-400/30'
                : 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/30'
            }`}
          >
            {isPlanned ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isPlanned ? 'Planned' : t('wiki_planner_add', '+ Add to Planner')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
