import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, CheckCircle } from "lucide-react";
import useFetchCourses from "../hooks/useFetchCourses.js";

function StudentCourses() {
  const [activeTab, setActiveTab] = useState("in-progress");
  const { enrollments, loading, error } = useFetchCourses();

  // Map API enrollment shape → what the card UI already expects
  const courses = enrollments.map((e) => ({
    id: e.course._id,
    title: e.course.title,
    provider: e.course.provider,
    duration: e.course.duration,
    rating: e.course.rating ? `${e.course.rating} ⭐` : "N/A",
    image: e.course.thumbnail || null,
    progressPercent: e.progressPercent,
    progressText: e.progressText,
    status: e.status,
  }));

  const filteredCourses = courses.filter((course) => course.status === activeTab);

  // Passed courseId into this function to make the link dynamic!
  const renderCardButton = (status, courseId) => {
    if (status === "completed") {
      return (
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors duration-200 shadow-md">
          Review Course
          <CheckCircle size={16} />
        </button>
      );
    } else if (status === "saved") {
      return (
        <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors duration-200 shadow-md">
          Start Course
          <Play size={16} fill="currentColor" />
        </button>
      );
    } else {
      return (
        <Link 
          to={`/student/courses/${courseId || 'game-dev'}`} // <-- DYNAMIC LINK!
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors duration-200 shadow-md"
        >
          Continue
          <ArrowRight size={16} />
        </Link>
      );
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      {/* Tabs Navigation */}
      <div className="flex gap-6 mb-8 border-b border-gray-700">
        <button 
          onClick={() => setActiveTab("in-progress")}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === "in-progress" ? "border-blue-500 text-blue-400" : "border-transparent text-gray-400 hover:text-gray-200"}`}
        >
          In Progress
        </button>
        <button 
          onClick={() => setActiveTab("completed")}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === "completed" ? "border-purple-500 text-purple-400" : "border-transparent text-gray-400 hover:text-gray-200"}`}
        >
          Completed
        </button>
        <button 
          onClick={() => setActiveTab("saved")}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === "saved" ? "border-green-500 text-green-400" : "border-transparent text-gray-400 hover:text-gray-200"}`}
        >
          Saved / Not Started
        </button>
      </div>

      {/* Loading / Error states */}
      {loading && (
        <div className="text-center py-20 text-gray-400 text-lg">Loading your courses...</div>
      )}
      {error && (
        <div className="text-center py-20 bg-red-900/20 rounded-xl border border-red-700">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      )}

      {/* Course Grid */}
      {!loading && !error && (
      <div className="grid grid-cols-3 gap-8">
        {filteredCourses.map((course, index) => (
          <div
            key={index}
            className="bg-[#1f2937] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 flex flex-col justify-between"
          >
            <div className="flex flex-col flex-1">
              <img src={course.image} alt={course.title} className="w-full h-40 object-cover" />
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{course.provider}</p>
                <div className="flex justify-between text-sm text-gray-300 mb-6">
                  <span>{course.duration}</span>
                  <span>{course.rating}</span>
                </div>
                
                <div className="mt-auto">
                  <div className="flex justify-between items-end text-sm mb-2">
                    <span className="text-gray-400 font-medium">Progress</span>
                    <div className="text-right">
                      <span className="text-white font-bold">{course.progressPercent}%</span>
                      <span className="text-gray-400 text-xs ml-2">({course.progressText})</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        course.status === 'completed' ? 'bg-purple-500' : 
                        course.status === 'saved' ? 'bg-gray-500' : 'bg-blue-500'
                      }`} 
                      style={{ width: `${course.progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 p-5 flex justify-between items-center mt-auto bg-[#1a2332]">
              <span className="text-gray-400 font-bold text-sm tracking-widest uppercase">
                {course.status === 'saved' ? 'Wishlist' : 'Enrolled In'}
              </span>
              
              {/* Passed the ID down so it links to the right place */}
              {renderCardButton(course.status, course.id)}

            </div>

          </div>
        ))}
      </div>

        {filteredCourses.length === 0 && (
          <div className="col-span-3 text-center py-20 bg-[#1f2937] rounded-xl border border-gray-800">
            <p className="text-gray-400 text-lg">No courses found in this category.</p>
          </div>
        )}
      </div>
      )}

    </div>
  );
}

export default StudentCourses;