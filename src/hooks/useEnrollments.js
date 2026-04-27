import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axios.js';
import useAuth from './useAuth.js';

const adaptEnrollment = (e) => ({
  id: e._id,
  courseId: e.course?._id,
  title: e.course?.title ?? 'Untitled',
  description: e.course?.description ?? '',
  provider: e.course?.provider ?? e.course?.instructor?.name ?? 'Unknown Instructor',
  duration: e.course?.duration ?? '—',
  rating: e.course?.rating ?? null,
  image: e.course?.thumbnail ?? null,
  progressPercent: e.progressPercent ?? 0,
  progressText: e.progressPercent === 100 ? 'Finished' : `${e.progressPercent ?? 0}%`,
  status: e.status ?? 'saved',
  completedModules: e.completedModules ?? [],
  raw: e,
});

const useEnrollments = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnrollments = useCallback(async () => {
    if (!user) {
      setEnrollments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/enrollments/my');
      setEnrollments((res.data.data.enrollments || []).map(adaptEnrollment));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your courses');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchEnrollments(); }, [fetchEnrollments]);

  const enroll = useCallback(async (courseId) => {
    const res = await apiClient.post('/enrollments', { courseId });
    await fetchEnrollments();
    return res.data.data.enrollment;
  }, [fetchEnrollments]);

  const completeModule = useCallback(async (enrollmentId, moduleId) => {
    try {
      const res = await apiClient.patch(`/enrollments/${enrollmentId}/progress`, { moduleId });
      setEnrollments((prev) =>
        prev.map((e) => (e.id === enrollmentId ? adaptEnrollment(res.data.data.enrollment) : e))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update progress');
    }
  }, []);

  const startCourse = useCallback(async (enrollmentId) => {
    const res = await apiClient.patch(`/enrollments/${enrollmentId}/start`);
    await fetchEnrollments();
    return res.data.data.enrollment;
  }, [fetchEnrollments]);

  return { enrollments, loading, error, enroll, startCourse, completeModule, refetch: fetchEnrollments };
};

export default useEnrollments;
