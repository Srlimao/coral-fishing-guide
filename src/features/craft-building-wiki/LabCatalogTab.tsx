import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LabResearchInfo, LabResearchTier } from './types';
import { Sparkles, Plus, Check, Coins, FlaskConical, Award } from 'lucide-react';

interface LabCatalogTabProps {
  researches: LabResearchInfo[];
  onSelectResearch: (research: LabResearchInfo, activeTierIndex: number) => void;
  onAddToPlanner: (research: LabResearchInfo, tier: LabResearchTier, tierIndex: number) => void;
  plannedLabKeys: Set<string>;
}

export const LabCatalogTab: React.FC<LabCatalogTabProps> = ({
  researches,
  onSelectResearch,
  onAddToPlanner,
  plannedLabKeys
}) => {
  const { t } = useLanguage();

  if (researches.length === 0) {
    return (
      <div className="bg-[#182228]/80 border border-white/10 rounded-2xl p-12 text-center space-y-3">
        <div className="text-4xl">🔬</div>
        <h3 className="text-base font-bold text-white">No Laboratory Projects Found</h3>
        <p className="text-xs text-[#c4b5a0] max-w-md mx-auto">
          No research projects matched your filter criteria. Try selecting "All Categories".
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Info Bar */}
      <div className="flex items-center justify-between text-xs text-[#c4b5a0] px-1">
        <div className="flex items-center gap-1.5 font-bold">
          <FlaskConical className="w-4 h-4 text-cyan-400" />
          <span>
            {t('wiki_showing_count', 'Showing')} <strong className="text-white">{researches.length}</strong> Lab Research Projects
          </span>
        </div>
        <span>Ling's Laboratory developments for crop quality & farm automation</span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {researches.map(research => (
          <LabResearchCard
            key={research.id}
            research={research}
            onSelect={onSelectResearch}
            onAddToPlanner={onAddToPlanner}
            plannedKeys={plannedLabKeys}
          />
        ))}
      </div>
    </div>
  );
};

interface LabResearchCardProps {
  research: LabResearchInfo;
  onSelect: (research: LabResearchInfo, activeTierIndex: number) => void;
  onAddToPlanner: (research: LabResearchInfo, tier: LabResearchTier, tierIndex: number) => void;
  plannedKeys: Set<string>;
}

const LabResearchCard: React.FC<LabResearchCardProps> = ({
  research,
  onSelect,
  onAddToPlanner,
  plannedKeys
}) => {
  const [selectedTierIdx, setSelectedTierIdx] = useState(0);
  const activeTier = research.tiers[selectedTierIdx] || research.tiers[0];
  const { getItemName, getCategoryName } = useLanguage();

  const isPlanned = plannedKeys.has(`${research.id}_${selectedTierIdx}`);

  return (
    <div
      data-lab-id={research.id}
      onClick={() => onSelect(research, selectedTierIdx)}
      className="group relative bg-[#182228]/90 hover:bg-[#1f2c34] border border-white/10 hover:border-cyan-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-0.5"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2.5 mb-2.5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#13181b] border border-white/15 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform shadow-inner">
              {research.iconEmoji}
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors leading-tight">
                {activeTier.name}
              </h3>
              <span className="text-[11px] text-[#c4b5a0]">{research.laboratory}</span>
            </div>
          </div>

          <span className="bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-black px-2 py-0.5 rounded-full">
            {getCategoryName(research.category)}
          </span>
        </div>

        {/* Tier Selector Pills */}
        {research.tiers.length > 1 && (
          <div
            className="flex items-center gap-1 bg-[#13181b] p-1 rounded-xl border border-white/10 mb-3"
            onClick={e => e.stopPropagation()}
          >
            {research.tiers.map((tItem, idx) => (
              <button
                key={tItem.tierNumber}
                onClick={() => setSelectedTierIdx(idx)}
                className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  selectedTierIdx === idx
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'text-[#c4b5a0] hover:text-white hover:bg-white/5'
                }`}
              >
                {tItem.name.split(' ')[0]}
              </button>
            ))}
          </div>
        )}

        {/* Cost & Unlock Grid */}
        <div className="grid grid-cols-2 gap-2 bg-[#13181b]/70 p-2.5 rounded-xl border border-white/5 mb-3 text-center">
          <div className="space-y-0.5">
            <span className="text-[10px] text-[#c4b5a0] block uppercase flex items-center justify-center gap-1">
              <Coins className="w-3 h-3 text-amber-400" /> Research Fee
            </span>
            <span className="text-xs font-bold text-white">
              {activeTier.goldCost > 0 ? `${activeTier.goldCost.toLocaleString()}g` : 'Free'}
            </span>
          </div>

          <div className="space-y-0.5 border-l border-white/10">
            <span className="text-[10px] text-[#c4b5a0] block uppercase flex items-center justify-center gap-1">
              <Award className="w-3 h-3 text-purple-400" /> Unlock
            </span>
            <span className="text-xs font-bold text-purple-300">{activeTier.unlock.description}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-neutral-300 line-clamp-2 mb-2.5 leading-relaxed">
          {activeTier.description}
        </p>

        {/* Key Benefits */}
        <div className="bg-[#13181b] p-2.5 rounded-xl border border-white/10 mb-3 space-y-1">
          {activeTier.benefits.slice(0, 2).map((benefit, i) => (
            <div key={i} className="text-[11px] text-cyan-200 flex items-start gap-1.5 leading-tight">
              <Sparkles className="w-3 h-3 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Required Materials */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {activeTier.materials.map((mat, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 bg-[#13181b] border border-white/10 text-neutral-200 text-[11px] px-2 py-0.5 rounded-md font-medium"
            >
              <span>{mat.iconEmoji || '🧪'}</span>
              <span>
                {mat.amount}x {getItemName(mat.name, mat.name)}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 mt-auto">
        <span className="text-[11px] text-[#c4b5a0] flex items-center gap-1 group-hover:text-white transition-colors">
          <span>🔬</span> Lab Project
        </span>

        <button
          onClick={e => {
            e.stopPropagation();
            onAddToPlanner(research, activeTier, selectedTierIdx);
          }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
            isPlanned
              ? 'bg-cyan-500 text-black shadow-cyan-500/30'
              : 'bg-white/10 hover:bg-cyan-500/20 text-[#c4b5a0] hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40'
          }`}
        >
          {isPlanned ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{isPlanned ? 'Planned' : 'Plan'}</span>
        </button>
      </div>
    </div>
  );
};
