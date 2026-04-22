import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, CheckCircle, AlertCircle } from "lucide-react";
import useEnrollments from "../hooks/useEnrollments.js";

const PLACEHOLDER = "https://placehold.co/400x160/1f2937/94a3b8?text=Course";

function StudentCourses() {
  const [activeTab, setActiveTab] = useState("in-progress");
  const { enrollments, loading, error } = useEnrollments();

  const filtered = enrollments.filter((e) => e.status === activeTab);

  const renderButton = (status, courseId) => {
    if (status === "completed") {
      return (
        <Link to={`/student/courses/${courseId}`} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
          Review <CheckCircle size={16} />
        </Link>
      );
    }
    return (
      <Link to={`/student/courses/${courseId}`} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
        {status === "saved" ? <><Play size={16} fill="currentColor" /> Start</> : <><ArrowRight size={16} /> Continue</>}
      </Link>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      <div className="flex gap-6 mb-8 border-b border-gray-700">
        {[["in-progress", "In Progress", "blue"], ["completed", "Completed", "purple"], ["saved", "Saved", "green"]].map(([tab, label, color]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === tab ? `border-${color}-500 text-${color}-400` : "border-transparent text-gray-400 hover:text-gray-200"}`}>
            {label}
          </button>
        ))}
      </div>

      {loading && <div className="text-center py-20 text-gray-400">Loading your courses...</div>}

      {error && !loading && (
        <div className="flex items-center gap-3 py-6 px-4 bg-red-900/30 border border-red-700 rounded-xl text-red-300">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filtered.map((course) => (
              <div key={course.id} className="bg-[#1f2937] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 flex flex-col">
                <img src={course.image || PLACEHOLDER} alt={course.title} className="w-full h-40 object-cover"
                  onError={(e) => { e.target.src = PLACEHOLDER; }} />
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{course.provider}</p>
                  <div className="flex justify-between text-sm text-gray-300 mb-6">
                    <span>{course.duration}</span>
                    <span>{course.rating}</span>
                  </div>
                  <div className="mt-auto">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white font-bold">{course.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all duration-500 ${course.status === "completed" ? "bg-purple-500" : "bg-blue-500"}`}
                        style={{ width: `${course.progressPercent}%` }} />
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-700 p-5 flex justify-between items-center bg-[#1a2332]">
                  <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">Enrolled</span>
                  {renderButton(course.status, course.courseId)}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 bg-[#1f2937] rounded-xl border border-gray-800">
              <p className="text-gray-400 text-lg">No courses in this category yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default StudentCourses;
