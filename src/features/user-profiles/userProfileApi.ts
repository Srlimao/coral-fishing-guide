import { CloudDbDoc, CloudDbListResponse, GcpDbConfig, UserProfile } from './types';
import { DEFAULT_GCP_DB_CONFIG } from './defaultProfiles';

const TIMEOUT_MS = 8000;

const createFetchOptions = (apiKey: string, method: string = 'GET', body?: any): RequestInit => {
  const headers: Record<string, string> = {
    'x-api-key': apiKey,
    'Accept': 'application/json'
  };

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

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
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const checkDbHealth = async (
  config: GcpDbConfig = DEFAULT_GCP_DB_CONFIG
): Promise<{ ok: boolean; latencyMs: number; status?: string; error?: string }> => {
  const start = performance.now();
  try {
    const healthUrl = config.baseUrl.replace(/\/api\/?$/, '') + '/health';
    const res = await fetchWithTimeout(healthUrl, { method: 'GET' });
    const latencyMs = Math.round(performance.now() - start);

    if (res.ok) {
      const data = await res.json();
      return { ok: true, latencyMs, status: data.status || 'ok' };
    }
    return { ok: false, latencyMs, error: `HTTP ${res.status}: ${res.statusText}` };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - start);
    return { ok: false, latencyMs, error: err.message || 'Connection failed' };
  }
};

export const uploadProfileToCloud = async (
  profile: UserProfile,
  config: GcpDbConfig = DEFAULT_GCP_DB_CONFIG
): Promise<{ ok: boolean; error?: string }> => {
  try {
    const url = `${config.baseUrl}/${config.collection}/${profile.id}`;
    const payload = {
      ...profile,
      updatedAt: Date.now(),
      lastCloudSync: Date.now()
    };

    const res = await fetchWithTimeout(url, createFetchOptions(config.apiKey, 'POST', payload));
    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      return { ok: false, error: `Upload failed (HTTP ${res.status}): ${errorText}` };
    }
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message || 'Network error during profile upload' };
  }
};

export const fetchProfileFromCloud = async (
  profileId: string,
  config: GcpDbConfig = DEFAULT_GCP_DB_CONFIG
): Promise<{ ok: boolean; profile?: UserProfile; error?: string }> => {
  try {
    const url = `${config.baseUrl}/${config.collection}/${profileId}`;
    const res = await fetchWithTimeout(url, createFetchOptions(config.apiKey, 'GET'));

    if (!res.ok) {
      return { ok: false, error: `Profile not found (HTTP ${res.status})` };
    }

    const doc: CloudDbDoc<UserProfile> = await res.json();
    if (doc && doc.data) {
      return { ok: true, profile: doc.data };
    }
    return { ok: false, error: 'Malformed document returned from DB' };
  } catch (err: any) {
    return { ok: false, error: err.message || 'Network error during profile fetch' };
  }
};

export const fetchCloudProfilesList = async (
  config: GcpDbConfig = DEFAULT_GCP_DB_CONFIG
): Promise<{ ok: boolean; profiles: UserProfile[]; error?: string }> => {
  try {
    const url = `${config.baseUrl}/${config.collection}?limit=50&offset=0`;
    const res = await fetchWithTimeout(url, createFetchOptions(config.apiKey, 'GET'));

    if (!res.ok) {
      return { ok: false, profiles: [], error: `Failed to list cloud profiles (HTTP ${res.status})` };
    }

    const data: CloudDbListResponse<UserProfile> = await res.json();
    const profiles = (data.results || []).map(r => r.data).filter(p => !!p && !!p.id && !!p.name);
    return { ok: true, profiles };
  } catch (err: any) {
    return { ok: false, profiles: [], error: err.message || 'Network error during cloud profiles list' };
  }
};

export const deleteProfileFromCloud = async (
  profileId: string,
  config: GcpDbConfig = DEFAULT_GCP_DB_CONFIG
): Promise<{ ok: boolean; error?: string }> => {
  try {
    const url = `${config.baseUrl}/${config.collection}/${profileId}`;
    const res = await fetchWithTimeout(url, createFetchOptions(config.apiKey, 'DELETE'));

    if (!res.ok) {
      return { ok: false, error: `Delete failed (HTTP ${res.status})` };
    }
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message || 'Network error during profile deletion' };
  }
};
