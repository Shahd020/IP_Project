import React, { useState } from "react";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import { ArrowRight, Play, CheckCircle } from "lucide-react";
import useFetchCourses from "../hooks/useFetchCourses.js";
=======
<<<<<<< HEAD
import { ArrowRight, Play, CheckCircle, AlertCircle } from "lucide-react";
import useEnrollments from "../hooks/useEnrollments.js";

const PLACEHOLDER = "https://placehold.co/400x160/1f2937/94a3b8?text=Course";
>>>>>>> e924226 (phase 2 lilly testing)

function StudentCourses() {
  const [activeTab, setActiveTab] = useState("in-progress");
  const { enrollments, loading, error } = useFetchCourses();

  // Map API enrollment shape â†’ what the card UI already expects
  const courses = enrollments.map((e) => ({
    id: e.course._id,
    title: e.course.title,
    provider: e.course.provider,
    duration: e.course.duration,
    rating: e.course.rating ? `${e.course.rating} â­` : "N/A",
    image: e.course.thumbnail || null,
    progressPercent: e.progressPercent,
    progressText: e.progressText,
    status: e.status,
  }));

<<<<<<< HEAD
=======
  const renderButton = (status, courseId) => {
=======
import { ArrowRight, Play, CheckCircle } from "lucide-react";
import useFetchCourses from "../hooks/useFetchCourses.js";

function StudentCourses() {
  const [activeTab, setActiveTab] = useState("in-progress");
  const { enrollments, loading, error } = useFetchCourses();

  // Map API enrollment shape â†’ what the card UI already expects
  const courses = enrollments.map((e) => ({
    id: e.course._id,
    title: e.course.title,
    provider: e.course.provider,
    duration: e.course.duration,
    rating: e.course.rating ? `${e.course.rating} â­` : "N/A",
    image: e.course.thumbnail || null,
    progressPercent: e.progressPercent,
    progressText: e.progressText,
    status: e.status,
  }));

>>>>>>> e924226 (phase 2 lilly testing)
  const filteredCourses = courses.filter((course) => course.status === activeTab);

  // Passed courseId into this function to make the link dynamic!
  const renderCardButton = (status, courseId) => {
<<<<<<< HEAD
=======
>>>>>>> 9e18abd (phase 2 test lilly)
>>>>>>> e924226 (phase 2 lilly testing)
    if (status === "completed") {
      return (
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors duration-200 shadow-md">
          Review Course <CheckCircle size={16} />
        </button>
      );
    }
    if (status === "saved") {
      return (
        <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors duration-200 shadow-md">
          Start Course <Play size={16} fill="currentColor" />
        </button>
      );
    }
    return (
      <Link
        to={`/student/courses/${courseId}`}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors duration-200 shadow-md"
      >
        Continue <ArrowRight size={16} />
      </Link>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      {/* Tabs */}
      <div className="flex gap-6 mb-8 border-b border-gray-700">
<<<<<<< HEAD
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

=======
<<<<<<< HEAD
        {[["in-progress", "In Progress", "blue"], ["completed", "Completed", "purple"], ["saved", "Saved", "green"]].map(([tab, label, color]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === tab ? `border-${color}-500 text-${color}-400` : "border-transparent text-gray-400 hover:text-gray-200"}`}>
            {label}
          </button>
        ))}
      </div>

      {loading && <div className="text-center py-20 text-gray-400">Loading your courses...</div>}

=======
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

>>>>>>> e924226 (phase 2 lilly testing)
      {/* Loading / Error states */}
      {loading && (
        <div className="text-center py-20 text-gray-400 text-lg">Loading your courses...</div>
      )}
      {error && (
        <div className="text-center py-20 bg-red-900/20 rounded-xl border border-red-700">
          <p className="text-red-400 text-lg">{error}</p>
<<<<<<< HEAD
=======
        </div>
      )}

      {/* Course Grid */}
      {!loading && !error && (
        <>
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
                  {renderCardButton(course.status, course.id)}
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-20 bg-[#1f2937] rounded-xl border border-gray-800">
              <p className="text-gray-400 text-lg">No courses found in this category.</p>
            </div>
          )}
        </>
      )}

      {/* Error state */}
>>>>>>> 9e18abd (phase 2 test lilly)
      {error && !loading && (
        <div className="flex items-center gap-3 py-6 px-4 bg-red-900/30 border border-red-700 rounded-xl text-red-300">
          <AlertCircle size={20} /> {error}
>>>>>>> e924226 (phase 2 lilly testing)
        </div>
      )}

      {/* Course Grid */}
      {!loading && !error && (
        <>
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
                  {renderCardButton(course.status, course.id)}
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-20 bg-[#1f2937] rounded-xl border border-gray-800">
              <p className="text-gray-400 text-lg">No courses found in this category.</p>
            </div>
          )}
        </>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="flex items-center gap-3 py-6 px-4 bg-red-900/30 border border-red-700 rounded-xl text-red-300">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Course Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-[#1f2937] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 flex flex-col justify-between"
              >
                <div className="flex flex-col flex-1">
                  <img
                    src={course.image || PLACEHOLDER}
                    alt={course.title}
                    className="w-full h-40 object-cover"
                    onError={(e) => { e.target.src = PLACEHOLDER; }}
                  />
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
                            course.status === "completed" ? "bg-purple-500" :
                            course.status === "saved"     ? "bg-gray-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${course.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 p-5 flex justify-between items-center mt-auto bg-[#1a2332]">
                  <span className="text-gray-400 font-bold text-sm tracking-widest uppercase">
                    {course.status === "saved" ? "Wishlist" : "Enrolled In"}
                  </span>
                  {renderCardButton(course.status, course.courseId)}
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-20 bg-[#1f2937] rounded-xl border border-gray-800">
              <p className="text-gray-400 text-lg">No courses found in this category.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default StudentCourses;
