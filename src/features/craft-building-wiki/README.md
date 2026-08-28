# 🔨 Craft & Building Wiki Domain

This feature slice encapsulates the complete Crafting Recipes and Farm Buildings encyclopedia for Coral Island (v1.3+), complete with unlock condition tracking and an aggregated shopping list material calculator.

---

## 📂 Architecture & Files

- [`types.ts`](file:///D:/Apps/CoralFishGuide/src/features/craft-building-wiki/types.ts): Data contracts for Recipes, Buildings, Upgrades, Materials, and Planner entries.
- [`craftingData.ts`](file:///D:/Apps/CoralFishGuide/src/features/craft-building-wiki/craftingData.ts): Exhaustive crafting dataset across 8 distinct gameplay categories.
- [`buildingData.ts`](file:///D:/Apps/CoralFishGuide/src/features/craft-building-wiki/buildingData.ts): Exhaustive farm buildings, greenhouse, sheds, coops, barns, and farmhouse upgrade tiers dataset.
- [`useWikiPlanner.ts`](file:///D:/Apps/CoralFishGuide/src/features/craft-building-wiki/useWikiPlanner.ts): State hook managing the local wishlist and calculating aggregated raw materials needed.
- [`CraftBuildingWikiView.tsx`](file:///D:/Apps/CoralFishGuide/src/features/craft-building-wiki/CraftBuildingWikiView.tsx): Orchestrator view with mode switching (Crafting vs Buildings).
- [`WikiFiltersBar.tsx`](file:///D:/Apps/CoralFishGuide/src/features/craft-building-wiki/WikiFiltersBar.tsx): Live fuzzy search, category pills, unlock source selector, and sort controls.
- [`CraftingCard.tsx`](file:///D:/Apps/CoralFishGuide/src/features/craft-building-wiki/CraftingCard.tsx): Compact recipe card with materials and quick-add planner button.
- [`BuildingCard.tsx`](file:///D:/Apps/CoralFishGuide/src/features/craft-building-wiki/BuildingCard.tsx): Building tier card with dimensions, gold cost, and quick-add planner button.
- [`CraftingDetailModal.tsx`](file:///D:/Apps/CoralFishGuide/src/features/craft-building-wiki/CraftingDetailModal.tsx): In-depth recipe modal with quantity stepper and ingredient acquisition guide.
- [`BuildingDetailModal.tsx`](file:///D:/Apps/CoralFishGuide/src/features/craft-building-wiki/BuildingDetailModal.tsx): In-depth building modal with multi-tier comparison tabs and animal capacities.
- [`PlannerDrawer.tsx`](file:///D:/Apps/CoralFishGuide/src/features/craft-building-wiki/PlannerDrawer.tsx): Slide-over aggregated shopping list with clipboard export.
