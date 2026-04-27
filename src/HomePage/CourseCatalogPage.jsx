import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Star, Loader, AlertCircle, Search } from "lucide-react";
import useFetchCourses from "../hooks/useFetchCourses";
import PublicNavbar from "../components/PublicNavbar.jsx";
import PublicFooter from "../components/PublicFooter.jsx";

const PLACEHOLDER = "https://placehold.co/400x176/1f2937/94a3b8?text=No+Image";

const LEVEL_LABELS = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };
const LEVEL_COLORS = {
  beginner:     "bg-green-900 text-green-300",
  intermediate: "bg-yellow-900 text-yellow-300",
  advanced:     "bg-red-900 text-red-300",
};

function CourseCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

  const filters = {
    ...(searchParams.get("category") && { category: searchParams.get("category") }),
    ...(searchParams.get("search")   && { search:   searchParams.get("search") }),
    ...(searchParams.get("level")    && { level:    searchParams.get("level") }),
  };

  const { courses, loading, error } = useFetchCourses(filters);

  const applySearch = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput.trim()) next.set("search", searchInput.trim());
    else next.delete("search");
    setSearchParams(next);
  };

  const clearFilter = (key) => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    setSearchParams(next);
  };

  const activeCategory = searchParams.get("category");
  const activeSearch   = searchParams.get("search");

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <PublicNavbar activePage="/catalog" />

      <div className="pt-20 px-6 sm:px-10 lg:px-20 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto">

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">All Courses</h1>
            <p className="mt-3 text-gray-400 max-w-3xl text-sm sm:text-base">
              Browse the complete course catalog. Find the right course for your goals.
            </p>
          </div>

          {/* Search + Active Filters */}
          <div className="flex flex-wrap gap-3 mb-8 items-center">
            <form onSubmit={applySearch} className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search courses…"
                className="px-4 py-2 rounded-lg bg-[#1f2937] border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-64"
              />
              <button type="submit" className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                <Search size={16} />
              </button>
            </form>

            {activeCategory && (
              <span className="flex items-center gap-2 px-3 py-1.5 bg-blue-900/40 border border-blue-600 rounded-full text-sm text-blue-300">
                {activeCategory}
                <button onClick={() => clearFilter("category")} className="hover:text-white leading-none">×</button>
              </span>
            )}
            {activeSearch && (
              <span className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 rounded-full text-sm text-gray-300">
                "{activeSearch}"
                <button onClick={() => { clearFilter("search"); setSearchInput(""); }} className="hover:text-white leading-none">×</button>
              </span>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
              <Loader size={24} className="animate-spin" /> Loading courses…
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="flex items-center gap-3 py-6 px-4 bg-red-900/30 border border-red-700 rounded-xl text-red-300">
              <AlertCircle size={20} /> {error}
            </div>
          )}

          {/* Count */}
          {!loading && !error && (
            <p className="text-sm text-gray-500 mb-6">
              {courses.length} course{courses.length !== 1 ? "s" : ""} found
            </p>
          )}

          {/* Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-[#1f2937] rounded-2xl overflow-hidden border border-gray-800 shadow-xl flex flex-col"
                >
                  <img
                    src={course.thumbnail || PLACEHOLDER}
                    alt={course.title}
                    className="w-full h-44 object-cover"
                    onError={(e) => { e.target.src = PLACEHOLDER; }}
                  />

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start gap-4">
                      <h2 className="text-lg font-bold text-white leading-tight">{course.title}</h2>
                      {course.rating > 0 && (
                        <span className="text-yellow-400 font-bold flex items-center gap-1 text-sm shrink-0">
                          {course.rating.toFixed(1)} <Star size={13} fill="currentColor" />
                        </span>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm mt-1">
                      {course.instructor?.name ?? "Unknown Instructor"}
                    </p>

                    <div className="flex gap-2 mt-2 flex-wrap">
                      {course.level && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEVEL_COLORS[course.level] ?? 'bg-gray-700 text-gray-300'}`}>
                          {LEVEL_LABELS[course.level] ?? course.level}
                        </span>
                      )}
                      {course.duration && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                          {course.duration}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-300 text-sm mt-3 mb-5 flex-1 line-clamp-3">{course.description}</p>

                    <div className="flex justify-between items-center border-t border-gray-700 pt-4 mt-auto">
                      <span className="text-2xl font-extrabold text-white">
                        {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                      </span>
                      <Link
                        to={`/course/${course._id}`}
                        className="group flex items-center gap-1.5 font-bold text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        View Details
                        <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {courses.length === 0 && (
                <div className="col-span-3 text-center py-24 bg-[#1f2937] rounded-2xl border border-gray-800">
                  <p className="text-gray-400 text-lg">No courses match your filters.</p>
                  <button
                    onClick={() => { setSearchParams({}); setSearchInput(""); }}
                    className="mt-4 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}

export default CourseCatalogPage;
