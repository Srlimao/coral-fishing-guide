import { FishItem } from '../types/fishing';
import rawFishData from './fishData.json';

export const FISH_LIST: FishItem[] = rawFishData as unknown as FishItem[];

export const FISH_MAP: Record<string, FishItem> = FISH_LIST.reduce((acc, fish) => {
  acc[fish.id] = fish;
  acc[fish.key] = fish;
  return acc;
}, {} as Record<string, FishItem>);
