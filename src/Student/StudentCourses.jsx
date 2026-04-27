import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, CheckCircle, AlertCircle, Star, Clock, BookOpen } from "lucide-react";
import useEnrollments from "../hooks/useEnrollments.js";

const PLACEHOLDER = "https://placehold.co/400x200/1f2937/94a3b8?text=Course";

const TABS = [
  { key: "in-progress", label: "In Progress" },
  { key: "completed",   label: "Completed"   },
  { key: "saved",       label: "Saved"        },
];

function CourseCard({ course, onStart }) {
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);

  const handleStart = async () => {
    setStarting(true);
    try {
      await onStart(course.id);
      navigate(`/student/courses/${course.courseId}/study`);
    } catch {
      navigate(`/student/courses/${course.courseId}`);
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="bg-[#1f2937] rounded-xl border border-gray-800 overflow-hidden flex flex-col hover:border-gray-600 transition-colors">

      {/* Thumbnail */}
      <div className="relative w-full h-44 bg-gray-900 overflow-hidden">
        <img
          src={course.image || PLACEHOLDER}
          alt={course.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />
        {course.status === "in-progress" && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-700">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${course.progressPercent}%` }}
            />
          </div>
        )}
        {course.status === "completed" && (
          <div className="absolute top-3 right-3 bg-green-500/90 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <CheckCircle size={12} /> Completed
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 gap-3">

        {/* Provider + rating */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="font-medium text-blue-400 truncate max-w-[65%]">{course.provider}</span>
          {course.rating && (
            <span className="flex items-center gap-1 text-yellow-400 font-semibold shrink-0">
              <Star size={12} fill="currentColor" /> {course.rating}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-base leading-snug line-clamp-2">{course.title}</h3>

        {/* Description */}
        {course.description && (
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{course.description}</p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto">
          {course.duration && (
            <span className="flex items-center gap-1"><Clock size={12} />{course.duration}</span>
          )}
          {course.status === "in-progress" && (
            <span className="flex items-center gap-1 text-blue-400 font-semibold">
              <BookOpen size={12} />{course.progressPercent}% complete
            </span>
          )}
        </div>

        {/* Progress bar label row (in-progress only) */}
        {course.status === "in-progress" && (
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span className="font-semibold text-white">{course.progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all"
                style={{ width: `${course.progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA */}
        {course.status === "completed" ? (
          <Link
            to={`/student/courses/${course.courseId}`}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors mt-1"
          >
            <CheckCircle size={15} /> Review Course
          </Link>
        ) : course.status === "in-progress" ? (
          <Link
            to={`/student/courses/${course.courseId}/study`}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors mt-1"
          >
            <Play size={15} /> Continue Learning
          </Link>
        ) : (
          <button
            onClick={handleStart}
            disabled={starting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors mt-1"
          >
            <Play size={15} /> {starting ? "Starting…" : "Start Learning"}
          </button>
        )}

      </div>
    </div>
  );
}

function StudentCourses() {
  const [activeTab, setActiveTab] = useState("in-progress");
  const { enrollments, loading, error, startCourse } = useEnrollments();

  const filteredCourses = enrollments.filter((e) => e.status === activeTab);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      <div className="flex gap-2 mb-8 border-b border-gray-700">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-5 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === key
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-white hover:border-gray-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#1f2937] rounded-xl border border-gray-800 animate-pulse h-80" />
          ))}
        </div>
      )}

      {error && (
        <div className="text-red-400 flex items-center gap-2 py-4">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {!loading && !error && filteredCourses.length === 0 && (
        <p className="text-gray-400 text-sm py-8 text-center">No {activeTab} courses yet.</p>
      )}

      {!loading && !error && filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} onStart={startCourse} />
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentCourses;
