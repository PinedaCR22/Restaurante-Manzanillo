// src/context/auth-context.ts
import { createContext } from 'react';
import type { User } from '../types/auth/identity';

export type RoleName = 'ADMIN' | 'EDITOR';

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: RoleName) => boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
