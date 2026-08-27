import { AvatarOption, GcpDbConfig, UserProfile } from './types';
import { defaultGameState, defaultUserProgress } from '../../context/fishingContextHelpers';
import { DEFAULT_FISHING_LOCATIONS } from '../../data/locationsData';

export const LOCAL_STORAGE_KEY_PROFILES = 'coral_fish_profiles_v1';
export const LOCAL_STORAGE_KEY_ACTIVE_PROFILE_ID = 'coral_fish_active_profile_id_v1';
export const LOCAL_STORAGE_KEY_GCP_DB_CONFIG = 'coral_fish_gcp_db_config_v1';

export const DEFAULT_GCP_DB_CONFIG: GcpDbConfig = {
  baseUrl: 'https://db.dunhas.com/api',
  apiKey: '1b4a19fdc1eda3f481543b0f25b01ab428e0f6467ad7c9c1',
  collection: 'coral_fish_users'
};

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'fisherman',
    name: 'Master Angler',
    emoji: '🎣',
    bgGradient: 'from-blue-600 to-cyan-500',
    borderColor: 'border-cyan-400'
  },
  {
    id: 'diver',
    name: 'Coral Diver',
    emoji: '🤿',
    bgGradient: 'from-cyan-600 to-teal-500',
    borderColor: 'border-teal-400'
  },
  {
    id: 'farmer',
    name: 'Island Farmer',
    emoji: '🌾',
    bgGradient: 'from-amber-600 to-yellow-500',
    borderColor: 'border-amber-400'
  },
  {
    id: 'mermaid',
    name: 'Mermaid Friend',
    emoji: '🧜',
    bgGradient: 'from-fuchsia-600 to-pink-500',
    borderColor: 'border-pink-400'
  },
  {
    id: 'captain',
    name: 'Sea Captain',
    emoji: '⚓',
    bgGradient: 'from-indigo-600 to-blue-500',
    borderColor: 'border-indigo-400'
  },
  {
    id: 'explorer',
    name: 'Cave Explorer',
    emoji: '🧭',
    bgGradient: 'from-emerald-600 to-green-500',
    borderColor: 'border-emerald-400'
  },
  {
    id: 'shaman',
    name: 'Goddess Devotee',
    emoji: '✨',
    bgGradient: 'from-violet-600 to-purple-500',
    borderColor: 'border-violet-400'
  },
  {
    id: 'chef',
    name: 'Sashimi Chef',
    emoji: '🍣',
    bgGradient: 'from-rose-600 to-orange-500',
    borderColor: 'border-orange-400'
  }
];

export const getAvatarById = (avatarId: string): AvatarOption => {
  return AVATAR_OPTIONS.find(a => a.id === avatarId) || AVATAR_OPTIONS[0];
};

export const createNewProfile = (
  name: string,
  avatarId: string = 'fisherman',
  initialProgress?: Partial<UserProfile>
): UserProfile => {
  const timestamp = Date.now();
  const cleanName = name.trim() || 'Farmer';
  const id = `user_${timestamp}_${Math.random().toString(36).substring(2, 7)}`;

  return {
    id,
    name: cleanName,
    avatar: avatarId,
    createdAt: timestamp,
    updatedAt: timestamp,
    userProgress: initialProgress?.userProgress || { ...defaultUserProgress },
    gameState: initialProgress?.gameState || { ...defaultGameState },
    settings: {
      uiScale: initialProgress?.settings?.uiScale || 1.05,
      language: initialProgress?.settings?.language || 'en',
      autoCloudSync: initialProgress?.settings?.autoCloudSync ?? false
    },
    customLocations: initialProgress?.customLocations || DEFAULT_FISHING_LOCATIONS,
    customMapImage: initialProgress?.customMapImage || null
  };
};
