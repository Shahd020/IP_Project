import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axios.js';

function useInstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/courses/instructor/my');
      setCourses(res.data.data.courses || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const deleteCourse = useCallback(async (courseId) => {
    await apiClient.delete(`/courses/${courseId}`);
    setCourses((prev) => prev.filter((c) => c._id !== courseId));
  }, []);

  return { courses, loading, error, refetch: fetchCourses, deleteCourse };
}

export default useInstructorCourses;
