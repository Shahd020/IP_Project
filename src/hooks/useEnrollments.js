// src/hooks/useEnrollments.js
// Manages the logged-in student's enrollment list.
// Replaces the 19-item hardcoded courses array in StudentCourses.jsx.
//
// Usage:
//   const { enrollments, loading, error, completeModule } = useEnrollments();
import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosClient';

// ── Shape adapter ─────────────────────────────────────────────────────────────
// Maps the API enrollment document to the shape StudentCourses.jsx already
// expects, so the component template needs minimal changes.
const adaptEnrollment = (enrollment) => {
  const { course, progress, status, _id } = enrollment;

  // Map API status → tab key used in the component
  const statusMap = { active: 'in-progress', completed: 'completed' };

  return {
    id: _id,                                       // enrollment ID for API calls
    courseId: course?._id,                         // for navigation links
    title: course?.title ?? 'Untitled Course',
    provider: course?.instructor?.name ?? 'Unknown Instructor',
    duration: course?.duration ?? '—',
    rating: course?.rating ? `${course.rating} ⭐` : '—',
    image: course?.thumbnail ?? null,              // null triggers placeholder in UI
    progressPercent: progress ?? 0,
    progressText: progress === 100 ? 'Finished' : `${progress ?? 0}%`,
    status: statusMap[status] ?? 'in-progress',
    category: course?.category,
    level: course?.level,
  };
};

const useEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/enrollments/my');
      setEnrollments(data.map(adaptEnrollment));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  /**
   * Marks a module complete and updates the local progress bar immediately
   * (optimistic update) before the server confirms.
   *
   * @param {string} enrollmentId
   * @param {string} moduleId
   */
  const completeModule = useCallback(async (enrollmentId, moduleId) => {
    try {
      const { data } = await api.patch(`/enrollments/${enrollmentId}/complete-module`, {
        moduleId,
      });
      // Refresh from server so progress is always accurate
      setEnrollments((prev) =>
        prev.map((e) => (e.id === enrollmentId ? adaptEnrollment(data) : e))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update progress');
    }
  }, []);

  /**
   * Enrolls the current student in a course and refreshes the list.
   *
   * @param {string} courseId
   */
  const enroll = useCallback(async (courseId) => {
    try {
      await api.post('/enrollments', { courseId });
      await fetchEnrollments(); // refresh to show the new enrollment
    } catch (err) {
      const msg = err.response?.data?.message || 'Enrollment failed';
      setError(msg);
      throw new Error(msg);
    }
  }, [fetchEnrollments]);

  return { enrollments, loading, error, completeModule, enroll, refetch: fetchEnrollments };
};

export default useEnrollments;
