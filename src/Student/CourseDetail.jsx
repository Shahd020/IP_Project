import React from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, PlayCircle, CheckCircle, Clock, Star, FileText, Award, Loader, AlertCircle } from "lucide-react";
import { useCourseById } from "../hooks/useFetchCourses";
import useEnrollments from "../hooks/useEnrollments";

const PLACEHOLDER = "https://placehold.co/600x240/0f172a/94a3b8?text=No+Preview";

function CourseDetail() {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { course, loading, error } = useCourseById(courseId);
  const { enrollments } = useEnrollments();

  const isInstructorPreview = location.pathname.startsWith("/instructor");
  const enrollment = !isInstructorPreview
    ? enrollments.find((e) => e.courseId === courseId)
    : null;
  const progressPercent = enrollment?.progressPercent ?? 0;

  const handleBack = () => {
    const returnTo = location.state?.from;
    if (typeof returnTo === "string" && returnTo.length > 0) { navigate(returnTo); return; }
    if (window.history.length > 1) { navigate(-1); return; }
    navigate(isInstructorPreview ? "/instructor/courses" : "/student/courses", { replace: true });
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32 gap-3 text-gray-400">
      <Loader size={28} className="animate-spin" /> Loading course…
    </div>
  );

  if (error) return (
    <div className="flex items-center gap-3 py-6 px-4 bg-red-900/30 border border-red-700 rounded-xl text-red-300 max-w-2xl mt-12">
      <AlertCircle size={20} /> {error}
    </div>
  );

  if (!course) return null;

  const instructorName = course.instructor?.name ?? "Unknown Instructor";
  const modules       = course.modules ?? [];
  const outcomes      = course.learningOutcomes ?? [];

  return (
    <div className="max-w-6xl mx-auto pb-12">

      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-400">
        <button type="button" onClick={handleBack} className="hover:text-blue-400 flex items-center gap-1 transition-colors">
          <ArrowLeft size={16} /> Back to Courses
        </button>
        <span>/</span>
        <span className="text-gray-200">{course.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Left column ── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                {course.category}
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
                  <span className="text-white font-bold">{course.rating.toFixed(1)}</span>
                  <span>({course.totalRatings ?? 0} reviews)</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Award size={18} />
                <span>{course.enrollmentCount ?? 0} students</span>
              </div>
              {course.duration && (
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{course.duration}</span>
                </div>
              )}
            </div>
          </div>

          {/* About */}
          <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-3">About this course</h2>
            <p className="text-gray-300 leading-relaxed text-sm">{course.description}</p>
            <p className="text-gray-400 text-sm mt-3">
              Instructor: <span className="text-white font-medium">{instructorName}</span>
            </p>
          </div>

          {/* Learning Outcomes */}
          {outcomes.length > 0 && (
            <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4">What you'll learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {outcomes.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="text-green-400 shrink-0 mt-0.5" size={18} />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modules */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Course Content
              <span className="ml-2 text-base font-normal text-gray-400">
                ({modules.length} module{modules.length !== 1 ? "s" : ""})
              </span>
            </h2>
            {modules.length === 0 ? (
              <p className="text-gray-400 text-sm">No modules added yet.</p>
            ) : (
              <div className="bg-[#1f2937] rounded-xl border border-gray-800 overflow-hidden">
                {modules.map((mod, index) => (
                  <div
                    key={mod._id}
                    className="flex items-center justify-between p-4 border-b border-gray-800 last:border-0 hover:bg-[#374151] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-600 flex items-center justify-center shrink-0">
                        <span className="text-[10px] text-gray-400 font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-200">{mod.title}</h4>
                        {mod.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{mod.description}</p>
                        )}
                      </div>
                    </div>
                    {mod.content?.length > 0 && (
                      <span className="text-sm text-gray-500 flex items-center gap-1 shrink-0">
                        <FileText size={14} />
                        {mod.content.length} item{mod.content.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* ── Right sidebar ── */}
        <div className="lg:col-span-1">
          <div className="bg-[#1f2937] rounded-xl border border-gray-800 shadow-xl overflow-hidden sticky top-8 flex flex-col">

            {/* Thumbnail / preview */}
            <div className="relative w-full h-48 bg-gray-900 border-b border-gray-700 overflow-hidden">
              <img
                src={course.thumbnail || PLACEHOLDER}
                alt={course.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = PLACEHOLDER; }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <PlayCircle size={52} className="text-white drop-shadow-lg" />
              </div>
              <span className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded font-semibold">
                Preview Course
              </span>
            </div>

            <div className="p-6 flex flex-col gap-5">

              {/* Price */}
              <p className="text-3xl font-extrabold text-white">
                {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
              </p>

              {/* Progress (student only) */}
              {!isInstructorPreview && (
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-300 font-semibold text-sm">Your Progress</span>
                    <span className="text-white font-bold">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* CTA */}
              {!isInstructorPreview ? (
                <Link
                  to={`/student/courses/${courseId}/study`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <PlayCircle size={22} />
                  {progressPercent > 0 ? "Resume Learning" : "Start Learning"}
                </Link>
              ) : (
                <span className="w-full text-center py-2 text-sm text-yellow-400 border border-yellow-700 rounded-lg bg-yellow-900/20">
                  Instructor Preview Mode
                </span>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CourseDetail;
