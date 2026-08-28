import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { CRAFTING_RECIPES } from './craftingData';
import { BUILDING_CATALOGUE } from './buildingData';
import { CraftingRecipe, BuildingInfo } from './types';
import { CRAFTING_CATEGORIES, BUILDING_CATEGORIES, UNLOCK_SOURCES } from './wikiConstants';
import { WikiFiltersBar } from './WikiFiltersBar';
import { CraftingCatalogTab } from './CraftingCatalogTab';
import { BuildingCatalogTab } from './BuildingCatalogTab';
import { CraftingDetailModal } from './CraftingDetailModal';
import { BuildingDetailModal } from './BuildingDetailModal';
import { PlannerDrawer } from './PlannerDrawer';
import { useWikiPlanner } from './useWikiPlanner';
import { Hammer, Home, Sparkles } from 'lucide-react';

export const CraftBuildingWikiView: React.FC = () => {
  const { t, getItemName, getBuildingName, getCategoryName, getUnlockSourceName } = useLanguage();
  const [activeCatalogMode, setActiveCatalogMode] = useState<'crafting' | 'buildings'>('crafting');

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUnlockSource, setSelectedUnlockSource] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'unlock' | 'cost'>('name');

  // Modals & Drawer State
  const [selectedRecipe, setSelectedRecipe] = useState<CraftingRecipe | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingInfo | null>(null);
  const [selectedBuildingTierIndex, setSelectedBuildingTierIndex] = useState(0);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);

  // Planner Hook
  const {
    plannerItems,
    addCraftingItem,
    addBuildingItem,
    updateQuantity,
    removeItem,
    toggleComplete,
    clearPlanner,
    totalGoldCost,
    aggregatedMaterials,
    copyShoppingList,
    copiedNotification,
    totalItemsCount
  } = useWikiPlanner();

  // Planned Lookup Sets
  const plannedRecipeIds = useMemo(() => {
    return new Set(plannerItems.filter(i => i.type === 'crafting').map(i => i.targetId));
  }, [plannerItems]);

  const plannedBuildingKeys = useMemo(() => {
    return new Set(
      plannerItems
        .filter(i => i.type === 'building')
        .map(i => `${i.targetId}_${i.tierIndex ?? 0}`)
    );
  }, [plannerItems]);

  const handleSwitchMode = (mode: 'crafting' | 'buildings') => {
    setActiveCatalogMode(mode);
    setSelectedCategory('All');
  };

  // Filtered Crafting Recipes
  const filteredRecipes = useMemo(() => {
    return CRAFTING_RECIPES.filter(recipe => {
      if (selectedCategory !== 'All' && recipe.category !== selectedCategory) {
        return false;
      }
      if (selectedUnlockSource !== 'All' && recipe.unlock.source !== selectedUnlockSource) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const locName = getItemName(recipe.name, recipe.name).toLowerCase();
        const matchesName = recipe.name.toLowerCase().includes(q) || locName.includes(q);
        const matchesCategory = recipe.category.toLowerCase().includes(q) || getCategoryName(recipe.category).toLowerCase().includes(q);
        const matchesDesc = recipe.description.toLowerCase().includes(q);
        const matchesUnlock = recipe.unlock.description.toLowerCase().includes(q) || getUnlockSourceName(recipe.unlock.source).toLowerCase().includes(q);
        const matchesMaterials = recipe.materials.some(
          m => m.name.toLowerCase().includes(q) || getItemName(m.name, m.name).toLowerCase().includes(q)
        );

        if (!matchesName && !matchesCategory && !matchesDesc && !matchesUnlock && !matchesMaterials) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = getItemName(a.name, a.name);
        const nameB = getItemName(b.name, b.name);
        return nameA.localeCompare(nameB);
      }
      if (sortBy === 'unlock') return (a.unlock.level || 0) - (b.unlock.level || 0);
      if (sortBy === 'cost') return (b.sellPrice || 0) - (a.sellPrice || 0);
      return 0;
    });
  }, [selectedCategory, selectedUnlockSource, searchQuery, sortBy, getItemName, getCategoryName, getUnlockSourceName]);

  // Filtered Buildings
  const filteredBuildings = useMemo(() => {
    return BUILDING_CATALOGUE.filter(building => {
      if (selectedCategory !== 'All' && building.category !== selectedCategory) {
        return false;
      }
      if (selectedUnlockSource !== 'All') {
        const hasMatchingTier = building.tiers.some(t => t.unlock.source === selectedUnlockSource);
        if (!hasMatchingTier) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const locBuildingName = getBuildingName(building.name, building.name).toLowerCase();
        const matchesName = building.name.toLowerCase().includes(q) || locBuildingName.includes(q);
        const matchesCategory = building.category.toLowerCase().includes(q) || getCategoryName(building.category).toLowerCase().includes(q);
        const matchesBuilder = building.builder.toLowerCase().includes(q);
        const matchesTiers = building.tiers.some(
          t =>
            t.name.toLowerCase().includes(q) ||
            getBuildingName(t.name, t.name).toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.materials.some(m => m.name.toLowerCase().includes(q) || getItemName(m.name, m.name).toLowerCase().includes(q)) ||
            t.featuresUnlocked.some(f => f.toLowerCase().includes(q))
        );

        if (!matchesName && !matchesCategory && !matchesBuilder && !matchesTiers) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = getBuildingName(a.name, a.name);
        const nameB = getBuildingName(b.name, b.name);
        return nameA.localeCompare(nameB);
      }
      if (sortBy === 'cost') return (b.tiers[0]?.goldCost || 0) - (a.tiers[0]?.goldCost || 0);
      return 0;
    });
  }, [selectedCategory, selectedUnlockSource, searchQuery, sortBy, getItemName, getBuildingName, getCategoryName]);

  return (
    <div className="space-y-6">
      {/* Hero Header & Mode Switcher */}
      <div className="bg-gradient-to-r from-[#182228] via-[#1a2b34] to-[#182228] p-5 sm:p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Island Encyclopedia
              </span>
              <span className="text-xs text-[#c4b5a0] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Live Catalog & Planner
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              {t('wiki_title')}
            </h1>
            <p className="text-xs text-[#c4b5a0] max-w-2xl mt-1 leading-relaxed">
              {t('wiki_subtitle')}
            </p>
          </div>

          <div className="flex items-center bg-[#13181b] p-1.5 rounded-2xl border border-white/15 self-start sm:self-auto flex-shrink-0">
            <button
              onClick={() => handleSwitchMode('crafting')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCatalogMode === 'crafting'
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                  : 'text-[#c4b5a0] hover:text-white hover:bg-white/5'
              }`}
            >
              <Hammer className="w-4 h-4" />
              <span>{t('wiki_tab_crafting')}</span>
            </button>

            <button
              onClick={() => handleSwitchMode('buildings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCatalogMode === 'buildings'
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25'
                  : 'text-[#c4b5a0] hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{t('wiki_tab_buildings')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <WikiFiltersBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={activeCatalogMode === 'crafting' ? CRAFTING_CATEGORIES : BUILDING_CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedUnlockSource={selectedUnlockSource}
        onSelectUnlockSource={setSelectedUnlockSource}
        unlockSources={UNLOCK_SOURCES}
        plannerItemCount={totalItemsCount}
        onOpenPlanner={() => setIsPlannerOpen(true)}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Content View */}
      {activeCatalogMode === 'crafting' ? (
        <CraftingCatalogTab
          recipes={filteredRecipes}
          onSelectRecipe={setSelectedRecipe}
          onAddToPlanner={r => addCraftingItem(r.id, r.name, r.materials, 1)}
          plannedRecipeIds={plannedRecipeIds}
        />
      ) : (
        <BuildingCatalogTab
          buildings={filteredBuildings}
          onSelectBuilding={(b, tierIdx) => {
            setSelectedBuilding(b);
            setSelectedBuildingTierIndex(tierIdx);
          }}
          onAddToPlanner={(b, tier, tierIdx) =>
            addBuildingItem(b.id, tierIdx, tier.name, tier.goldCost, tier.materials, 1)
          }
          plannedBuildingKeys={plannedBuildingKeys}
        />
      )}

      {/* Modals & Slide-over Drawer */}
      <CraftingDetailModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onAddToPlanner={(r, qty) => addCraftingItem(r.id, r.name, r.materials, qty)}
        isPlanned={selectedRecipe ? plannedRecipeIds.has(selectedRecipe.id) : false}
      />

      <BuildingDetailModal
        building={selectedBuilding}
        initialTierIndex={selectedBuildingTierIndex}
        onClose={() => setSelectedBuilding(null)}
        onAddToPlanner={(b, tier, tierIdx) =>
          addBuildingItem(b.id, tierIdx, tier.name, tier.goldCost, tier.materials, 1)
        }
        isPlanned={
          selectedBuilding
            ? plannedBuildingKeys.has(`${selectedBuilding.id}_${selectedBuildingTierIndex}`)
            : false
        }
      />

      <PlannerDrawer
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        plannerItems={plannerItems}
        aggregatedMaterials={aggregatedMaterials}
        totalGoldCost={totalGoldCost}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onToggleComplete={toggleComplete}
        onClearPlanner={clearPlanner}
        onCopyShoppingList={copyShoppingList}
        copiedNotification={copiedNotification}
      />
    </div>
  );
};
