import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axios.js';

/**
 * Fetches all of the authenticated student's enrollments in one request
 * and returns them grouped â€” no extra requests on tab switch.
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
};

export const useCourseById = (courseId) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourse = useCallback(async () => {
    if (!courseId) {
      setCourse(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/courses/${courseId}`);
      setCourse(res.data.data.course);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load course details.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  return { course, loading, error, refetch: fetchCourse };
};

export default useFetchCourses;
