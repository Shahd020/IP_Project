import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axios.js';

/**
 * Fetches everything CourseStudy.jsx needs for one course:
 *   - course metadata (title, instructor, ordered modules list)
 *   - the student's enrollment (for completedModules + progress)
 *   - the "current" module (first incomplete, or last if all done)
 *   - that module's quiz (questions only — correct answers stay server-side)
 *   - that module's recent forum posts
 *
 * Exposes:
 *   setCurrentModuleId  — jump to any module without a page reload
 *   submitQuiz          — grade answers server-side, update enrollment on pass
 *   addForumPost        — REST fallback when Socket.io is unavailable
 *   markModuleComplete  — call when a student finishes watching a video
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
          (e) => (e.course?._id || e.course) === courseId
        );

        setCourse(fetchedCourse);
        setEnrollment(myEnrollment || null);

        // Determine starting module: first incomplete, fallback to last
        const modules = fetchedCourse.modules || [];
        if (modules.length === 0) {
          setLoading(false);
          return;
        }

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
  const submitQuiz = useCallback(
    async (answers) => {
      const res = await apiClient.post(`/modules/${currentModuleId}/quiz/submit`, { answers });
      const result = res.data.data; // { score, total, percentage, passed }

      // Refresh enrollment so completedModules + progress are up to date
      if (result.passed) {
        try {
          const enrollRes = await apiClient.get('/enrollments/my');
          const updated = enrollRes.data.data.enrollments.find(
            (e) => (e.course?._id || e.course) === courseId
          );
          if (updated) setEnrollment(updated);
        } catch { /* non-critical */ }
      }

      return result;
    },
    [currentModuleId, courseId]
  );

  // ─── Mark module complete (called when video finishes) ────────────────────
  const markModuleComplete = useCallback(
    async (moduleId) => {
      if (!enrollment?._id || !moduleId) return;

      // Already completed — skip the API call
      const alreadyDone = enrollment.completedModules
        ?.map(String)
        .includes(String(moduleId));
      if (alreadyDone) return;

      try {
        const order = course?.modules?.find(
          (m) => String(m._id) === String(moduleId)
        )?.order;
        const progressText = order ? `Module ${order} complete` : 'In progress';

        const res = await apiClient.patch(`/enrollments/${enrollment._id}/progress`, {
          moduleId,
          progressText,
        });
        setEnrollment(res.data.data.enrollment);
      } catch (err) {
        console.warn('[useCourseStudy] markModuleComplete failed:', err.message);
      }
    },
    [enrollment, course]
  );

  // ─── Add a forum post via REST (fallback when Socket.io is unavailable) ────
  const addForumPost = useCallback(
    async (text) => {
      const res = await apiClient.post('/forum/posts', {
        courseId,
        moduleId: currentModuleId,
        text,
      });
      const newPost = res.data.data.post;
      setForumPosts((prev) => [newPost, ...prev]);
      return newPost;
    },
    [courseId, currentModuleId]
  );

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
    markModuleComplete,
    addForumPost,
  };
};

export default useCourseStudy;
