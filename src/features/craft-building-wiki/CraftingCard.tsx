import React from 'react';
import { CraftingRecipe } from './types';
import { Plus, Check, Info } from 'lucide-react';

interface CraftingCardProps {
  recipe: CraftingRecipe;
  onSelect: (recipe: CraftingRecipe) => void;
  onAddToPlanner: (recipe: CraftingRecipe) => void;
  isPlanned?: boolean;
}

export const CraftingCard: React.FC<CraftingCardProps> = ({
  recipe,
  onSelect,
  onAddToPlanner,
  isPlanned = false
}) => {
  const getUnlockBadgeColor = (source: string) => {
    switch (source) {
      case 'Farming':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Mining':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Foraging':
        return 'bg-lime-500/20 text-lime-300 border-lime-500/30';
      case 'Diving':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'Fishing':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Catching':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
      case 'Combat':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'TownRank':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Lab':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'Altar':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-neutral-700/40 text-neutral-300 border-neutral-600/40';
    }
  };

  return (
    <div
      data-recipe-id={recipe.id}
      onClick={() => onSelect(recipe)}
      className="group relative bg-[#182228]/90 hover:bg-[#1f2c34] border border-white/10 hover:border-cyan-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-0.5"
    >
      <div>
        {/* Header: Icon, Name, Category & Yield */}
        <div className="flex items-start justify-between gap-2.5 mb-2.5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#13181b] border border-white/15 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform shadow-inner">
              {recipe.iconEmoji}
            </div>
            <div>
              <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors leading-snug">
                {recipe.name}
              </h3>
              <span className="text-[11px] text-[#c4b5a0]">{recipe.category}</span>
            </div>
          </div>

          {recipe.yieldCount > 1 && (
            <span className="bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-black px-2 py-0.5 rounded-full">
              Yield: x{recipe.yieldCount}
            </span>
          )}
        </div>

        {/* Unlock Condition Badge */}
        <div className="mb-3">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border ${getUnlockBadgeColor(
              recipe.unlock.source
            )}`}
          >
            <span>🔓</span>
            <span>{recipe.unlock.description}</span>
          </span>
        </div>

        {/* Recipe Description */}
        <p className="text-xs text-neutral-300 line-clamp-2 mb-3 leading-relaxed">
          {recipe.description}
        </p>

        {/* Materials Chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {recipe.materials.map((mat, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 bg-[#13181b] border border-white/10 text-neutral-200 text-[11px] px-2 py-0.5 rounded-md font-medium"
            >
              <span>{mat.iconEmoji || '📦'}</span>
              <span>
                {mat.amount}x {mat.name}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Footer Controls: Details link + Add to Planner button */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 mt-auto">
        <span className="text-[11px] text-[#c4b5a0] flex items-center gap-1 group-hover:text-white transition-colors">
          <Info className="w-3.5 h-3.5" /> Details
        </span>

        <button
          onClick={e => {
            e.stopPropagation();
            onAddToPlanner(recipe);
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
