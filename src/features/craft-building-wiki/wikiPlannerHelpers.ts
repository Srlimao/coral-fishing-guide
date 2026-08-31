import { PlannerItem, AggregatedMaterial } from './types';

export function calculateAggregatedMaterials(plannerItems: PlannerItem[]): AggregatedMaterial[] {
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
}

export function formatShoppingListText(
  plannerItems: PlannerItem[],
  totalGoldCost: number,
  aggregatedMaterials: AggregatedMaterial[]
): string {
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
  return text;
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}
