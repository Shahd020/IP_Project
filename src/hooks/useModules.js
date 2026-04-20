import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosClient';

function useModules(courseId) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchModules = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/courses/${courseId}/modules`);
      setModules(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load modules');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => { fetchModules(); }, [fetchModules]);

  const addModule = useCallback(async (moduleData) => {
    const { data } = await api.post(`/courses/${courseId}/modules`, moduleData);
    setModules((prev) => [...prev, data]);
    return data;
  }, [courseId]);

  const removeModule = useCallback(async (moduleId) => {
    await api.delete(`/courses/${courseId}/modules/${moduleId}`);
    setModules((prev) => prev.filter((m) => m._id !== moduleId));
  }, [courseId]);

  return { modules, loading, error, addModule, removeModule, refetch: fetchModules };
}

export default useModules;
