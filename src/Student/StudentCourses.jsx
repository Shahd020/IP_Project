import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, CheckCircle, AlertCircle } from "lucide-react";
import useEnrollments from "../hooks/useEnrollments.js";

const PLACEHOLDER = "https://placehold.co/400x160/1f2937/94a3b8?text=Course";

function StudentCourses() {
  const [activeTab, setActiveTab] = useState("in-progress");
  const { enrollments, loading, error } = useEnrollments();

  const filteredCourses = enrollments.filter((e) => e.status === activeTab);

  const renderButton = (status, courseId) => {
    if (status === "completed") {
      return (
        <Link to={`/student/courses/${courseId}`} className="bg-purple-600 px-5 py-2 rounded-lg text-sm flex items-center gap-2">
          Review <CheckCircle size={16} />
        </Link>
      );
    }
    return (
      <Link to={`/student/courses/${courseId}`} className="bg-blue-600 px-5 py-2 rounded-lg text-sm flex items-center gap-2">
        {status === "saved" ? <><Play size={16} /> Start</> : <><ArrowRight size={16} /> Continue</>}
      </Link>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      <div className="flex gap-6 mb-8 border-b border-gray-700">
        {["in-progress","completed","saved"].map(tab => (
          <button key={tab} onClick={()=>setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {loading && <div>Loading...</div>}

      {error && (
        <div className="text-red-400 flex gap-2">
          <AlertCircle size={20}/> {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div key={course.courseId} className="bg-gray-800 p-4 rounded">
              <img src={course.image || PLACEHOLDER} alt="" />
              <h3>{course.title}</h3>
              {renderButton(course.status, course.courseId)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentCourses;