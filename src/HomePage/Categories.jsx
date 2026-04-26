import React from "react";
import { Link } from "react-router-dom";
import { User, Loader } from "lucide-react";
import useFetchCourses from "../hooks/useFetchCourses";

// Static metadata (icons, colours, descriptions) stays in the frontend — it's UI config.
// Course counts are derived from the live API response below.
const CATEGORY_META = {
  Technology:      { icon: "💻", color: "bg-blue-500",   description: "Programming, web development, mobile apps, and more" },
  Business:        { icon: "📈", color: "bg-green-500",  description: "Entrepreneurship, marketing, finance, and management" },
  Design:          { icon: "🎨", color: "bg-purple-500", description: "Graphic design, UX/UI, photography, and creative arts" },
  "Data Science":  { icon: "📊", color: "bg-red-500",    description: "Data analysis, machine learning, AI, and statistics" },
  "Health & Fitness": { icon: "🏃‍♂️", color: "bg-yellow-500", description: "Nutrition, exercise, mental health, and wellness" },
  Languages:       { icon: "🌍", color: "bg-indigo-500", description: "Learn new languages and improve communication" },
};

function Categories() {
  // Fetch all published courses once and count per category client-side.
  // One request is far cheaper than 6 separate category-count requests.
  const { courses, loading, error } = useFetchCourses();

  const countByCategory = courses.reduce((acc, course) => {
    acc[course.category] = (acc[course.category] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.entries(CATEGORY_META).map(([name, meta]) => ({
    name,
    ...meta,
    courses: countByCategory[name] || 0,
  }));

  const totalCourses = courses.length;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pt-20">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1f2937] shadow border-b border-gray-800">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-10 py-4">
          <div className="justify-self-start text-xl font-bold text-white tracking-wide">
            <Link to="/"><span className="text-blue-500">Edu</span>Platform</Link>
          </div>
          <div className="justify-self-center flex gap-8 text-gray-300 font-medium">
            <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <Link to="/categories" className="hover:text-blue-400 transition-colors text-blue-400">Categories</Link>
            <Link to="/pages" className="hover:text-blue-400 transition-colors">Pages</Link>
            <Link to="/blog" className="hover:text-blue-400 transition-colors">Blog</Link>
            <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
          </div>
          <div className="justify-self-end flex items-center gap-6 text-gray-300">
            <Link to="/login" className="flex items-center gap-2 hover:text-blue-400 font-medium transition-colors bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
              <User size={18} /> Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="px-20 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Course Categories</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore our diverse range of course categories and find the perfect learning path for your goals
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center gap-3 pb-16 text-gray-400">
          <Loader size={22} className="animate-spin" /> Loading categories…
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <p className="text-center text-red-400 pb-16">{error}</p>
      )}

      {/* Categories Grid */}
      {!loading && (
        <div className="px-20 pb-20">
          <div className="grid grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                to={`/catalog?category=${encodeURIComponent(category.name)}`}
                key={category.name}
                className="bg-[#1f2937] rounded-xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer block"
              >
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">{category.name}</h3>
                <p className="text-gray-400 mb-4 text-center">{category.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-400 font-medium">{category.courses} course{category.courses !== 1 ? 's' : ''}</span>
                  <span className="text-gray-400">Explore →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="px-20 py-20 bg-[#1f2937]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Categories?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Each category is carefully curated to provide comprehensive learning experiences
          </p>
        </div>
        <div className="grid grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">{Object.keys(CATEGORY_META).length}</div>
            <div className="text-gray-400">Categories</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-400 mb-2">{totalCourses}</div>
            <div className="text-gray-400">Total Courses</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400 mb-2">50K+</div>
            <div className="text-gray-400">Students</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-yellow-400 mb-2">4.8</div>
            <div className="text-gray-400">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1f2937] px-20 py-12">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <p className="text-gray-400">Empowering learners worldwide with quality education and cutting-edge courses.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Courses</a></li>
              <li><a href="#" className="hover:text-white">Instructors</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              {["📘","🐦","📷","💼"].map((icon) => (
                <a key={icon} href="#" className="text-gray-400 hover:text-white text-xl">{icon}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 EduPlatform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Categories;
