import rawItems from './triviaItemsData.json';
import { TriviaCategory, TriviaItem } from '../features/trivia/types';

export const TRIVIA_ITEMS: TriviaItem[] = rawItems as TriviaItem[];

export const TRIVIA_CATEGORIES: TriviaCategory[] = [
  'Fish',
  'Insect',
  'Critter',
  'Farm',
  'Forage',
  'Artisan',
  'Fossil',
  'Gem',
  'Artifact'
];

export const getItemsByCategory = (category: TriviaCategory): TriviaItem[] => {
  return TRIVIA_ITEMS.filter(item => item.category === category);
};
