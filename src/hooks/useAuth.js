<<<<<<< HEAD
// src/hooks/useAuth.js
// Convenience hook — components import this instead of AuthContext directly.
// Usage:  const { user, login, logout, authLoading, authError } = useAuth();
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
=======
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

/**
 * Returns the auth context value: { user, accessToken, initialising, login, register, logout }
 * Must be used inside an <AuthProvider> tree.
 */
const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
>>>>>>> 56fac7aa34891492f68c36dd546ab7420c7673a1
};

export default useAuth;
