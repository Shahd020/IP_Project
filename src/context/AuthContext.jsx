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
      {children}
    </AuthContext.Provider>
  );
}
