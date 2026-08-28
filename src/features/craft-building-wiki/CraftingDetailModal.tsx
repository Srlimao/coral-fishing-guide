import React, { useState } from 'react';
import { CraftingRecipe } from './types';
import { X, Plus, Minus, Check, Sparkles, HelpCircle, Coins } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface CraftingDetailModalProps {
  recipe: CraftingRecipe | null;
  onClose: () => void;
  onAddToPlanner: (recipe: CraftingRecipe, quantity: number) => void;
  isPlanned?: boolean;
}

export const CraftingDetailModal: React.FC<CraftingDetailModalProps> = ({
  recipe,
  onClose,
  onAddToPlanner,
  isPlanned = false
}) => {
  const [craftQuantity, setCraftQuantity] = useState(1);
  const { getItemName, getCategoryName, getUnlockSourceName, t } = useLanguage();

  if (!recipe) return null;

  const localizedName = getItemName(recipe.name, recipe.name);
  const localizedCategory = getCategoryName(recipe.category);
  const localizedSource = getUnlockSourceName(recipe.unlock.source);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative bg-[#182228] border border-white/20 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl z-10 text-xs space-y-5"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#13181b] border border-white/15 flex items-center justify-center text-3xl shadow-inner">
              {recipe.iconEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white leading-tight">{localizedName}</h2>
                {recipe.yieldCount > 1 && (
                  <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {t('wiki_yield', 'Yield')}: x{recipe.yieldCount}
                  </span>
                )}
              </div>
              <span className="text-xs text-[#c4b5a0]">{localizedCategory}</span>
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

        {/* Unlock Requirement Card */}
        <div className="bg-cyan-950/40 border border-cyan-500/30 p-3 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-base flex-shrink-0">
            🔓
          </div>
          <div>
            <span className="text-[10px] text-cyan-300 uppercase font-black block">{t('wiki_unlock_condition', 'Unlock Criteria')}</span>
            <span className="text-xs text-white font-bold">
              {recipe.unlock.level ? `${localizedSource} ${t('level_prefix', 'Level')} ${recipe.unlock.level}` : recipe.unlock.description}
            </span>
          </div>
        </div>

        {/* Description & Usage Notes */}
        <div className="space-y-2">
          <p className="text-xs text-neutral-200 leading-relaxed">{recipe.description}</p>
          {recipe.usageNotes && (
            <div className="bg-[#13181b] p-3 rounded-xl border border-white/5 text-[11px] text-[#c4b5a0] flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>{recipe.usageNotes}</span>
            </div>
          )}
        </div>

        {/* Quantity Stepper & Required Materials Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {t('wiki_materials_needed', 'Required Materials')} ({craftQuantity}x)
            </span>

            {/* Stepper */}
            <div className="flex items-center gap-1 bg-[#13181b] border border-white/15 p-1 rounded-xl">
              <button
                onClick={() => setCraftQuantity(q => Math.max(1, q - 1))}
                className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-2 text-xs font-bold text-cyan-300 min-w-[2rem] text-center">
                {craftQuantity}x
              </span>
              <button
                onClick={() => setCraftQuantity(q => q + 1)}
                className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            {recipe.materials.map((mat, idx) => (
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

                <div className="text-right">
                  <span className="font-black text-cyan-300 text-xs">
                    {mat.amount * craftQuantity}x
                  </span>
                  <span className="text-[10px] text-neutral-400 block">({mat.amount} per craft)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sell Price Value */}
        <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
          <span className="text-xs text-[#c4b5a0] flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-400" /> {t('wiki_sell_price', 'Base Value')}
          </span>
          <span className="text-xs font-bold text-white">
            {recipe.sellPrice ? `${(recipe.sellPrice * craftQuantity).toLocaleString()}g` : 'N/A'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              onAddToPlanner(recipe, craftQuantity);
              onClose();
            }}
            className={`flex-1 py-2.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
              isPlanned
                ? 'bg-cyan-400 text-black shadow-cyan-400/30'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/30'
            }`}
          >
            {isPlanned ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{t('wiki_planner_add', '+ Add to Planner')} ({craftQuantity}x)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
