import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CloudAccountDoc, AccountSession, AuthCredentials } from './authTypes';
import { loginAccount, registerAccount, saveAccountCloudProfiles } from './authApi';
import { UserProfile } from '../user-profiles/types';

const LOCAL_STORAGE_KEY_SESSION = 'coral_fish_auth_session_v1';
const LOCAL_STORAGE_KEY_ACCOUNT = 'coral_fish_auth_account_v1';

interface AuthContextType {
  account: CloudAccountDoc | null;
  session: AccountSession | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openLoginModal: () => void;
  openRegisterModal: () => void;
  closeAuthModal: () => void;
  login: (creds: AuthCredentials) => Promise<{ ok: boolean; error?: string; profiles?: UserProfile[]; activeId?: string }>;
  register: (creds: AuthCredentials, currentProfiles: UserProfile[], activeId: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  syncAccountData: (profiles: UserProfile[], activeId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<CloudAccountDoc | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ACCOUNT);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [session, setSession] = useState<AccountSession | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SESSION);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (account) {
      localStorage.setItem(LOCAL_STORAGE_KEY_ACCOUNT, JSON.stringify(account));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_ACCOUNT);
    }
  }, [account]);

  useEffect(() => {
    if (session) {
      localStorage.setItem(LOCAL_STORAGE_KEY_SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_SESSION);
    }
  }, [session]);

  const openLoginModal = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = async (creds: AuthCredentials) => {
    const result = await loginAccount(creds);
    if (result.ok && result.account) {
      const acc = result.account;
      setAccount(acc);
      const newSession: AccountSession = {
        username: acc.username,
        token: acc.passwordHash.substring(0, 16),
        loggedInAt: Date.now()
      };
      setSession(newSession);
      setIsAuthModalOpen(false);
      return {
        ok: true,
        profiles: acc.profiles || [],
        activeId: acc.activeProfileId
      };
    }
    return { ok: false, error: result.error || 'Login failed' };
  };

  const register = async (creds: AuthCredentials, currentProfiles: UserProfile[], activeId: string) => {
    const result = await registerAccount(creds, currentProfiles, activeId);
    if (result.ok && result.account) {
      const acc = result.account;
      setAccount(acc);
      const newSession: AccountSession = {
        username: acc.username,
        token: acc.passwordHash.substring(0, 16),
        loggedInAt: Date.now()
      };
      setSession(newSession);
      setIsAuthModalOpen(false);
      return { ok: true };
    }
    return { ok: false, error: result.error || 'Registration failed' };
  };

  const logout = () => {
    setAccount(null);
    setSession(null);
  };

  const syncAccountData = useCallback(async (profiles: UserProfile[], activeId: string): Promise<boolean> => {
    if (!account) return false;
    const ok = await saveAccountCloudProfiles(account, profiles, activeId);
    if (ok) {
      setAccount(prev => prev ? { ...prev, profiles, activeProfileId: activeId, updatedAt: Date.now() } : null);
    }
    return ok;
  }, [account]);

  return (
    <AuthContext.Provider
      value={{
        account,
        session,
        isAuthenticated: !!session && !!account,
        isAuthModalOpen,
        authModalMode,
        openLoginModal,
        openRegisterModal,
        closeAuthModal,
        login,
        register,
        logout,
        syncAccountData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
