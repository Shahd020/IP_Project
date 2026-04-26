
﻿import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

/**
 * Returns the auth context value: { user, accessToken, initialising, login, register, logout }
 * Must be used inside an <AuthProvider> tree.
 */
const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export default useAuth;
