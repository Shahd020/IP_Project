import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import PublicNavbar from "../components/PublicNavbar.jsx";
import PublicFooter from "../components/PublicFooter.jsx";
import apiClient from "../api/axios.js";

import wideBookHero from '../assets/Logos/wide_book_hero.png';

const CARD_COLORS = ['text-blue-400', 'text-green-400', 'text-purple-400'];
const PLACEHOLDER = 'https://placehold.co/400x160/1f2937/94a3b8?text=Course';

function Home() {
  const [featuredCourses, setFeaturedCourses] = useState([]);

  useEffect(() => {
    apiClient.get('/courses?limit=3')
      .then((res) => setFeaturedCourses((res.data.data.courses || []).slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden pt-20">

      <PublicNavbar activePage="/" />


      {/* HERO SECTION */}
     
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 px-10 lg:px-20 py-24 relative">
        
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="w-full lg:w-5/12 max-w-xl z-10">
          <p className="text-blue-400 mb-4 font-bold tracking-wider uppercase text-sm flex items-center gap-2">
            <span className="bg-blue-500/20 p-1 rounded">⚡</span> Learn From 20,000+ Quality Courses
          </p>

          <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.15] mb-6 text-white">
            Best Platform <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Empower Skills
            </span>
          </h1>

          <p className="mt-4 mb-10 text-gray-400 text-lg leading-relaxed max-w-md">
            Start Your Education Journey, For a Better Future. Join thousands of students mastering new skills today.
          </p>

          <Link to="/login" className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/50 transition-transform hover:-translate-y-1">
            Start Learning Now
          </Link>
        </div>

        <div className="w-full lg:w-7/12 relative flex justify-center lg:justify-end z-10 mt-12 lg:mt-0 lg:pl-8">
          <div className="relative w-full max-w-[900px] lg:scale-110 lg:origin-right"> 
            <img 
              src={wideBookHero} 
              alt="Hero Collaborative Learning" 
              className="w-full h-auto object-cover rounded-2xl drop-shadow-2xl border border-gray-700 shadow-blue-900/40 shadow-inner"
            />
          </div>
        </div>

      </div>

      {/* Features Section */}
      <div className="px-20 py-24 bg-[#1f2937] border-y border-gray-800">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover the benefits of learning with us and take your skills to the next level
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-[#0f172a] p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors">
            <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Expert Instructors</h3>
            <p className="text-gray-400 leading-relaxed">Learn from industry professionals with years of real-world experience.</p>
          </div>

          <div className="text-center bg-[#0f172a] p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors">
            <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Flexible Learning</h3>
            <p className="text-gray-400 leading-relaxed">Study at your own pace with lifetime access to all your purchased courses.</p>
          </div>

          <div className="text-center bg-[#0f172a] p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors">
            <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Certified Courses</h3>
            <p className="text-gray-400 leading-relaxed">Earn globally recognized certificates upon course completion.</p>
          </div>
        </div>
      </div>

      
      {/* POPULAR COURSES SECTION */}
      <div className="px-20 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Popular Courses</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our most popular courses and start your learning journey today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCourses.map((course, i) => (
            <div
              key={course._id}
              className="bg-[#1f2937] rounded-2xl p-6 hover:-translate-y-2 transition-transform duration-300 border border-gray-800 shadow-xl flex flex-col"
            >
              <div className="w-full h-40 rounded-xl mb-6 overflow-hidden shadow-inner">
                <img
                  src={course.thumbnail || PLACEHOLDER}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = PLACEHOLDER; }}
                />
              </div>

              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">{course.title}</h3>
                {course.rating > 0 && (
                  <span className="text-yellow-400 font-bold flex items-center gap-1 text-sm shrink-0">
                    {course.rating.toFixed(1)} ⭐
                  </span>
                )}
              </div>

              <p className="text-gray-400 mb-6 text-sm flex-1 line-clamp-2">{course.description}</p>

              <div className="flex justify-between items-center border-t border-gray-700 pt-5 mt-auto">
                <span className="text-2xl font-extrabold text-white">
                  {course.price > 0 ? `$${course.price.toFixed(2)}` : 'Free'}
                </span>
                <Link
                  to={`/course/${course._id}`}
                  className={`group flex items-center gap-1.5 ${CARD_COLORS[i]} hover:opacity-80 font-bold transition-colors`}
                >
                  Explore Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* ---> MASTER EXPLORE BUTTON <--- */}
        <div className="mt-16 flex justify-center">
          <Link to="/catalog" className="group flex items-center gap-3 border border-gray-600 hover:border-gray-400 text-white px-8 py-3 rounded-full font-bold transition-colors shadow-lg">
            Explore All Courses 
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

      {/* Stats Section */}
      <div className="px-20 py-20 bg-[#1f2937] border-y border-gray-800 relative overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          <div>
            <div className="text-5xl font-extrabold text-blue-400 mb-2">20K+</div>
            <div className="text-gray-300 font-medium">Quality Courses</div>
          </div>
          <div>
            <div className="text-5xl font-extrabold text-green-400 mb-2">500K+</div>
            <div className="text-gray-300 font-medium">Students Enrolled</div>
          </div>
          <div>
            <div className="text-5xl font-extrabold text-purple-400 mb-2">1.2K+</div>
            <div className="text-gray-300 font-medium">Expert Instructors</div>
          </div>
          <div>
            <div className="text-5xl font-extrabold text-yellow-400 mb-2">98%</div>
            <div className="text-gray-300 font-medium">Success Rate</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-20 py-24 text-center">
        <h2 className="text-4xl font-bold mb-6 text-white">Ready to Start Your Learning Journey?</h2>
        <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-lg">
          Join thousands of students who are already learning and growing with our platform. Your future starts here.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/50 transition-transform hover:-translate-y-1">
            Get Started Today
          </Link>
          <Link to="/catalog" className="border border-gray-600 hover:border-gray-400 bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-xl font-bold text-lg transition-colors">
            View All Courses
          </Link>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}

export default Home;