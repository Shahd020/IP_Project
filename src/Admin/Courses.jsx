import React from "react";
import { Link } from "react-router-dom";
import { Star, Loader, AlertCircle } from "lucide-react";
import useFetchCourses from "../hooks/useFetchCourses";

const PLACEHOLDER = "https://placehold.co/400x160/0f172a/94a3b8?text=Course";

const LEVEL_COLORS = {
  beginner:     "bg-green-900/60 text-green-300",
  intermediate: "bg-yellow-900/60 text-yellow-300",
  advanced:     "bg-red-900/60 text-red-300",
};

function Courses() {
  const { courses, loading, error } = useFetchCourses();

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-gray-400 py-20 justify-center">
        <Loader size={22} className="animate-spin" /> Loading courses…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 text-red-400 py-20 justify-center">
        <AlertCircle size={22} /> {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Courses</h1>
        <span className="text-sm text-gray-400">{courses.length} course{courses.length !== 1 ? 's' : ''} total</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-[#111827] rounded-xl overflow-hidden border border-gray-800 shadow-lg hover:-translate-y-1 transition-transform duration-300 flex flex-col"
          >
            <img
              src={course.thumbnail || PLACEHOLDER}
              alt={course.title}
              className="w-full h-40 object-cover"
              onError={(e) => { e.target.src = PLACEHOLDER; }}
            />

            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start gap-3 mb-1">
                <h3 className="text-base font-bold text-white leading-snug">{course.title}</h3>
                {course.rating > 0 && (
                  <span className="flex items-center gap-1 text-yellow-400 font-bold text-sm shrink-0">
                    {course.rating.toFixed(1)} <Star size={13} fill="currentColor" />
                  </span>
                )}
              </div>

              <p className="text-gray-400 text-sm mb-2">
                {course.instructor?.name ?? "Unknown Instructor"}
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                {course.level && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEVEL_COLORS[course.level] ?? 'bg-gray-700 text-gray-300'}`}>
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 capitalize">
                  {course.status}
                </span>
                {course.category && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-300 border border-blue-800">
                    {course.category}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-800">
                <span className="text-lg font-extrabold text-white">
                  {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
                </span>
                <span className="text-xs text-gray-500">
                  {course.enrollmentCount ?? 0} enrolled
                </span>
              </div>
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <div className="col-span-3 text-center py-20 text-gray-400">
            No courses found in the database.
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;
