import React from "react";
import { Link } from "react-router-dom";
import { Users, FileText, ClipboardList, Eye, Edit, Loader, AlertCircle, Plus, Trash2 } from "lucide-react";
import useInstructorCourses from "../hooks/useInstructorCourses";

const PLACEHOLDER = "https://placehold.co/400x160/1f2937/94a3b8?text=No+Image";

function CoursesList() {
  const { courses, loading, error, deleteCourse } = useInstructorCourses();

  const handleDelete = async (course) => {
    if (!window.confirm(`Delete "${course.title}"? This cannot be undone.`)) return;
    try {
      await deleteCourse(course._id);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete course");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Link
          to="/instructor/create-course"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
        >
          <Plus size={16} /> New Course
        </Link>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
          <Loader size={24} className="animate-spin" />
          <span>Loading your courses…</span>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center gap-3 py-6 px-4 bg-red-900/30 border border-red-700 rounded-xl text-red-300">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-[#1f2937] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 flex flex-col"
              >
                <img
                  src={course.thumbnail || PLACEHOLDER}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                  onError={(e) => { e.target.src = PLACEHOLDER; }}
                />

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-1">{course.category}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded self-start mb-3 ${
                    course.status === 'published' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {course.status}
                  </span>

                  <div className="flex justify-between text-sm text-gray-300 mb-6">
                    <span className="flex items-center gap-1">
                      <Users size={16} />
                      {course.enrollmentCount ?? 0} Students
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText size={16} />
                      {course.modules?.length ?? 0} Modules
                    </span>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <Link
                      to={`/instructor/modules?courseId=${course._id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                    >
                      <Edit size={16} /> Modules
                    </Link>

                    <Link
                      to="/instructor/materials"
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                    >
                      <FileText size={16} /> Materials
                    </Link>

                    <Link
                      to="/instructor/quiz"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                    >
                      <ClipboardList size={16} /> Quiz
                    </Link>

                    <Link
                      to={`/instructor/courses/${course._id}`}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                    >
                      <Eye size={16} /> Preview
                    </Link>

                    <button
                      onClick={() => handleDelete(course)}
                      className="col-span-2 bg-red-700 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} /> Delete Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {courses.length === 0 && (
            <div className="text-center py-20 bg-[#1f2937] rounded-xl border border-gray-800">
              <p className="text-gray-400 text-lg mb-4">You haven't created any courses yet.</p>
              <Link
                to="/instructor/create-course"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                <Plus size={18} /> Create your first course
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CoursesList;
