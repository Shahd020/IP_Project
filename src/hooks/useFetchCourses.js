<<<<<<< HEAD
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
=======
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axios.js';

/**
 * Fetches all of the authenticated student's enrollments in one request
 * and returns them grouped — no extra requests on tab switch.
 *
 * Returned enrollment shape (already matches the StudentCourses UI):
 *   { _id, status, progressPercent, progressText,
 *     course: { _id, title, provider, duration, rating, thumbnail } }
 *
 * @returns {{ enrollments: object[], loading: boolean, error: string|null, refetch: Function }}
 */
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
      setError(err.response?.data?.message || 'Failed to load your courses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  return { enrollments, loading, error, refetch: fetchEnrollments };
>>>>>>> 56fac7aa34891492f68c36dd546ab7420c7673a1
};

export default useFetchCourses;
