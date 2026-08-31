import React, { useState } from 'react';
import { ToolInfo, ToolTier } from './types';
import { X, Plus, Check, Coins, Zap, Clock, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface ToolDetailModalProps {
  tool: ToolInfo | null;
  initialTierIndex?: number;
  onClose: () => void;
  onAddToPlanner: (tool: ToolInfo, tier: ToolTier, tierIndex: number) => void;
  isPlanned?: boolean;
  plannedToolKeys?: Set<string>;
}

export const ToolDetailModal: React.FC<ToolDetailModalProps> = ({
  tool,
  initialTierIndex = 0,
  onClose,
  onAddToPlanner,
  isPlanned = false,
  plannedToolKeys
}) => {
  const [activeTierIdx, setActiveTierIdx] = useState(initialTierIndex);
  const { getItemName, getCategoryName } = useLanguage();

  if (!tool) return null;

  const currentTier = tool.tiers[activeTierIdx] || tool.tiers[0];
  const isTierPlanned = plannedToolKeys ? plannedToolKeys.has(`${tool.id}_${activeTierIdx}`) : isPlanned;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className="bg-[#182228] border border-white/20 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1c2930] via-[#1a2d36] to-[#1c2930] p-6 border-b border-white/10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#13181b] border border-white/20 flex items-center justify-center text-4xl shadow-inner">
              {tool.iconEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {getCategoryName(tool.category)}
                </span>
                <span className="text-xs text-[#c4b5a0]">{tool.shop}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{currentTier.name}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-[#c4b5a0] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          {/* Tier Navigation */}
          <div>
            <span className="text-xs font-bold text-[#c4b5a0] uppercase tracking-wider block mb-2">
              Upgrade Tier Progression
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-[#13181b] p-1.5 rounded-2xl border border-white/10">
              {tool.tiers.map((tier, idx) => (
                <button
                  key={tier.tierNumber}
                  onClick={() => setActiveTierIdx(idx)}
                  className={`p-2 rounded-xl text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    activeTierIdx === idx
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25 font-bold'
                      : 'text-[#c4b5a0] hover:text-white hover:bg-white/5 font-medium'
                  }`}
                >
                  <span className="text-xs">{tier.name.split(' ')[0]}</span>
                  <span className="text-[10px] opacity-75">
                    {tier.goldCost > 0 ? `${tier.goldCost.toLocaleString()}g` : 'Starter'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Stat Specs */}
          <div className="grid grid-cols-3 gap-3 bg-[#13181b]/80 p-4 rounded-2xl border border-white/10 text-center">
            <div>
              <span className="text-[11px] text-[#c4b5a0] flex items-center justify-center gap-1 mb-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" /> Upgrade Cost
              </span>
              <span className="text-sm font-bold text-white">
                {currentTier.goldCost > 0 ? `${currentTier.goldCost.toLocaleString()}g` : 'Free Starter'}
              </span>
            </div>

            <div className="border-x border-white/10">
              <span className="text-[11px] text-[#c4b5a0] flex items-center justify-center gap-1 mb-1">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Stamina Drain
              </span>
              <span className="text-sm font-bold text-cyan-300">{currentTier.staminaCost}</span>
            </div>

            <div>
              <span className="text-[11px] text-[#c4b5a0] flex items-center justify-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Blacksmith Time
              </span>
              <span className="text-sm font-bold text-emerald-300">
                {currentTier.daysToUpgrade > 0 ? `${currentTier.daysToUpgrade} Days` : 'Instant'}
              </span>
            </div>
          </div>

          {/* Scope & Perks */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 p-3 rounded-2xl">
              <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Charge Scope: <strong className="text-white font-black">{currentTier.aoeChargeArea}</strong></span>
            </div>

            <div className="bg-[#13181b] p-4 rounded-2xl border border-white/10 space-y-2">
              <span className="text-xs font-bold text-[#c4b5a0] uppercase tracking-wider block">
                Key Perks & Capabilities
              </span>
              <ul className="space-y-1.5">
                {currentTier.perks.map((perk, i) => (
                  <li key={i} className="text-xs text-neutral-200 flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Required Materials */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#c4b5a0] uppercase tracking-wider block">
              Required Smithing Materials
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentTier.materials.length > 0 ? (
                currentTier.materials.map((mat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#13181b] border border-white/10"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{mat.iconEmoji || '📦'}</span>
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {getItemName(mat.name, mat.name)}
                        </span>
                        {mat.source && (
                          <span className="text-[10px] text-[#c4b5a0]">{mat.source}</span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                      {mat.amount}x
                    </span>
                  </div>
                ))
              ) : (
                <div className="col-span-2 p-3 text-center text-xs text-neutral-400 bg-[#13181b] rounded-xl border border-white/10">
                  Starter equipment — no materials required
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#13181b] border-t border-white/10 flex items-center justify-between gap-4">
          <div className="text-xs text-[#c4b5a0]">
            Sanchez & Rafael forge upgrades during normal shop hours (9:00 - 18:00).
          </div>

          <button
            onClick={() => onAddToPlanner(tool, currentTier, activeTierIdx)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md ${
              isTierPlanned
                ? 'bg-amber-500 text-black shadow-amber-500/30'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-500/20'
            }`}
          >
            {isTierPlanned ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isTierPlanned ? 'In Shopping List' : `Add ${currentTier.name} to Plan`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
