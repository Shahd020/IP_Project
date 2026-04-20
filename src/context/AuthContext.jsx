<<<<<<< HEAD
// src/context/AuthContext.jsx
// Global authentication state — wraps the entire app in main.jsx.
// Every component reads auth state via the useAuth() hook, not this file directly.
import React, { createContext, useState, useCallback } from 'react';
import api from '../api/axiosClient';
import { setToken } from '../api/tokenStore';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // user is persisted to sessionStorage so a page refresh doesn't log the user out.
  // sessionStorage is cleared when the tab closes — intentional security boundary.
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // ── Internal helper ─────────────────────────────────────────────────────────
  const _persistSession = (userData, accessToken) => {
    setToken(accessToken);
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  // ── register ────────────────────────────────────────────────────────────────
  const register = useCallback(async ({ name, email, password, role }) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role });
      _persistSession(data.user, data.accessToken);
      return data.user;
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.errors?.[0]?.msg
        || 'Registration failed';
      setAuthError(msg);
      throw new Error(msg);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // ── login ───────────────────────────────────────────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      _persistSession(data.user, data.accessToken);
      return data.user;
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials';
      setAuthError(msg);
      throw new Error(msg);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // ── logout ──────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout — clear local state regardless
    } finally {
      setToken(null);
      setUser(null);
      sessionStorage.removeItem('user');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, authLoading, authError, login, logout, register }}>
=======
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
>>>>>>> 56fac7aa34891492f68c36dd546ab7420c7673a1
      {children}
    </AuthContext.Provider>
  );
}
