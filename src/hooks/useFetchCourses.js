import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axios.js';

const useFetchCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/enrollments/my');
      setEnrollments(res.data.data.enrollments);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  return { enrollments, loading, error, refetch: fetchEnrollments };
};

export default useFetchCourses;