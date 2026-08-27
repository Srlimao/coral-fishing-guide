import { ActiveGameState, FishingLocationPin, UserProgress } from '../../types/fishing';
import { SupportedLanguage } from '../../i18n/types';

export type CloudSyncStatus = 'synced' | 'syncing' | 'offline' | 'error' | 'local_only';

export interface AvatarOption {
  id: string;
  name: string;
  emoji: string;
  bgGradient: string;
  borderColor: string;
}

export interface UserProfileSettings {
  uiScale: number;
  language: SupportedLanguage;
  autoCloudSync: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
  updatedAt: number;
  lastCloudSync?: number;
  userProgress: UserProgress;
  gameState: ActiveGameState;
  settings: UserProfileSettings;
  customLocations?: FishingLocationPin[];
  customMapImage?: string | null;
}

export interface UserProfileSummary {
  id: string;
  name: string;
  avatar: string;
  updatedAt: number;
  caughtCount: number;
  donatedCount: number;
  offeredCount: number;
}

export interface GcpDbConfig {
  baseUrl: string;
  apiKey: string;
  collection: string;
}

export interface CloudDbDoc<T = any> {
  id: string;
  data: T;
  created_at?: string;
  updated_at?: string;
}

export interface CloudDbListResponse<T = any> {
  collection: string;
  count: number;
  results: CloudDbDoc<T>[];
}
