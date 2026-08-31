import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { OceanTechInfo, OceanTechTier } from './types';
import { Waves, Plus, Check, Coins, Compass, Sparkles } from 'lucide-react';

interface OceanCatalogTabProps {
  oceanTechs: OceanTechInfo[];
  onSelectTech: (tech: OceanTechInfo, activeTierIndex: number) => void;
  onAddToPlanner: (tech: OceanTechInfo, tier: OceanTechTier, tierIndex: number) => void;
  plannedOceanKeys: Set<string>;
}

export const OceanCatalogTab: React.FC<OceanCatalogTabProps> = ({
  oceanTechs,
  onSelectTech,
  onAddToPlanner,
  plannedOceanKeys
}) => {
  const { t } = useLanguage();

  if (oceanTechs.length === 0) {
    return (
      <div className="bg-[#182228]/80 border border-white/10 rounded-2xl p-12 text-center space-y-3">
        <div className="text-4xl">🌊</div>
        <h3 className="text-base font-bold text-white">No Ocean Tech Found</h3>
        <p className="text-xs text-[#c4b5a0] max-w-md mx-auto">
          No underwater equipment or merfolk items matched your filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Info Bar */}
      <div className="flex items-center justify-between text-xs text-[#c4b5a0] px-1">
        <div className="flex items-center gap-1.5 font-bold">
          <Waves className="w-4 h-4 text-teal-400" />
          <span>
            {t('wiki_showing_count', 'Showing')} <strong className="text-white">{oceanTechs.length}</strong> Ocean & Diving Technologies
          </span>
        </div>
        <span>Underwater farming, Lumina equipment, and Merfolk tailoring</span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {oceanTechs.map(tech => (
          <OceanTechCard
            key={tech.id}
            tech={tech}
            onSelect={onSelectTech}
            onAddToPlanner={onAddToPlanner}
            plannedKeys={plannedOceanKeys}
          />
        ))}
      </div>
    </div>
  );
};

interface OceanTechCardProps {
  tech: OceanTechInfo;
  onSelect: (tech: OceanTechInfo, activeTierIndex: number) => void;
  onAddToPlanner: (tech: OceanTechInfo, tier: OceanTechTier, tierIndex: number) => void;
  plannedKeys: Set<string>;
}

const OceanTechCard: React.FC<OceanTechCardProps> = ({
  tech,
  onSelect,
  onAddToPlanner,
  plannedKeys
}) => {
  const [selectedTierIdx, setSelectedTierIdx] = useState(0);
  const activeTier = tech.tiers[selectedTierIdx] || tech.tiers[0];
  const { getItemName, getCategoryName } = useLanguage();

  const isPlanned = plannedKeys.has(`${tech.id}_${selectedTierIdx}`);

  return (
    <div
      data-ocean-id={tech.id}
      onClick={() => onSelect(tech, selectedTierIdx)}
      className="group relative bg-[#182228]/90 hover:bg-[#1f2c34] border border-white/10 hover:border-teal-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-0.5"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2.5 mb-2.5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#13181b] border border-white/15 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform shadow-inner">
              {tech.iconEmoji}
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-teal-300 transition-colors leading-tight">
                {activeTier.name}
              </h3>
              <span className="text-[11px] text-[#c4b5a0]">{tech.source}</span>
            </div>
          </div>

          <span className="bg-teal-500/20 border border-teal-400/40 text-teal-300 text-[10px] font-black px-2 py-0.5 rounded-full">
            {getCategoryName(tech.category)}
          </span>
        </div>

        {/* Tier Selector Pills */}
        {tech.tiers.length > 1 && (
          <div
            className="flex items-center gap-1 bg-[#13181b] p-1 rounded-xl border border-white/10 mb-3"
            onClick={e => e.stopPropagation()}
          >
            {tech.tiers.map((tItem, idx) => (
              <button
                key={tItem.tierNumber}
                onClick={() => setSelectedTierIdx(idx)}
                className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  selectedTierIdx === idx
                    ? 'bg-teal-500 text-black shadow-md'
                    : 'text-[#c4b5a0] hover:text-white hover:bg-white/5'
                }`}
              >
                {tItem.name.split(' ')[0]}
              </button>
            ))}
          </div>
        )}

        {/* Cost & Requirements Grid */}
        <div className="grid grid-cols-2 gap-2 bg-[#13181b]/70 p-2.5 rounded-xl border border-white/5 mb-3 text-center">
          <div className="space-y-0.5">
            <span className="text-[10px] text-[#c4b5a0] block uppercase flex items-center justify-center gap-1">
              <Coins className="w-3 h-3 text-amber-400" /> Cost
            </span>
            <span className="text-xs font-bold text-white">
              {activeTier.goldCost > 0 ? `${activeTier.goldCost.toLocaleString()}g` : 'Free'}
            </span>
          </div>

          <div className="space-y-0.5 border-l border-white/10">
            <span className="text-[10px] text-[#c4b5a0] block uppercase flex items-center justify-center gap-1">
              <Compass className="w-3 h-3 text-teal-400" /> Unlock
            </span>
            <span className="text-xs font-bold text-teal-300 line-clamp-1">{activeTier.unlock.description}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-neutral-300 line-clamp-2 mb-2.5 leading-relaxed">
          {activeTier.description}
        </p>

        {/* Benefits */}
        <div className="bg-[#13181b] p-2.5 rounded-xl border border-white/10 mb-3 space-y-1">
          {activeTier.benefits.slice(0, 2).map((benefit, i) => (
            <div key={i} className="text-[11px] text-teal-200 flex items-start gap-1.5 leading-tight">
              <Sparkles className="w-3 h-3 text-teal-400 flex-shrink-0 mt-0.5" />
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
              <span>{mat.iconEmoji || '🌊'}</span>
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
          <span>🧜‍♂️</span> Undersea Tech
        </span>

        <button
          onClick={e => {
            e.stopPropagation();
            onAddToPlanner(tech, activeTier, selectedTierIdx);
          }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
            isPlanned
              ? 'bg-teal-500 text-black shadow-teal-500/30'
              : 'bg-white/10 hover:bg-teal-500/20 text-[#c4b5a0] hover:text-teal-300 border border-white/10 hover:border-teal-400/40'
          }`}
        >
          {isPlanned ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{isPlanned ? 'Planned' : 'Plan'}</span>
        </button>
      </div>
    </div>
  );
};
