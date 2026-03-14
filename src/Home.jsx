import { Link } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      {/* Top Bar */}
    

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-4 bg-[#1f2937] shadow">

        
       
        {/* Nav Links */}
        <div className="flex gap-8 text-gray-300 font-medium">

          <Link to="/" className="hover:text-blue-400">
            Home
          </Link>

          <Link to="/categories" className="hover:text-blue-400">
            Categories
          </Link>

          <Link to="/pages" className="hover:text-blue-400">
            Pages
          </Link>

          <Link to="/blog" className="hover:text-blue-400">
            Blog
          </Link>

          <Link to="/contact" className="hover:text-blue-400">
            Contact
          </Link>

        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-5 text-gray-300">

          <Link to="/login" className="flex items-center gap-1 hover:text-blue-400">
            <User size={20} />
            Login
          </Link>

          <Search size={20} className="cursor-pointer hover:text-blue-400" />

        

        </div>

      </nav>

      {/* Hero Section */}
      <div className="flex items-center justify-between px-20 py-20">

        {/* Left */}
        <div className="max-w-lg">

          <p className="text-gray-400 mb-4">
            ⚡ Learn From 20,000+ Quality Courses
          </p>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Best Platform <br />
            Empower Skills
          </h1>

          <button className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-lg font-medium">
            Start Learning Now
          </button>

          <p className="mt-4 text-gray-400">
            Start Your Education Journey, For a Better Future
          </p>

        </div>

        {/* Right Image */}
        <div className="relative">

         
          {/* Card */}
          <div className="absolute bottom-[-30px] left-[-40px] bg-[#1f2937] shadow-lg rounded-xl p-6">

            <p className="text-2xl font-bold">
              100K+
            </p>

            <p className="text-gray-400 text-sm">
              Total Enrolled Students
            </p>

          </div>

        </div>

      </div>

      {/* Features Section */}
      <div className="px-20 py-20 bg-[#1f2937]">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover the benefits of learning with us and take your skills to the next level
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
            <p className="text-gray-400">Learn from industry professionals with years of experience</p>
          </div>

          <div className="text-center">
            <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Flexible Learning</h3>
            <p className="text-gray-400">Study at your own pace with lifetime access to courses</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Certified Courses</h3>
            <p className="text-gray-400">Earn recognized certificates upon course completion</p>
          </div>
        </div>
      </div>

      {/* Popular Courses Section */}
      <div className="px-20 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Popular Courses</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our most popular courses and start your learning journey today
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="bg-[#1f2937] rounded-xl p-6 hover:scale-105 transition-transform duration-300">
            <div className="bg-blue-500 w-full h-32 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-4xl">💻</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Web Development</h3>
            <p className="text-gray-400 mb-4">Master HTML, CSS, JavaScript, and modern frameworks</p>
            <div className="flex justify-between items-center">
              <span className="text-blue-400 font-medium">4.8 ⭐</span>
              <span className="text-gray-400">12 weeks</span>
            </div>
          </div>

          <div className="bg-[#1f2937] rounded-xl p-6 hover:scale-105 transition-transform duration-300">
            <div className="bg-green-500 w-full h-32 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-4xl">🤖</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Machine Learning</h3>
            <p className="text-gray-400 mb-4">Learn AI fundamentals and build intelligent systems</p>
            <div className="flex justify-between items-center">
              <span className="text-blue-400 font-medium">4.9 ⭐</span>
              <span className="text-gray-400">16 weeks</span>
            </div>
          </div>

          <div className="bg-[#1f2937] rounded-xl p-6 hover:scale-105 transition-transform duration-300">
            <div className="bg-purple-500 w-full h-32 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-4xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Data Science</h3>
            <p className="text-gray-400 mb-4">Analyze data and extract valuable insights</p>
            <div className="flex justify-between items-center">
              <span className="text-blue-400 font-medium">4.7 ⭐</span>
              <span className="text-gray-400">14 weeks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-20 py-20 bg-[#1f2937]">
        <div className="grid grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">20,000+</div>
            <div className="text-gray-400">Quality Courses</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-400 mb-2">500K+</div>
            <div className="text-gray-400">Students Enrolled</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400 mb-2">1,200+</div>
            <div className="text-gray-400">Expert Instructors</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-yellow-400 mb-2">98%</div>
            <div className="text-gray-400">Success Rate</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-20 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          Join thousands of students who are already learning and growing with our platform
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-lg font-medium mr-4">
          Get Started Today
        </button>
        <button className="border border-gray-600 hover:border-gray-500 px-8 py-3 rounded-lg font-medium">
          View All Courses
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-[#1f2937] px-20 py-12">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">EduPlatform</h3>
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

export default Home;