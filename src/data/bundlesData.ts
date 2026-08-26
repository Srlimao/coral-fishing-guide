import bundlesJson from './bundlesData.json';

export interface BundleItem {
  itemId: string;
  itemName: string;
  amount: number;
  quality: string;
  iconName?: string;
  isFish: boolean;
  fishKey?: string;
}

export interface TempleBundle {
  title: string;
  imageName: string;
  numOfItemRequired: number;
  reward: string;
  items: BundleItem[];
}

export interface AltarCategory {
  key: string;
  title: string;
  reward: string;
  urlPath: string;
  bundles: TempleBundle[];
}

export const ALL_ALTARS: AltarCategory[] = bundlesJson as AltarCategory[];

export const CATCHING_ALTAR = ALL_ALTARS.find(a => a.key === 'CatchingBased') || ALL_ALTARS[1];
