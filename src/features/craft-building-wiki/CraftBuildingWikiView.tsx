import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { CraftingRecipe, BuildingInfo, ToolInfo } from './types';
import {
  CatalogDomain,
  CRAFTING_CATEGORIES,
  BUILDING_CATEGORIES,
  TOOL_CATEGORIES,
  LAB_CATEGORIES,
  OCEAN_CATEGORIES,
  UNLOCK_SOURCES
} from './wikiConstants';
import { WikiHeaderNav } from './WikiHeaderNav';
import { WikiFiltersBar } from './WikiFiltersBar';
import { CraftingCatalogTab } from './CraftingCatalogTab';
import { BuildingCatalogTab } from './BuildingCatalogTab';
import { ToolsCatalogTab } from './ToolsCatalogTab';
import { LabCatalogTab } from './LabCatalogTab';
import { OceanCatalogTab } from './OceanCatalogTab';
import { CraftingDetailModal } from './CraftingDetailModal';
import { BuildingDetailModal } from './BuildingDetailModal';
import { ToolDetailModal } from './ToolDetailModal';
import { PlannerDrawer } from './PlannerDrawer';
import { useWikiPlanner } from './useWikiPlanner';
import { useWikiFilteredData } from './useWikiFilteredData';

export const CraftBuildingWikiView: React.FC = () => {
  const { getItemName, getBuildingName, getCategoryName, getUnlockSourceName } = useLanguage();
  const [activeCatalogMode, setActiveCatalogMode] = useState<CatalogDomain>('crafting');

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUnlockSource, setSelectedUnlockSource] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'unlock' | 'cost'>('name');

  // Modals & Drawer State
  const [selectedRecipe, setSelectedRecipe] = useState<CraftingRecipe | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingInfo | null>(null);
  const [selectedBuildingTierIndex, setSelectedBuildingTierIndex] = useState(0);
  const [selectedTool, setSelectedTool] = useState<ToolInfo | null>(null);
  const [selectedToolTierIndex, setSelectedToolTierIndex] = useState(0);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);

  // Planner Hook
  const {
    plannerItems,
    addCraftingItem,
    addBuildingItem,
    addToolItem,
    addLabItem,
    addOceanItem,
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
    return new Set(plannerItems.filter(i => i.type === 'building').map(i => `${i.targetId}_${i.tierIndex ?? 0}`));
  }, [plannerItems]);

  const plannedToolKeys = useMemo(() => {
    return new Set(plannerItems.filter(i => i.type === 'tool').map(i => `${i.targetId}_${i.tierIndex ?? 0}`));
  }, [plannerItems]);

  const plannedLabKeys = useMemo(() => {
    return new Set(plannerItems.filter(i => i.type === 'lab').map(i => `${i.targetId}_${i.tierIndex ?? 0}`));
  }, [plannerItems]);

  const plannedOceanKeys = useMemo(() => {
    return new Set(plannerItems.filter(i => i.type === 'ocean').map(i => `${i.targetId}_${i.tierIndex ?? 0}`));
  }, [plannerItems]);

  const handleSwitchMode = (mode: CatalogDomain) => {
    setActiveCatalogMode(mode);
    setSelectedCategory('All');
  };

  const {
    filteredRecipes,
    filteredBuildings,
    filteredTools,
    filteredLabResearch,
    filteredOceanTech
  } = useWikiFilteredData({
    activeMode: activeCatalogMode,
    searchQuery,
    selectedCategory,
    selectedUnlockSource,
    sortBy,
    getItemName,
    getBuildingName,
    getCategoryName,
    getUnlockSourceName
  });

  const activeCategories = useMemo(() => {
    switch (activeCatalogMode) {
      case 'crafting': return CRAFTING_CATEGORIES;
      case 'buildings': return BUILDING_CATEGORIES;
      case 'tools': return TOOL_CATEGORIES;
      case 'lab': return LAB_CATEGORIES;
      case 'ocean': return OCEAN_CATEGORIES;
    }
  }, [activeCatalogMode]);

  return (
    <div className="space-y-6">
      {/* Hero Header & 5-Domain Mode Switcher */}
      <WikiHeaderNav activeMode={activeCatalogMode} onSwitchMode={handleSwitchMode} />

      {/* Filter & Search Toolbar */}
      <WikiFiltersBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={activeCategories}
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

      {/* Active Domain Tab View */}
      {activeCatalogMode === 'crafting' && (
        <CraftingCatalogTab
          recipes={filteredRecipes}
          onSelectRecipe={setSelectedRecipe}
          onAddToPlanner={r => addCraftingItem(r.id, r.name, r.materials, 1)}
          plannedRecipeIds={plannedRecipeIds}
        />
      )}

      {activeCatalogMode === 'buildings' && (
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

      {activeCatalogMode === 'tools' && (
        <ToolsCatalogTab
          tools={filteredTools}
          onSelectTool={(tItem, tierIdx) => {
            setSelectedTool(tItem);
            setSelectedToolTierIndex(tierIdx);
          }}
          onAddToPlanner={(tool, tier, tierIdx) =>
            addToolItem(tool.id, tierIdx, tier.name, tier.goldCost, tier.materials, 1)
          }
          plannedToolKeys={plannedToolKeys}
        />
      )}

      {activeCatalogMode === 'lab' && (
        <LabCatalogTab
          researches={filteredLabResearch}
          onSelectResearch={() => {}}
          onAddToPlanner={(research, tier, tierIdx) =>
            addLabItem(research.id, tierIdx, tier.name, tier.goldCost, tier.materials, 1)
          }
          plannedLabKeys={plannedLabKeys}
        />
      )}

      {activeCatalogMode === 'ocean' && (
        <OceanCatalogTab
          oceanTechs={filteredOceanTech}
          onSelectTech={() => {}}
          onAddToPlanner={(tech, tier, tierIdx) =>
            addOceanItem(tech.id, tierIdx, tier.name, tier.goldCost, tier.materials, 1)
          }
          plannedOceanKeys={plannedOceanKeys}
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

      <ToolDetailModal
        tool={selectedTool}
        initialTierIndex={selectedToolTierIndex}
        onClose={() => setSelectedTool(null)}
        onAddToPlanner={(tool, tier, tierIdx) =>
          addToolItem(tool.id, tierIdx, tier.name, tier.goldCost, tier.materials, 1)
        }
        plannedToolKeys={plannedToolKeys}
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


