import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axios.js';

const useFetchCourses = (filters = {}) => {
  const { search, category, level } = filters;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (level) params.set('level', level);
      const res = await apiClient.get(`/courses?${params.toString()}`);
      setCourses(res.data.data.courses || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [search, category, level]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, loading, error, refetch: fetchCourses };
};

export default useFetchCourses;
