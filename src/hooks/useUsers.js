import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axios.js';

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/users');
      setUsers(
        (res.data.data.users || []).map((u) => ({
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

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const addUser = useCallback(async (userData) => {
    setError(null);
    try {
      await apiClient.post('/auth/register', {
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

  const editUser = useCallback(async (userId, updates) => {
    setError(null);
    try {
      const res = await apiClient.patch(`/users/${userId}`, {
        ...updates,
        role: updates.role?.toLowerCase(),
      });
      const updated = res.data.data.user;
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, ...updated, id: updated._id, role: updated.role.charAt(0).toUpperCase() + updated.role.slice(1) }
            : u
        )
      );
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update user';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const removeUser = useCallback(async (userId) => {
    setError(null);
    try {
      await apiClient.delete(`/users/${userId}`);
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
