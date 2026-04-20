// src/hooks/useUsers.js
// Admin user management — replaces all localStorage logic in ManageUsers.jsx.
// Provides CRUD operations that call the protected /api/users endpoints.
//
// Usage:
//   const { users, loading, error, addUser, editUser, removeUser } = useUsers();
import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosClient';

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/users');
      // Normalise role capitalisation for display (API stores lowercase)
      setUsers(
        data.map((u) => ({
          ...u,
          id: u._id,
          role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
        }))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /**
   * Registers a new user via POST /api/auth/register.
   * Admin creates users directly — they receive a temp password.
   *
   * @param {{ name: string, email: string, role: string }} userData
   */
  const addUser = useCallback(async (userData) => {
    setError(null);
    try {
      // Admin-created users get a default password they should change
      await api.post('/auth/register', {
        ...userData,
        role: userData.role.toLowerCase(),
        password: 'changeme123',
      });
      await fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.errors?.[0]?.msg
        || 'Failed to add user';
      setError(msg);
      throw new Error(msg);
    }
  }, [fetchUsers]);

  /**
   * Updates a user's name, email, or role via PATCH /api/users/:id.
   *
   * @param {string} userId
   * @param {{ name?: string, email?: string, role?: string }} updates
   */
  const editUser = useCallback(async (userId, updates) => {
    setError(null);
    try {
      const { data } = await api.patch(`/users/${userId}`, {
        ...updates,
        role: updates.role?.toLowerCase(),
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, ...data, id: data._id, role: data.role.charAt(0).toUpperCase() + data.role.slice(1) }
            : u
        )
      );
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update user';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  /**
   * Deletes a user via DELETE /api/users/:id.
   *
   * @param {string} userId
   */
  const removeUser = useCallback(async (userId) => {
    setError(null);
    try {
      await api.delete(`/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete user';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  return { users, loading, error, addUser, editUser, removeUser, refetch: fetchUsers };
};

export default useUsers;
