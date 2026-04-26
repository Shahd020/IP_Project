import React, { createContext, useState, useEffect, useCallback } from 'react';
import apiClient, { setAccessToken } from '../api/axios.js';

export const AuthContext = createContext(null);

/**
 * AuthProvider wraps the entire app and manages:
 *   - user profile (name, email, role)
 *   - access token (in React state — NEVER localStorage)
 *   - session restoration on page refresh via the HttpOnly refresh-token cookie
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setToken] = useState(null);
  const [initialising, setInitialising] = useState(true);

  const syncToken = useCallback((token) => {
    setToken(token);
    setAccessToken(token);
  }, []);

  useEffect(() => {
    const restore = async () => {
      try {
        const refreshRes = await apiClient.post('/auth/refresh');
        const token = refreshRes.data.data.accessToken;
        syncToken(token);

        const meRes = await apiClient.get('/auth/me');
        setUser(meRes.data.data.user);
      } catch {
        // no session
      } finally {
        setInitialising(false);
      }
    };
    restore();
  }, [syncToken]);

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
    } catch {}
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