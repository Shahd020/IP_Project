import React, { createContext, useState, useEffect, useCallback } from 'react';
import apiClient, { setAccessToken } from '../api/axios.js';

export const AuthContext = createContext(null);

/**
 * AuthProvider wraps the entire app and manages:
 *   - user profile (name, email, role)
 *   - access token (in React state — NEVER localStorage)
 *   - session restoration on page refresh via the HttpOnly refresh-token cookie
 *
 * Children read auth state via the useAuth() hook (src/hooks/useAuth.js).
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setToken] = useState(null);
  // `initialising` prevents a flash of "logged out" UI on page refresh
  const [initialising, setInitialising] = useState(true);

  const syncToken = useCallback((token) => {
    setToken(token);
    setAccessToken(token); // keep the axios module in sync
  }, []);

  // ─── Restore session on mount ──────────────────────────────────────────────
  useEffect(() => {
    const restore = async () => {
      try {
        // The refresh cookie is sent automatically (withCredentials: true)
        const refreshRes = await apiClient.post('/auth/refresh');
        const token = refreshRes.data.data.accessToken;
        syncToken(token);

        const meRes = await apiClient.get('/auth/me');
        setUser(meRes.data.data.user);
      } catch {
        // No valid session — user needs to log in
      } finally {
        setInitialising(false);
      }
    };
    restore();
  }, [syncToken]);

  // ─── Auth Actions ──────────────────────────────────────────────────────────

  const login = useCallback(async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    syncToken(res.data.data.accessToken);
    setUser(res.data.data.user);
    return res.data.data.user;
  }, [syncToken]);

  const register = useCallback(async (data) => {
    const res = await apiClient.post('/auth/register', data);
    syncToken(res.data.data.accessToken);
    setUser(res.data.data.user);
    return res.data.data.user;
  }, [syncToken]);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Swallow — we clear local state regardless
    }
    syncToken(null);
    setUser(null);
  }, [syncToken]);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, initialising, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
