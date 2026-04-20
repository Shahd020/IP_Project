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
};

export default useAuth;
