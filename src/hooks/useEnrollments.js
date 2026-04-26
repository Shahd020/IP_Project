import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axios.js';

const statusMap = { active: 'in-progress', completed: 'completed' };

const adaptEnrollment = (e) => ({
  id: e._id,
  courseId: e.course?._id,
  title: e.course?.title ?? 'Untitled',
  provider: e.course?.instructor?.name ?? 'Unknown Instructor',
  duration: e.course?.duration ?? '—',
  rating: e.course?.rating ? `${e.course.rating} ⭐` : '—',
  image: e.course?.thumbnail ?? null,
  progressPercent: e.progress ?? 0,
  progressText: e.progress === 100 ? 'Finished' : `${e.progress ?? 0}%`,
  status: statusMap[e.status] ?? 'in-progress',
  completedModules: e.completedModules ?? [],
  raw: e,
});

const useEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnrollments = useCallback(async () => {
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
  }, []);

  useEffect(() => { fetchEnrollments(); }, [fetchEnrollments]);

  const enroll = useCallback(async (courseId) => {
    const res = await apiClient.post('/enrollments', { courseId });
    await fetchEnrollments();
    return res.data.data.enrollment;
  }, [fetchEnrollments]);

  const completeModule = useCallback(async (enrollmentId, moduleId) => {
    try {
      const res = await apiClient.patch(`/enrollments/${enrollmentId}/complete-module`, { moduleId });
      setEnrollments((prev) =>
        prev.map((e) => (e.id === enrollmentId ? adaptEnrollment(res.data.data.enrollment) : e))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update progress');
    }
  }, []);

  return { enrollments, loading, error, enroll, completeModule, refetch: fetchEnrollments };
};

export default useEnrollments;
