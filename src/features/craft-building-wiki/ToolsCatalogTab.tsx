import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ToolInfo, ToolTier } from './types';
import { Wrench, Plus, Check, Info, Coins, Zap, Clock, ShieldCheck } from 'lucide-react';

interface ToolsCatalogTabProps {
  tools: ToolInfo[];
  onSelectTool: (tool: ToolInfo, activeTierIndex: number) => void;
  onAddToPlanner: (tool: ToolInfo, tier: ToolTier, tierIndex: number) => void;
  plannedToolKeys: Set<string>;
}

export const ToolsCatalogTab: React.FC<ToolsCatalogTabProps> = ({
  tools,
  onSelectTool,
  onAddToPlanner,
  plannedToolKeys
}) => {
  const { t } = useLanguage();

  if (tools.length === 0) {
    return (
      <div className="bg-[#182228]/80 border border-white/10 rounded-2xl p-12 text-center space-y-3">
        <div className="text-4xl">⚒️</div>
        <h3 className="text-base font-bold text-white">No Tools Found</h3>
        <p className="text-xs text-[#c4b5a0] max-w-md mx-auto">
          No tools or upgrades matched your search query. Try resetting filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Info Bar */}
      <div className="flex items-center justify-between text-xs text-[#c4b5a0] px-1">
        <div className="flex items-center gap-1.5 font-bold">
          <Wrench className="w-4 h-4 text-amber-400" />
          <span>
            {t('wiki_showing_count', 'Showing')} <strong className="text-white">{tools.length}</strong> Tools & Upgrades
          </span>
        </div>
        <span>Select tier level to view blacksmith turnaround & stats</span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map(tool => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onSelect={onSelectTool}
            onAddToPlanner={onAddToPlanner}
            plannedKeys={plannedToolKeys}
          />
        ))}
      </div>
    </div>
  );
};

interface ToolCardProps {
  tool: ToolInfo;
  onSelect: (tool: ToolInfo, activeTierIndex: number) => void;
  onAddToPlanner: (tool: ToolInfo, tier: ToolTier, tierIndex: number) => void;
  plannedKeys: Set<string>;
}

const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onSelect,
  onAddToPlanner,
  plannedKeys
}) => {
  const [selectedTierIdx, setSelectedTierIdx] = useState(0);
  const activeTier = tool.tiers[selectedTierIdx] || tool.tiers[0];
  const { getItemName, getCategoryName } = useLanguage();

  const isPlanned = plannedKeys.has(`${tool.id}_${selectedTierIdx}`);

  return (
    <div
      data-tool-id={tool.id}
      onClick={() => onSelect(tool, selectedTierIdx)}
      className="group relative bg-[#182228]/90 hover:bg-[#1f2c34] border border-white/10 hover:border-amber-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-0.5"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2.5 mb-2.5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#13181b] border border-white/15 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform shadow-inner">
              {tool.iconEmoji}
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors leading-tight">
                {activeTier.name}
              </h3>
              <span className="text-[11px] text-[#c4b5a0]">{tool.shop}</span>
            </div>
          </div>

          <span className="bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full">
            {getCategoryName(tool.category)}
          </span>
        </div>

        {/* Tier Selector Pills */}
        <div
          className="flex items-center gap-1 bg-[#13181b] p-1 rounded-xl border border-white/10 mb-3"
          onClick={e => e.stopPropagation()}
        >
          {tool.tiers.map((tItem, idx) => (
            <button
              key={tItem.tierNumber}
              onClick={() => setSelectedTierIdx(idx)}
              className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] font-bold transition-all ${
                selectedTierIdx === idx
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-[#c4b5a0] hover:text-white hover:bg-white/5'
              }`}
            >
              {idx === 0 ? 'Base' : tItem.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Stats Grid: Gold Cost, Stamina, AOE / Area */}
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
              <Zap className="w-3 h-3 text-cyan-400" /> Energy
            </span>
            <span className="text-xs font-bold text-white">{activeTier.staminaCost}</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-[#c4b5a0] block uppercase flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" /> Time
            </span>
            <span className="text-xs font-bold text-white">
              {activeTier.daysToUpgrade > 0 ? `${activeTier.daysToUpgrade} ${activeTier.daysToUpgrade === 1 ? 'Day' : 'Days'}` : 'Instant'}
            </span>
          </div>
        </div>

        {/* Charge AOE / Area */}
        <div className="mb-2.5 flex items-center gap-1.5 text-[11px] text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded-xl font-medium">
          <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 text-cyan-400" />
          <span>Charge Scope: <strong className="text-white font-bold">{activeTier.aoeChargeArea}</strong></span>
        </div>

        {/* Description */}
        <p className="text-xs text-neutral-300 line-clamp-2 mb-3 leading-relaxed">
          {activeTier.description}
        </p>

        {/* Required Materials */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {activeTier.materials.length > 0 ? (
            activeTier.materials.map((mat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-[#13181b] border border-white/10 text-neutral-200 text-[11px] px-2 py-0.5 rounded-md font-medium"
              >
                <span>{mat.iconEmoji || '📦'}</span>
                <span>
                  {mat.amount}x {getItemName(mat.name, mat.name)}
                </span>
              </span>
            ))
          ) : (
            <span className="text-[11px] text-neutral-400 italic">No upgrade materials required</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 mt-auto">
        <span className="text-[11px] text-[#c4b5a0] flex items-center gap-1 group-hover:text-white transition-colors">
          <Info className="w-3.5 h-3.5" /> Progression Guide
        </span>

        <button
          onClick={e => {
            e.stopPropagation();
            onAddToPlanner(tool, activeTier, selectedTierIdx);
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
