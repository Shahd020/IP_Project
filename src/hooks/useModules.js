import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axios.js';

function useModules(courseId) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchModules = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get(`/courses/${courseId}/modules`);
      setModules(res.data.data.modules || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load modules');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => { fetchModules(); }, [fetchModules]);

  const addModule = useCallback(async (moduleData) => {
    const res = await apiClient.post(`/courses/${courseId}/modules`, moduleData);
    const mod = res.data.data.module;
    setModules((prev) => [...prev, mod]);
    return mod;
  }, [courseId]);

  const removeModule = useCallback(async (moduleId) => {
    await apiClient.delete(`/courses/${courseId}/modules/${moduleId}`);
    setModules((prev) => prev.filter((m) => m._id !== moduleId));
  }, [courseId]);

  return { modules, loading, error, addModule, removeModule, refetch: fetchModules };
}

export default useModules;
