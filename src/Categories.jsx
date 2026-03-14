import React from "react";
import { Link } from "react-router-dom";
import { Search, User } from "lucide-react";

function Categories() {
  const categories = [
    {
      name: "Technology",
      description: "Programming, web development, mobile apps, and more",
      courses: 45,
      icon: "💻",
      color: "bg-blue-500"
    },
    {
      name: "Business",
      description: "Entrepreneurship, marketing, finance, and management",
      courses: 32,
      icon: "📈",
      color: "bg-green-500"
    },
    {
      name: "Design",
      description: "Graphic design, UX/UI, photography, and creative arts",
      courses: 28,
      icon: "🎨",
      color: "bg-purple-500"
    },
    {
      name: "Data Science",
      description: "Data analysis, machine learning, AI, and statistics",
      courses: 24,
      icon: "📊",
      color: "bg-red-500"
    },
    {
      name: "Health & Fitness",
      description: "Nutrition, exercise, mental health, and wellness",
      courses: 19,
      icon: "🏃‍♂️",
      color: "bg-yellow-500"
    },
    {
      name: "Languages",
      description: "Learn new languages and improve communication",
      courses: 36,
      icon: "🌍",
      color: "bg-indigo-500"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

    

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-4 bg-[#1f2937] shadow">
       
        {/* Nav Links */}
        <div className="flex gap-8 text-gray-300 font-medium">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <Link to="/categories" className="hover:text-blue-400 text-blue-400">Categories</Link>
          <Link to="/pages" className="hover:text-blue-400">Pages</Link>
          <Link to="/blog" className="hover:text-blue-400">Blog</Link>
          <Link to="/contact" className="hover:text-blue-400">Contact</Link>
        </div>
        {/* Right Icons */}
        <div className="flex items-center gap-5 text-gray-300">
          <Search size={20} className="cursor-pointer hover:text-blue-400" />
          <Link to="/login" className="flex items-center gap-1 hover:text-blue-400">
            <User size={20} />
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-20 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Course Categories</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore our diverse range of course categories and find the perfect learning path for your goals
        </p>
      </div>

      {/* Categories Grid */}
      <div className="px-20 pb-20">
        <div className="grid grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-[#1f2937] rounded-xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-2xl">{category.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">{category.name}</h3>
              <p className="text-gray-400 mb-4 text-center">{category.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-400 font-medium">{category.courses} courses</span>
                <span className="text-gray-400">Explore →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-20 py-20 bg-[#1f2937]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Categories?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Each category is carefully curated to provide comprehensive learning experiences
          </p>
        </div>

        <div className="grid grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">6</div>
            <div className="text-gray-400">Categories</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-400 mb-2">184</div>
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
           
            <p className="text-gray-400">
              Empowering learners worldwide with quality education and cutting-edge courses.
            </p>
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
              <a href="#" className="text-gray-400 hover:text-white text-xl">📘</a>
              <a href="#" className="text-gray-400 hover:text-white text-xl">🐦</a>
              <a href="#" className="text-gray-400 hover:text-white text-xl">📷</a>
              <a href="#" className="text-gray-400 hover:text-white text-xl">💼</a>
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