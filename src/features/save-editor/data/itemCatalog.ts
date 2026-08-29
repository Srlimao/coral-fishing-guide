import itemsRaw from '../../../data/itemsData.json';

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const ITEM_CATEGORIES = [
  'All',
  'Tools & Gear',
  'Seeds',
  'Fish',
  'Bugs & Critters',
  'Minerals & Gems',
  'Artisan & Food',
  'Materials',
  'Furniture & Machines',
  'Clothing',
  'Special & Quest'
] as const;

export type ItemCategory = typeof ITEM_CATEGORIES[number];

export const ALL_ITEMS: CatalogItem[] = itemsRaw as CatalogItem[];

export const ITEM_LOOKUP_BY_ID: Record<string, CatalogItem> = {};
ALL_ITEMS.forEach(item => {
  ITEM_LOOKUP_BY_ID[item.id] = item;
});

export function searchItemCatalog(
  query: string,
  category: ItemCategory = 'All',
  limit = 100
): CatalogItem[] {
  const cleanQ = query.trim().toLowerCase();
  const results: CatalogItem[] = [];

  for (const item of ALL_ITEMS) {
    if (category !== 'All' && item.category !== category) {
      continue;
    }

    if (cleanQ) {
      const matchName = item.name.toLowerCase().includes(cleanQ);
      const matchId = item.id.toLowerCase().includes(cleanQ);
      const matchDesc = item.description.toLowerCase().includes(cleanQ);
      if (!matchName && !matchId && !matchDesc) {
        continue;
      }
    }

    results.push(item);
    if (results.length >= limit) break;
  }

  return results;
}

export function getItemDisplayName(itemId: string): string {
  return ITEM_LOOKUP_BY_ID[itemId]?.name || itemId;
}
