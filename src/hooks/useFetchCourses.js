import { useState, useEffect } from 'react';
import apiClient from '../api/axios.js';

/**
 * Fetches the public course catalog with optional filters.
 * Used by CourseCatalogPage.jsx
 */
const useFetchCourses = (filters = {}) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.level)    params.set('level', filters.level);
    if (filters.search)   params.set('search', filters.search);

    apiClient.get(`/courses?${params.toString()}`)
      .then((res) => { if (!cancelled) setCourses(res.data.data.courses); })
      .catch((err) => { if (!cancelled) setError(err.response?.data?.message || 'Failed to load courses'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.level, filters.search]);

  return { courses, loading, error };
};

/**
 * Fetches a single course by ID including its populated modules.
 * Used by CourseDetail.jsx and CourseCatalog.jsx
 */
export const useCourseById = (courseId) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    apiClient.get(`/courses/${courseId}`)
      .then((res) => { if (!cancelled) setCourse(res.data.data.course); })
      .catch((err) => { if (!cancelled) setError(err.response?.data?.message || 'Course not found'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [courseId]);

  return { course, loading, error };
};

export default useFetchCourses;
