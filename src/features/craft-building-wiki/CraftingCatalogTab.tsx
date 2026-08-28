import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { CraftingRecipe } from './types';
import { CraftingCard } from './CraftingCard';
import { Sparkles } from 'lucide-react';

interface CraftingCatalogTabProps {
  recipes: CraftingRecipe[];
  onSelectRecipe: (recipe: CraftingRecipe) => void;
  onAddToPlanner: (recipe: CraftingRecipe) => void;
  plannedRecipeIds: Set<string>;
}

export const CraftingCatalogTab: React.FC<CraftingCatalogTabProps> = ({
  recipes,
  onSelectRecipe,
  onAddToPlanner,
  plannedRecipeIds
}) => {
  const { t } = useLanguage();

  if (recipes.length === 0) {
    return (
      <div className="bg-[#182228]/80 border border-white/10 rounded-2xl p-12 text-center space-y-3">
        <div className="text-4xl">🔍</div>
        <h3 className="text-base font-bold text-white">{t('wiki_empty_crafting')}</h3>
        <p className="text-xs text-[#c4b5a0] max-w-md mx-auto">
          No craftable items matched your active search query and filter criteria. Try clearing search or selecting "All Categories".
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Total Items Info Bar */}
      <div className="flex items-center justify-between text-xs text-[#c4b5a0] px-1">
        <div className="flex items-center gap-1.5 font-bold">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{t('wiki_showing_count')} <strong className="text-white">{recipes.length}</strong> {t('wiki_tab_crafting')}</span>
        </div>
        <span>{t('wiki_crafting_subtitle')}</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {recipes.map(recipe => (
          <CraftingCard
            key={recipe.id}
            recipe={recipe}
            onSelect={onSelectRecipe}
            onAddToPlanner={onAddToPlanner}
            isPlanned={plannedRecipeIds.has(recipe.id)}
          />
        ))}
      </div>
    </div>
  );
};
