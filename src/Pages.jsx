import React from "react";
import { Link } from "react-router-dom";
import { Search, User } from "lucide-react";

function Pages() {
  const pages = [
    {
      title: "About Us",
      description: "Learn about our mission, vision, and the team behind EduPlatform",
      icon: "👥",
      link: "/about"
    },
    {
      title: "Our Instructors",
      description: "Meet our expert instructors and course creators",
      icon: "👨‍🏫",
      link: "/instructors"
    },
    {
      title: "Student Success Stories",
      description: "Read inspiring stories from our successful students",
      icon: "🎓",
      link: "/success-stories"
    },
    {
      title: "Career Center",
      description: "Find job opportunities and career guidance",
      icon: "💼",
      link: "/careers"
    },
    {
      title: "Help & Support",
      description: "Get help with your learning journey",
      icon: "🆘",
      link: "/help"
    },
    {
      title: "Privacy Policy",
      description: "Learn about how we protect your data",
      icon: "🔒",
      link: "/privacy"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

     

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-4 bg-[#1f2937] shadow">
       
        {/* Nav Links */}
        <div className="flex gap-8 text-gray-300 font-medium">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <Link to="/categories" className="hover:text-blue-400">Categories</Link>
          <Link to="/pages" className="hover:text-blue-400 text-blue-400">Pages</Link>
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
        <h1 className="text-4xl font-bold mb-4">Pages</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore all the important pages and resources available on our platform
        </p>
      </div>

      {/* Pages Grid */}
      <div className="px-20 pb-20">
        <div className="grid grid-cols-3 gap-8">
          {pages.map((page, index) => (
            <div
              key={index}
              className="bg-[#1f2937] rounded-xl p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <div className="text-4xl mb-4">{page.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{page.title}</h3>
              <p className="text-gray-400 mb-4">{page.description}</p>
              <Link
                to={page.link}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Learn More →
              </Link>
            </div>
          ))}
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

export default Pages;