import { useState, useEffect, useMemo, useCallback } from 'react';
import { PlannerItem, AggregatedMaterial, MaterialRequirement } from './types';
import {
  calculateAggregatedMaterials,
  formatShoppingListText,
  copyTextToClipboard
} from './wikiPlannerHelpers';

const STORAGE_KEY = 'coral_wiki_planner_v1';

export function useWikiPlanner() {
  const [plannerItems, setPlannerItems] = useState<PlannerItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [copiedNotification, setCopiedNotification] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plannerItems));
    } catch (e) {
      console.warn('Failed to persist wiki planner state:', e);
    }
  }, [plannerItems]);

  const addCraftingItem = useCallback((
    recipeId: string,
    name: string,
    materials: MaterialRequirement[],
    quantity = 1
  ) => {
    setPlannerItems(prev => {
      const existing = prev.find(item => item.type === 'crafting' && item.targetId === recipeId);
      if (existing) {
        return prev.map(item =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      const newItem: PlannerItem = {
        id: `craft_${recipeId}_${Date.now()}`,
        type: 'crafting',
        targetId: recipeId,
        name,
        goldCost: 0,
        materials,
        quantity,
        completed: false
      };
      return [...prev, newItem];
    });
  }, []);

  const addBuildingItem = useCallback((
    buildingId: string,
    tierIndex: number,
    tierName: string,
    goldCost: number,
    materials: MaterialRequirement[],
    quantity = 1
  ) => {
    setPlannerItems(prev => {
      const existing = prev.find(
        item => item.type === 'building' && item.targetId === buildingId && item.tierIndex === tierIndex
      );
      if (existing) {
        return prev.map(item =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      const newItem: PlannerItem = {
        id: `build_${buildingId}_${tierIndex}_${Date.now()}`,
        type: 'building',
        targetId: buildingId,
        tierIndex,
        name: tierName,
        goldCost,
        materials,
        quantity,
        completed: false
      };
      return [...prev, newItem];
    });
  }, []);

  const addToolItem = useCallback((
    toolId: string,
    tierIndex: number,
    tierName: string,
    goldCost: number,
    materials: MaterialRequirement[],
    quantity = 1
  ) => {
    setPlannerItems(prev => {
      const existing = prev.find(
        item => item.type === 'tool' && item.targetId === toolId && item.tierIndex === tierIndex
      );
      if (existing) {
        return prev.map(item =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      const newItem: PlannerItem = {
        id: `tool_${toolId}_${tierIndex}_${Date.now()}`,
        type: 'tool',
        targetId: toolId,
        tierIndex,
        name: tierName,
        goldCost,
        materials,
        quantity,
        completed: false
      };
      return [...prev, newItem];
    });
  }, []);

  const addLabItem = useCallback((
    researchId: string,
    tierIndex: number,
    tierName: string,
    goldCost: number,
    materials: MaterialRequirement[],
    quantity = 1
  ) => {
    setPlannerItems(prev => {
      const existing = prev.find(
        item => item.type === 'lab' && item.targetId === researchId && item.tierIndex === tierIndex
      );
      if (existing) {
        return prev.map(item =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      const newItem: PlannerItem = {
        id: `lab_${researchId}_${tierIndex}_${Date.now()}`,
        type: 'lab',
        targetId: researchId,
        tierIndex,
        name: tierName,
        goldCost,
        materials,
        quantity,
        completed: false
      };
      return [...prev, newItem];
    });
  }, []);

  const addOceanItem = useCallback((
    techId: string,
    tierIndex: number,
    tierName: string,
    goldCost: number,
    materials: MaterialRequirement[],
    quantity = 1
  ) => {
    setPlannerItems(prev => {
      const existing = prev.find(
        item => item.type === 'ocean' && item.targetId === techId && item.tierIndex === tierIndex
      );
      if (existing) {
        return prev.map(item =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      const newItem: PlannerItem = {
        id: `ocean_${techId}_${tierIndex}_${Date.now()}`,
        type: 'ocean',
        targetId: techId,
        tierIndex,
        name: tierName,
        goldCost,
        materials,
        quantity,
        completed: false
      };
      return [...prev, newItem];
    });
  }, []);

  const updateQuantity = useCallback((id: string, newQty: number) => {
    if (newQty <= 0) {
      setPlannerItems(prev => prev.filter(item => item.id !== id));
    } else {
      setPlannerItems(prev =>
        prev.map(item => (item.id === id ? { ...item, quantity: newQty } : item))
      );
    }
  }, []);

  const removeItem = useCallback((id: string) => {
    setPlannerItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setPlannerItems(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  }, []);

  const clearPlanner = useCallback(() => {
    setPlannerItems([]);
  }, []);

  const totalGoldCost = useMemo(() => {
    return plannerItems.reduce((acc, item) => acc + item.goldCost * item.quantity, 0);
  }, [plannerItems]);

  const aggregatedMaterials = useMemo<AggregatedMaterial[]>(() => {
    return calculateAggregatedMaterials(plannerItems);
  }, [plannerItems]);

  const copyShoppingList = useCallback(async () => {
    if (plannerItems.length === 0) return;
    const text = formatShoppingListText(plannerItems, totalGoldCost, aggregatedMaterials);
    const success = await copyTextToClipboard(text);
    if (success) {
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  }, [plannerItems, totalGoldCost, aggregatedMaterials]);

  return {
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
    totalItemsCount: plannerItems.reduce((acc, item) => acc + item.quantity, 0)
  };
}
