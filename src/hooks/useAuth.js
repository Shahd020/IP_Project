<<<<<<< HEAD
﻿import { useContext } from 'react';
=======
<<<<<<< HEAD
import { useContext } from 'react';
=======
﻿import { useContext } from 'react';
>>>>>>> 9e18abd (phase 2 test lilly)
>>>>>>> e924226 (phase 2 lilly testing)
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
