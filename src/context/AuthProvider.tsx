// src/context/AuthProvider.tsx
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '../types/auth/identity';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  setUser as setUserStorage,
  getUser as getUserStorage,
  clearSession,
} from '../lib/session';
import {
  login as loginApi,
  me as meApi,
  logout as logoutApi,
} from '../services/auth/auth.service';
import { AuthContext, type RoleName } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getUserStorage<User>());
  const [loading, setLoading] = useState<boolean>(true);

  // Carga inicial: si hay accessToken, traer /auth/me
  useEffect(() => {
    let mounted = true;

    async function boot() {
      try {
        const token = getAccessToken();
        if (!token) return;

        const u = await meApi();
        if (!mounted) return;
        setUser(u);
        setUserStorage(u);
      } catch {
        clearSession();
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    boot();
    return () => {
      mounted = false;
    };
  }, []);

  // login
  const login = useCallback(async (email: string, password: string) => {
    const res = await loginApi({ email, password });
    setAccessToken(res.accessToken);
    setRefreshToken(res.refreshToken);
    setUser(res.user);
    setUserStorage(res.user);
  }, []);

  // logout
  const logout = useCallback(async () => {
    try {
      const rt = getRefreshToken();
      if (rt) {
        await logoutApi(rt);
      }
    } catch {
      // ignorar errores de red aquí
    } finally {
      clearSession();
      setUser(null);
    }
  }, []);

  const hasRole = useCallback(
    (role: RoleName) => user?.role?.name === role,
    [user],
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout,
      hasRole,
    }),
    [user, loading, login, logout, hasRole],
  );

  // Si no hay token, terminar loading rápido
  useEffect(() => {
    if (!getAccessToken() && loading) {
      setLoading(false);
    }
  }, [loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
