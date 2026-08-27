import { UserProfile } from './types';
import { UserProgress, Season } from '../../types/fishing';

export interface SharedProgressionPayload {
  v: number; // Schema version
  hostName: string;
  avatar: string;
  timestamp: number;
  season?: Season;
  day?: number;
  fishingLevel?: number;
  caught: string[]; // List of fish IDs caught
  donatedMuseum: string[]; // List of fish IDs donated
  offeredTemple: string[]; // List of fish IDs offered
}

/**
 * Encodes a user profile's progress into a compact, URL-safe Base64 token
 */
export const encodeProgressionToken = (profile: UserProfile): string => {
  const caught = Object.entries(profile.userProgress?.caught || {})
    .filter(([_, isCaught]) => Boolean(isCaught))
    .map(([id]) => id);

  const donatedMuseum = Object.entries(profile.userProgress?.donatedMuseum || {})
    .filter(([_, isDonated]) => Boolean(isDonated))
    .map(([id]) => id);

  const offeredTemple = Object.entries(profile.userProgress?.offeredTemple || {})
    .filter(([_, isOffered]) => Boolean(isOffered))
    .map(([id]) => id);

  const payload: SharedProgressionPayload = {
    v: 1,
    hostName: profile.name || 'Host Farmer',
    avatar: profile.avatar || 'fisherman',
    timestamp: Date.now(),
    season: profile.gameState?.season,
    day: profile.gameState?.day,
    fishingLevel: profile.gameState?.fishingLevel || 1,
    caught,
    donatedMuseum,
    offeredTemple
  };

  try {
    const jsonString = JSON.stringify(payload);
    // Encode to UTF-8 safe Base64
    const utf8Bytes = new TextEncoder().encode(jsonString);
    let binary = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    const base64 = btoa(binary);
    // Make URL safe
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (err) {
    console.error('Failed to encode progression token', err);
    return '';
  }
};

/**
 * Decodes a raw Base64 token or full share URL into a SharedProgressionPayload
 */
export const decodeProgressionToken = (input: string): SharedProgressionPayload | null => {
  if (!input || typeof input !== 'string') return null;

  let token = input.trim();

  // Extract from full URL if pasted
  if (token.includes('?share=')) {
    token = token.split('?share=')[1].split('&')[0].split('#')[0];
  } else if (token.includes('#share=')) {
    token = token.split('#share=')[1].split('&')[0];
  }

  // Restore base64 characters
  let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }

  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonString = new TextDecoder().decode(bytes);
    const parsed: SharedProgressionPayload = JSON.parse(jsonString);

    if (parsed && parsed.v && Array.isArray(parsed.caught)) {
      return parsed;
    }
    return null;
  } catch (err) {
    console.warn('Failed to decode progression token', err);
    return null;
  }
};

/**
 * Generates a full 1-click share URL for the current host
 */
export const generateShareUrl = (token: string): string => {
  if (typeof window === 'undefined') return `?share=${token}`;
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  return `${origin}${pathname}?share=${token}`;
};

/**
 * Merges incoming shared progress with current progress non-destructively
 */
export const mergeSharedProgress = (
  current: UserProgress,
  incoming: SharedProgressionPayload
): UserProgress => {
  const nextCaught = { ...current.caught };
  const nextDonated = { ...current.donatedMuseum };
  const nextOffered = { ...current.offeredTemple };

  (incoming.caught || []).forEach(id => {
    nextCaught[id] = true;
  });

  (incoming.donatedMuseum || []).forEach(id => {
    nextDonated[id] = true;
  });

  (incoming.offeredTemple || []).forEach(id => {
    nextOffered[id] = true;
  });

  return {
    caught: nextCaught,
    donatedMuseum: nextDonated,
    offeredTemple: nextOffered,
    customNotes: current.customNotes || {}
  };
};

/**
 * Converts a SharedProgressionPayload into a full UserProgress object
 */
export const payloadToUserProgress = (payload: SharedProgressionPayload): UserProgress => {
  const caught: Record<string, boolean> = {};
  const donatedMuseum: Record<string, boolean> = {};
  const offeredTemple: Record<string, boolean> = {};

  (payload.caught || []).forEach(id => {
    caught[id] = true;
  });

  (payload.donatedMuseum || []).forEach(id => {
    donatedMuseum[id] = true;
  });

  (payload.offeredTemple || []).forEach(id => {
    offeredTemple[id] = true;
  });

  return { caught, donatedMuseum, offeredTemple, customNotes: {} };
};
