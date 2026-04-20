import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosClient';

function useInstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/courses/instructor/my');
      setCourses(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const deleteCourse = useCallback(async (courseId) => {
    await api.delete(`/courses/${courseId}`);
    setCourses((prev) => prev.filter((c) => c._id !== courseId));
  }, []);

  return { courses, loading, error, refetch: fetchCourses, deleteCourse };
}

export default useInstructorCourses;
