// src/hooks/useFetchCourses.js
// Fetches the public course catalog with optional filters.
// Replaces the hardcoded catalogData object in CourseCatalog.jsx
// and the static categories array in Categories.jsx.
//
// Usage:
//   const { courses, loading, error } = useFetchCourses({ category: 'Technology' });
//   const { course, loading, error } = useCourseById(courseId);
import { useState, useEffect } from 'react';
import api from '../api/axiosClient';

/**
 * Fetches the published course catalog.
 * Re-fetches automatically when filters change.
 *
 * @param {{ category?: string, level?: string, search?: string }} filters
 */
const useFetchCourses = (filters = {}) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false; // prevents setState on unmounted component

    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get('/courses', { params: filters });
        if (!cancelled) setCourses(data);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Failed to load courses');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCourses();
    return () => { cancelled = true; };
  }, [filters.category, filters.level, filters.search]); // eslint-disable-line

  return { courses, loading, error };
};

/**
 * Fetches a single course by ID with full module details.
 * Used on the course detail / overview page.
 *
 * @param {string|null} courseId
 */
export const useCourseById = (courseId) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/courses/${courseId}`);
        if (!cancelled) setCourse(data);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Course not found');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [courseId]);

  return { course, loading, error };
};

export default useFetchCourses;
