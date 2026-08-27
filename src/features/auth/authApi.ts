import { CloudAccountDoc, AuthResult, AuthCredentials } from './authTypes';
import { hashPassword, generateSalt, normalizeUsername } from './authCrypto';
import { UserProfile } from '../user-profiles/types';
import { DEFAULT_GCP_DB_CONFIG } from '../user-profiles/defaultProfiles';

const COLLECTION = 'coral_fish_accounts';
const TIMEOUT_MS = 8000;

const createFetchOptions = (method: string = 'GET', body?: any): RequestInit => {
  const headers: Record<string, string> = {
    'x-api-key': DEFAULT_GCP_DB_CONFIG.apiKey,
    'Accept': 'application/json'
  };
  if (body) headers['Content-Type'] = 'application/json';

  return {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  };
};

const fetchWithTimeout = async (url: string, options: RequestInit): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

const getAccountDocUrl = (username: string): string => {
  const clean = normalizeUsername(username);
  return `${DEFAULT_GCP_DB_CONFIG.baseUrl}/${COLLECTION}/account_${clean}`;
};

export const checkAccountExists = async (username: string): Promise<boolean> => {
  try {
    const url = getAccountDocUrl(username);
    const res = await fetchWithTimeout(url, createFetchOptions('GET'));
    return res.ok;
  } catch {
    return false;
  }
};

export const registerAccount = async (
  creds: AuthCredentials,
  initialProfiles: UserProfile[],
  activeProfileId: string
): Promise<AuthResult> => {
  const cleanUsername = normalizeUsername(creds.username);
  if (cleanUsername.length < 3) {
    return { ok: false, error: 'Username must be at least 3 alphanumeric characters' };
  }
  if (creds.password.length < 6) {
    return { ok: false, error: 'Password must be at least 6 characters long' };
  }

  try {
    const exists = await checkAccountExists(cleanUsername);
    if (exists) {
      return { ok: false, error: 'Username is already taken. Please choose another or log in.' };
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(creds.password, salt);
    const now = Date.now();

    const accountDoc: CloudAccountDoc = {
      username: cleanUsername,
      passwordHash,
      salt,
      createdAt: now,
      updatedAt: now,
      profiles: initialProfiles,
      activeProfileId
    };

    const url = getAccountDocUrl(cleanUsername);
    const res = await fetchWithTimeout(url, createFetchOptions('POST', accountDoc));

    if (res.ok) {
      return { ok: true, account: accountDoc };
    }
    return { ok: false, error: `Registration failed (HTTP ${res.status})` };
  } catch (err: any) {
    return { ok: false, error: err.message || 'Network error during registration' };
  }
};

export const loginAccount = async (creds: AuthCredentials): Promise<AuthResult> => {
  const cleanUsername = normalizeUsername(creds.username);
  if (!cleanUsername || !creds.password) {
    return { ok: false, error: 'Please enter both username and password' };
  }

  try {
    const url = getAccountDocUrl(cleanUsername);
    const res = await fetchWithTimeout(url, createFetchOptions('GET'));

    if (!res.ok) {
      return { ok: false, error: 'Account not found. Please check your username or register.' };
    }

    const doc = await res.json();
    const accountDoc: CloudAccountDoc = doc.data;

    if (!accountDoc || !accountDoc.passwordHash || !accountDoc.salt) {
      return { ok: false, error: 'Corrupted account data on server' };
    }

    const computedHash = await hashPassword(creds.password, accountDoc.salt);
    if (computedHash !== accountDoc.passwordHash) {
      return { ok: false, error: 'Incorrect password. Please try again.' };
    }

    return { ok: true, account: accountDoc };
  } catch (err: any) {
    return { ok: false, error: err.message || 'Network error during login' };
  }
};

export const saveAccountCloudProfiles = async (
  account: CloudAccountDoc,
  profiles: UserProfile[],
  activeProfileId: string
): Promise<boolean> => {
  try {
    const now = Date.now();
    const updatedDoc: CloudAccountDoc = {
      ...account,
      updatedAt: now,
      profiles,
      activeProfileId
    };

    const url = getAccountDocUrl(account.username);
    const res = await fetchWithTimeout(url, createFetchOptions('POST', updatedDoc));
    return res.ok;
  } catch {
    return false;
  }
};
