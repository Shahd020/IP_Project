import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, Clock, CheckCircle, Award, MonitorPlay,
  Infinity as InfinityIcon, Loader, AlertCircle, BookOpen
} from 'lucide-react';
import { useCourseById } from '../hooks/useFetchCourses.js';
import useEnrollments from '../hooks/useEnrollments.js';
import useAuth from '../hooks/useAuth.js';

function CourseOverview() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { course, loading: courseLoading, error: courseError } = useCourseById(courseId);
  const { enrollments, enroll } = useEnrollments();

  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState(null);

  const myEnrollment = enrollments.find((e) => e.courseId === courseId);
  const isStudent = user?.role === 'student';

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return; }
    setEnrolling(true);
    setEnrollError(null);
    try {
      await enroll(courseId);
      navigate(`/student/courses/${courseId}`);
    } catch (err) {
      setEnrollError(err.message || 'Enrollment failed. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-gray-400 gap-3">
        <Loader size={24} className="animate-spin" /> Loading course…
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-lg">{courseError || 'Course not found'}</p>
          <Link to="/catalog" className="mt-4 inline-block text-blue-400 hover:text-blue-300">← Back to Catalog</Link>
        </div>
      </div>
    );
  }

  const modules = course.modules ?? [];
  const price = course.price ?? 0;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-20 font-sans">

      {/* Hero */}
      <div className="bg-[#1e293b] border-b border-gray-800 pt-16 pb-24 px-10 lg:px-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 w-full lg:w-2/3 pr-8">
          <div className="mb-6">
            <Link to="/catalog" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 transition-colors">
              <ArrowLeft size={16} /> Back to Catalog
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-900/40 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase">
              {course.category}
            </span>
            {course.level && (
              <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-medium capitalize">
                {course.level}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">{course.title}</h1>
          <p className="text-lg text-gray-300 mb-8">{course.description}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
            {course.rating > 0 && (
              <div className="flex items-center gap-1 text-yellow-400 font-bold">
                <Star size={16} fill="currentColor" /> {course.rating.toFixed(1)}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Award size={16} /> {course.enrollmentCount ?? 0} students
            </div>
            <div>
              Created by <span className="text-blue-400 font-bold ml-1">{course.instructor?.name ?? 'Unknown'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="max-w-7xl mx-auto px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-3 gap-12 relative -mt-10">

        {/* Left */}
        <div className="lg:col-span-2 space-y-10 pt-16">

          {modules.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Course Content</h2>
              <div className="bg-[#1f2937] rounded-2xl border border-gray-800 overflow-hidden">
                {modules.map((mod, idx) => (
                  <div key={mod._id ?? idx} className="p-5 border-b border-gray-800 last:border-0 flex justify-between items-center hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <MonitorPlay className="text-blue-400" size={20} />
                      <span className="font-semibold text-gray-200">{mod.title}</span>
                    </div>
                    {mod.duration && (
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock size={14} /> {mod.duration} min
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {modules.length === 0 && (
            <div className="bg-[#1f2937] rounded-2xl border border-gray-800 p-10 text-center">
              <BookOpen size={40} className="text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Modules will appear here once the instructor adds them.</p>
            </div>
          )}
        </div>

        {/* Right — Purchase / Enroll Card */}
        <div className="lg:col-span-1 relative">
          <div className="bg-[#1f2937] rounded-2xl border border-gray-700 shadow-2xl overflow-hidden sticky top-8">

            <div className="w-full h-48 bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center">
              <MonitorPlay size={64} className="text-white drop-shadow-xl" />
            </div>

            <div className="p-8">
              <div className="text-4xl font-extrabold text-white mb-6">
                {price === 0 ? 'Free' : `$${price.toFixed(2)}`}
              </div>

              {/* Enroll / Go to Course / Login CTA */}
              {myEnrollment ? (
                <Link
                  to={`/student/courses/${courseId}`}
                  className="w-full block text-center bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold text-lg mb-3 transition-colors"
                >
                  Go to Course →
                </Link>
              ) : isStudent ? (
                <>
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-lg mb-3 transition-colors"
                  >
                    {enrolling ? <><Loader size={18} className="animate-spin" /> Enrolling…</> : 'Enroll Now — Free'}
                  </button>
                  {enrollError && <p className="text-red-400 text-sm text-center mb-3">{enrollError}</p>}
                </>
              ) : !user ? (
                <Link
                  to="/login"
                  className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-lg mb-3 transition-colors"
                >
                  Log in to Enroll
                </Link>
              ) : (
                <p className="text-gray-400 text-center text-sm mb-3">Only students can enroll in courses.</p>
              )}

              <p className="text-center text-sm text-gray-400 mb-6">30-Day Money-Back Guarantee</p>

              <h4 className="font-bold text-white mb-4">This course includes:</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-3"><MonitorPlay size={16} className="text-gray-400" /> {modules.length} module{modules.length !== 1 ? 's' : ''}</li>
                <li className="flex items-center gap-3"><InfinityIcon size={16} className="text-gray-400" /> Full lifetime access</li>
                <li className="flex items-center gap-3"><Award size={16} className="text-gray-400" /> Certificate of completion</li>
                <li className="flex items-center gap-3"><CheckCircle size={16} className="text-gray-400" /> Quizzes &amp; exercises</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CourseOverview;
