import { UserProfile } from '../user-profiles/types';

export interface CloudAccountDoc {
  username: string;
  passwordHash: string; // SHA-256 hex string
  salt: string;
  createdAt: number;
  updatedAt: number;
  profiles: UserProfile[];
  activeProfileId: string;
}

export interface AccountSession {
  username: string;
  token: string; // Session token / auth hash
  loggedInAt: number;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthResult {
  ok: boolean;
  error?: string;
  account?: CloudAccountDoc;
}
