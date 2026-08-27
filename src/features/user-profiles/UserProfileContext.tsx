import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { CloudSyncStatus, GcpDbConfig, UserProfile } from './types';
import {
  DEFAULT_GCP_DB_CONFIG,
  LOCAL_STORAGE_KEY_ACTIVE_PROFILE_ID,
  LOCAL_STORAGE_KEY_GCP_DB_CONFIG,
  LOCAL_STORAGE_KEY_PROFILES,
  createNewProfile
} from './defaultProfiles';
import {
  deleteProfileFromCloud,
  fetchCloudProfilesList,
  fetchProfileFromCloud,
  uploadProfileToCloud
} from './userProfileApi';
import {
  LOCAL_STORAGE_KEY_GAMESTATE,
  LOCAL_STORAGE_KEY_LOCATIONS,
  LOCAL_STORAGE_KEY_PROGRESS,
  defaultGameState,
  defaultUserProgress
} from '../../context/fishingContextHelpers';
import { DEFAULT_FISHING_LOCATIONS } from '../../data/locationsData';

interface UserProfileContextType {
  profiles: UserProfile[];
  activeProfile: UserProfile;
  activeProfileId: string;
  cloudSyncStatus: CloudSyncStatus;
  lastSyncError: string | null;
  dbConfig: GcpDbConfig;
  isProfileModalOpen: boolean;
  createProfile: (name: string, avatarId?: string, cloneCurrent?: boolean) => UserProfile;
  switchProfile: (profileId: string) => void;
  updateActiveProfile: (updates: Partial<UserProfile>) => void;
  deleteProfile: (profileId: string) => boolean;
  renameProfile: (profileId: string, newName: string) => void;
  changeAvatar: (profileId: string, avatarId: string) => void;
  syncActiveProfile: () => Promise<boolean>;
  pullCloudProfile: (profileId: string) => Promise<boolean>;
  pullAllCloudProfiles: () => Promise<UserProfile[]>;
  deleteCloudProfileDoc: (profileId: string) => Promise<boolean>;
  setDbConfig: (config: GcpDbConfig) => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

const loadInitialProfiles = (): { profiles: UserProfile[]; activeId: string } => {
  try {
    const savedProfiles = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILES);
    const savedActiveId = localStorage.getItem(LOCAL_STORAGE_KEY_ACTIVE_PROFILE_ID);

    if (savedProfiles) {
      const parsed: UserProfile[] = JSON.parse(savedProfiles);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const activeId = savedActiveId && parsed.some(p => p.id === savedActiveId) ? savedActiveId : parsed[0].id;
        return { profiles: parsed, activeId };
      }
    }

    // Migrate from legacy single-user keys if available
    const legacyProgress = localStorage.getItem(LOCAL_STORAGE_KEY_PROGRESS);
    const legacyState = localStorage.getItem(LOCAL_STORAGE_KEY_GAMESTATE);
    const legacyLocations = localStorage.getItem(LOCAL_STORAGE_KEY_LOCATIONS);

    const initialProfile = createNewProfile('Main Farmer', 'fisherman', {
      userProgress: legacyProgress ? JSON.parse(legacyProgress) : defaultUserProgress,
      gameState: legacyState ? JSON.parse(legacyState) : defaultGameState,
      customLocations: legacyLocations ? JSON.parse(legacyLocations) : DEFAULT_FISHING_LOCATIONS
    });

    return { profiles: [initialProfile], activeId: initialProfile.id };
  } catch {
    const fallback = createNewProfile('Main Farmer', 'fisherman');
    return { profiles: [fallback], activeId: fallback.id };
  }
};

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profilesData, setProfilesData] = useState(loadInitialProfiles);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>('local_only');
  const [lastSyncError, setLastSyncError] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [dbConfig, setDbConfigState] = useState<GcpDbConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_GCP_DB_CONFIG);
      return saved ? { ...DEFAULT_GCP_DB_CONFIG, ...JSON.parse(saved) } : DEFAULT_GCP_DB_CONFIG;
    } catch {
      return DEFAULT_GCP_DB_CONFIG;
    }
  });

  const syncTimeoutRef = useRef<any>(null);
  const profiles = profilesData.profiles;
  const activeProfileId = profilesData.activeId;
  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PROFILES, JSON.stringify(profiles));
    localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVE_PROFILE_ID, activeProfileId);
  }, [profiles, activeProfileId]);

  const setDbConfig = (cfg: GcpDbConfig) => {
    setDbConfigState(cfg);
    localStorage.setItem(LOCAL_STORAGE_KEY_GCP_DB_CONFIG, JSON.stringify(cfg));
  };

  const syncProfileDirect = useCallback(async (profileToSync: UserProfile): Promise<boolean> => {
    setCloudSyncStatus('syncing');
    setLastSyncError(null);
    const result = await uploadProfileToCloud(profileToSync, dbConfig);
    if (result.ok) {
      setCloudSyncStatus('synced');
      setProfilesData(prev => ({
        ...prev,
        profiles: prev.profiles.map(p => (p.id === profileToSync.id ? { ...p, lastCloudSync: Date.now() } : p))
      }));
      return true;
    } else {
      setCloudSyncStatus('error');
      setLastSyncError(result.error || 'Failed to sync with GCP DB server');
      return false;
    }
  }, [dbConfig]);

  const triggerDebouncedSync = useCallback((targetProfile: UserProfile) => {
    if (!targetProfile.settings.autoCloudSync) return;
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

    setCloudSyncStatus('syncing');
    syncTimeoutRef.current = setTimeout(() => {
      syncProfileDirect(targetProfile);
    }, 3000);
  }, [syncProfileDirect]);

  const updateActiveProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfilesData(prev => {
      const updatedProfiles = prev.profiles.map(p => {
        if (p.id === prev.activeId) {
          const updated: UserProfile = { ...p, ...updates, updatedAt: Date.now() };
          triggerDebouncedSync(updated);
          return updated;
        }
        return p;
      });
      return { ...prev, profiles: updatedProfiles };
    });
  }, [triggerDebouncedSync]);

  const createProfile = (name: string, avatarId: string = 'fisherman', cloneCurrent: boolean = false): UserProfile => {
    const baseProgress = cloneCurrent ? { ...activeProfile } : undefined;
    const newProf = createNewProfile(name, avatarId, baseProgress);
    setProfilesData(prev => ({
      profiles: [...prev.profiles, newProf],
      activeId: newProf.id
    }));
    triggerDebouncedSync(newProf);
    return newProf;
  };

  const switchProfile = (profileId: string) => {
    if (profiles.some(p => p.id === profileId)) {
      setProfilesData(prev => ({ ...prev, activeId: profileId }));
      setCloudSyncStatus('local_only');
    }
  };

  const deleteProfile = (profileId: string): boolean => {
    if (profiles.length <= 1) return false;
    setProfilesData(prev => {
      const nextProfiles = prev.profiles.filter(p => p.id !== profileId);
      const nextActiveId = prev.activeId === profileId ? nextProfiles[0].id : prev.activeId;
      return { profiles: nextProfiles, activeId: nextActiveId };
    });
    return true;
  };

  const renameProfile = (profileId: string, newName: string) => {
    setProfilesData(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => (p.id === profileId ? { ...p, name: newName.trim() || p.name, updatedAt: Date.now() } : p))
    }));
  };

  const changeAvatar = (profileId: string, avatarId: string) => {
    setProfilesData(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => (p.id === profileId ? { ...p, avatar: avatarId, updatedAt: Date.now() } : p))
    }));
  };

  const syncActiveProfile = async () => syncProfileDirect(activeProfile);

  const pullCloudProfile = async (profileId: string): Promise<boolean> => {
    setCloudSyncStatus('syncing');
    const res = await fetchProfileFromCloud(profileId, dbConfig);
    if (res.ok && res.profile) {
      const cloudProfile = res.profile;
      setProfilesData(prev => {
        const exists = prev.profiles.some(p => p.id === cloudProfile.id);
        const next = exists
          ? prev.profiles.map(p => (p.id === cloudProfile.id ? cloudProfile : p))
          : [...prev.profiles, cloudProfile];
        return { profiles: next, activeId: cloudProfile.id };
      });
      setCloudSyncStatus('synced');
      return true;
    }
    setCloudSyncStatus('error');
    setLastSyncError(res.error || 'Failed to pull cloud profile');
    return false;
  };

  const pullAllCloudProfiles = async (): Promise<UserProfile[]> => {
    const res = await fetchCloudProfilesList(dbConfig);
    if (res.ok) {
      return res.profiles;
    }
    return [];
  };

  const deleteCloudProfileDoc = async (profileId: string): Promise<boolean> => {
    const res = await deleteProfileFromCloud(profileId, dbConfig);
    return res.ok;
  };

  return (
    <UserProfileContext.Provider
      value={{
        profiles,
        activeProfile,
        activeProfileId,
        cloudSyncStatus,
        lastSyncError,
        dbConfig,
        isProfileModalOpen,
        createProfile,
        switchProfile,
        updateActiveProfile,
        deleteProfile,
        renameProfile,
        changeAvatar,
        syncActiveProfile,
        pullCloudProfile,
        pullAllCloudProfiles,
        deleteCloudProfileDoc,
        setDbConfig,
        openProfileModal: () => setIsProfileModalOpen(true),
        closeProfileModal: () => setIsProfileModalOpen(false)
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) throw new Error('useUserProfile must be used within a UserProfileProvider');
  return context;
};
