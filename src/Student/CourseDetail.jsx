import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, PlayCircle, CheckCircle, Clock, Star, Award } from "lucide-react";
import apiClient from "../api/axios.js";

function CourseDetail() {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [courseRes, enrollRes] = await Promise.all([
          apiClient.get(`/courses/${courseId}`),
          apiClient.get("/enrollments/my").catch(() => ({ data: { data: { enrollments: [] } } })),
        ]);

        const fetchedCourse = courseRes.data.data.course;
        const myEnrollments = enrollRes.data.data.enrollments || [];
        const myEnrollment = myEnrollments.find(
          (e) => (e.course?._id || e.course) === courseId
        );

        setCourse(fetchedCourse);
        setEnrollment(myEnrollment || null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [courseId]);

  const handleBack = () => {
    const returnTo = location.state?.from;
    if (typeof returnTo === "string" && returnTo.length > 0) {
      navigate(returnTo);
      return;
    }
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    const fallback = location.pathname.startsWith("/instructor")
      ? "/instructor/courses"
      : "/student/courses";
    navigate(fallback, { replace: true });
  };

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto pb-12">
        <div className="animate-pulse space-y-6 pt-6">
          <div className="h-8 bg-gray-800 rounded w-1/3"></div>
          <div className="h-48 bg-gray-800 rounded-xl"></div>
          <div className="h-32 bg-gray-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-6xl mx-auto pb-12 pt-6">
        <div className="bg-red-900/20 rounded-xl border border-red-700 p-8 text-center">
          <p className="text-red-400 text-lg">{error || "Course not found."}</p>
          <button
            onClick={handleBack}
            className="mt-4 text-blue-400 hover:text-blue-300 underline text-sm"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const modules = course.modules || [];
  const completedIds = enrollment?.completedModules?.map(String) || [];
  const progress = enrollment?.progressPercent ?? 0;

  return (
    <div className="max-w-6xl mx-auto pb-12">

      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-400">
        <button
          type="button"
          onClick={handleBack}
          className="hover:text-blue-400 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Courses
        </button>
        <span>/</span>
        <span className="text-gray-200 truncate max-w-xs">{course.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Left column: info + syllabus ──────────────────────────────── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                {course.provider}
              </span>
              {course.rating >= 4.5 && (
                <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1 uppercase">
                  <Star size={12} fill="currentColor" /> Bestseller
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              {course.rating > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400" size={18} fill="currentColor" />
                  <span className="text-white font-bold">{course.rating}</span>
                  {course.ratingCount > 0 && <span>({course.ratingCount.toLocaleString()} reviews)</span>}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{course.duration}</span>
              </div>
              {course.instructor?.name && (
                <div className="flex items-center gap-2">
                  <Award size={18} />
                  <span>By <span className="text-white font-medium">{course.instructor.name}</span></span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-3">About this course</h2>
            <p className="text-gray-300 leading-relaxed text-sm">{course.description}</p>
          </div>

          {/* Syllabus */}
          {modules.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Course Content
                <span className="text-sm font-normal text-gray-400 ml-3">
                  {modules.length} module{modules.length !== 1 ? "s" : ""}
                </span>
              </h2>
              <div className="bg-[#1f2937] rounded-xl border border-gray-800 overflow-hidden">
                {modules.map((mod) => {
                  const done = completedIds.includes(String(mod._id));
                  const isCurrent =
                    !done &&
                    modules.find(
                      (m) => !completedIds.includes(String(m._id))
                    )?._id === mod._id;
                  return (
                    <div
                      key={mod._id}
                      className={`flex items-center justify-between p-4 border-b border-gray-800 last:border-0 transition-colors ${
                        isCurrent ? "bg-blue-900/10" : "hover:bg-[#374151]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {done ? (
                          <CheckCircle className="text-green-400 shrink-0" size={20} />
                        ) : isCurrent ? (
                          <PlayCircle className="text-blue-400 shrink-0" size={20} />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-600 shrink-0" />
                        )}
                        <span className={`font-semibold ${isCurrent ? "text-blue-400" : "text-gray-200"}`}>
                          {mod.title}
                        </span>
                      </div>
                      {mod.videoDurationSeconds > 0 && (
                        <span className="text-sm text-gray-500 flex items-center gap-1 shrink-0">
                          <Clock size={14} />
                          {Math.ceil(mod.videoDurationSeconds / 60)} min
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Right column: sticky progress card ────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="bg-[#1f2937] rounded-xl border border-gray-800 shadow-xl overflow-hidden sticky top-8 flex flex-col">

            {/* Thumbnail */}
            <div className="relative w-full h-48 bg-gray-900 overflow-hidden flex items-center justify-center">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-80"
                />
              ) : (
                <PlayCircle size={60} className="text-gray-600" />
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <PlayCircle size={56} className="text-white drop-shadow-lg" />
              </div>
              <span className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded font-semibold">
                Preview Course
              </span>
            </div>

            <div className="p-6 flex flex-col gap-6">

              {/* Progress bar */}
              {enrollment && (
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-300 font-semibold text-sm">Your Progress</span>
                    <span className="text-white font-bold text-lg">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-2 text-center">
                    {enrollment.progressText || "In progress"}
                  </p>
                </div>
              )}

              {/* CTA */}
              {enrollment ? (
                <Link
                  to={`/student/courses/${courseId}/study`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <PlayCircle size={22} />
                  {progress > 0 ? "Resume Learning" : "Start Learning"}
                </Link>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-3">
                    You are not enrolled in this course.
                  </p>
                  <Link
                    to="/catalog"
                    className="text-blue-400 hover:text-blue-300 underline text-sm"
                  >
                    Browse Catalog
                  </Link>
                </div>
              )}

              {/* Course stats */}
              <ul className="space-y-2 text-sm text-gray-400 border-t border-gray-700 pt-4">
                <li className="flex items-center gap-3">
                  <Clock size={16} className="text-gray-500 shrink-0" />
                  {course.duration}
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-gray-500 shrink-0" />
                  {modules.length} module{modules.length !== 1 ? "s" : ""}
                </li>
                {course.rating > 0 && (
                  <li className="flex items-center gap-3">
                    <Star size={16} className="text-yellow-400 shrink-0" fill="currentColor" />
                    {course.rating} / 5 rating
                  </li>
                )}
                <li className="flex items-center gap-3">
                  <Award size={16} className="text-gray-500 shrink-0" />
                  Certificate on completion
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CourseDetail;
