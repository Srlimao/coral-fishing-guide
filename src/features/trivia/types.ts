import { SupportedLanguage } from '../../i18n/types';

export type TriviaCategory =
  | 'Fish'
  | 'Insect'
  | 'Critter'
  | 'Farm'
  | 'Forage'
  | 'Artisan'
  | 'Fossil'
  | 'Gem'
  | 'Artifact';

export interface TriviaItem {
  id: string;
  category: TriviaCategory;
  englishName: string;
  translations: Record<SupportedLanguage, string>;
  imageName: string;
  imagePath: string;
}

export interface TriviaQuestion {
  id: string;
  targetItem: TriviaItem;
  options: TriviaItem[];
  correctOptionId: string;
}

export interface TriviaRoundQuestionResult {
  questionNumber: number;
  targetItem: TriviaItem;
  selectedOptionId: string | null; // null if timed out
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export type TriviaGamePhase = 'category_select' | 'in_game' | 'round_over';

export interface TownieLeaderboardEntry {
  id: string;
  name: string;
  score: number;
  portrait: string;
  title: string;
  isPlayer?: boolean;
  isChampion?: boolean;
}

export interface CategoryStatsRecord {
  bestScore: number;
  timesPlayed: number;
  hasWon: boolean;
  lastPlayedTimestamp?: number;
}

export type AllCategoryStats = Record<TriviaCategory, CategoryStatsRecord>;
