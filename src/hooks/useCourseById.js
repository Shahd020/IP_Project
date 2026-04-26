import { useState, useEffect } from 'react';
import apiClient from '../api/axios.js';

const useCourseById = (courseId) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiClient
      .get(`/courses/${courseId}`)
      .then((res) => {
        if (!cancelled) setCourse(res.data.data.course);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || 'Course not found');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  return { course, loading, error };
};

export default useCourseById;
