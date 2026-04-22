import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axios.js';

/**
 * Fetches everything CourseStudy.jsx needs for one course:
 *   - course metadata (title, instructor name, modules list)
 *   - the "current" module (first incomplete, or last if all done)
 *   - that module's quiz (questions only — correct answers stay server-side)
 *   - that module's recent forum posts
 *
 * Exposes setCurrentModuleId so the component can let the student
 * jump to any module in the sidebar without a full page reload.
 *
 * @param {string} courseId  MongoDB ObjectId from URL params
 */
const useCourseStudy = (courseId) => {
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentModule, setCurrentModuleState] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [forumPosts, setForumPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── Step 1: Load course (with ordered modules) + enrollment ──────────────
  useEffect(() => {
    if (!courseId) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [courseRes, enrollRes] = await Promise.all([
          apiClient.get(`/courses/${courseId}`),
          apiClient.get('/enrollments/my'),
        ]);

        const fetchedCourse = courseRes.data.data.course;
        const myEnrollments = enrollRes.data.data.enrollments;
        const myEnrollment = myEnrollments.find(
          (e) => e.course._id === courseId || e.course === courseId
        );

        setCourse(fetchedCourse);
        setEnrollment(myEnrollment || null);

        // Determine which module to show first
        const modules = fetchedCourse.modules || [];
        if (modules.length === 0) return;

        const completedIds = myEnrollment?.completedModules?.map(String) || [];
        const firstIncomplete = modules.find((m) => !completedIds.includes(String(m._id)));
        const target = firstIncomplete || modules[modules.length - 1];
        setCurrentModuleId(target._id);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load course. Please try again.');
        setLoading(false);
      }
    };

    load();
  }, [courseId]);

  // ─── Step 2: Load module details whenever currentModuleId changes ──────────
  useEffect(() => {
    if (!currentModuleId) return;

    const loadModule = async () => {
      try {
        const res = await apiClient.get(`/modules/${currentModuleId}/details`);
        const { module, quiz: moduleQuiz, forumPosts: posts } = res.data.data;
        setCurrentModuleState(module);
        setQuiz(moduleQuiz);
        setForumPosts(posts || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load module.');
      } finally {
        setLoading(false);
      }
    };

    loadModule();
  }, [currentModuleId]);

  // ─── Submit Quiz ───────────────────────────────────────────────────────────
  const submitQuiz = useCallback(async (answers) => {
    const res = await apiClient.post(`/modules/${currentModuleId}/quiz/submit`, { answers });
    return res.data.data; // { score, total, percentage, passed }
  }, [currentModuleId]);

  // ─── Mark module complete ──────────────────────────────────────────────────
  const completeModule = useCallback(async (moduleId) => {
    if (!enrollment?._id) return;
    try {
      const res = await apiClient.patch(`/enrollments/${enrollment._id}/complete-module`, { moduleId });
      setEnrollment(res.data.data.enrollment);
    } catch {
      // Non-critical — progress syncs on next load
    }
  }, [enrollment]);

  // ─── Add a forum post via REST (fallback when Socket.io is unavailable) ────
  const addForumPost = useCallback(async (text) => {
    const res = await apiClient.post('/forum/posts', {
      courseId,
      moduleId: currentModuleId,
      text,
    });
    const newPost = res.data.data.post;
    setForumPosts((prev) => [newPost, ...prev]);
    return newPost;
  }, [courseId, currentModuleId]);

  return {
    course,
    enrollment,
    currentModule,
    setCurrentModuleId,
    quiz,
    forumPosts,
    setForumPosts,
    loading,
    error,
    submitQuiz,
    completeModule,
    addForumPost,
  };
};

export default useCourseStudy;
