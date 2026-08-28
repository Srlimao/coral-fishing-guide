import { useState, useEffect, useMemo, useCallback } from 'react';
import { PlannerItem, AggregatedMaterial, MaterialRequirement } from './types';

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
    const map = new Map<string, { totalAmount: number; source?: string; iconEmoji?: string }>();

    for (const item of plannerItems) {
      for (const mat of item.materials) {
        const requiredAmount = mat.amount * item.quantity;
        const current = map.get(mat.name) || {
          totalAmount: 0,
          source: mat.source,
          iconEmoji: mat.iconEmoji
        };
        map.set(mat.name, {
          totalAmount: current.totalAmount + requiredAmount,
          source: mat.source || current.source,
          iconEmoji: mat.iconEmoji || current.iconEmoji
        });
      }
    }

    return Array.from(map.entries())
      .map(([name, data]) => ({
        name,
        totalAmount: data.totalAmount,
        source: data.source,
        iconEmoji: data.iconEmoji
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }, [plannerItems]);

  const copyShoppingList = useCallback(async () => {
    if (plannerItems.length === 0) return;

    let text = `🏝️ CORAL ISLAND - FARM PROJECT SHOPPING LIST\n`;
    text += `==============================================\n`;
    if (totalGoldCost > 0) {
      text += `💰 Total Gold: ${totalGoldCost.toLocaleString()}g\n\n`;
    }

    text += `📦 PLANNED PROJECTS:\n`;
    plannerItems.forEach(item => {
      text += `  • [${item.completed ? 'X' : ' '}] ${item.quantity}x ${item.name}`;
      if (item.goldCost > 0) text += ` (${(item.goldCost * item.quantity).toLocaleString()}g)`;
      text += `\n`;
    });

    text += `\n🧱 AGGREGATED RAW MATERIALS NEEDED:\n`;
    aggregatedMaterials.forEach(mat => {
      text += `  • ${mat.iconEmoji || '•'} ${mat.name}: ${mat.totalAmount.toLocaleString()}`;
      if (mat.source) text += ` (${mat.source})`;
      text += `\n`;
    });

    text += `==============================================\n`;
    text += `Generated with Coral Guide Companion\n`;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopiedNotification(true);
        setTimeout(() => setCopiedNotification(false), 2500);
      } catch {
        setCopiedNotification(true);
        setTimeout(() => setCopiedNotification(false), 2500);
      }
    }
  }, [plannerItems, totalGoldCost, aggregatedMaterials]);

  return {
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
    totalItemsCount: plannerItems.reduce((acc, item) => acc + item.quantity, 0)
  };
}
