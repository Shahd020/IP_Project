import { Link } from "react-router-dom";
import { User, ArrowRight } from "lucide-react"; 

import wideBookHero from '../assets/Logos/wide_book_hero.png'; 
import webDevelopmentIcon from '../assets/Logos/webDevelopment.jpeg';
import machineLearningIcon from '../assets/Logos/MachineLearning .jpeg';
import dataScienceIcon from '../assets/Logos/DataScience.jpeg';

function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden pt-20">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-4 bg-[#1f2937] shadow border-b border-gray-800">
        
        {/* Logo Placeholder */}
        <div className="text-xl font-bold text-white tracking-wide">
          <span className="text-blue-500">Edu</span>Platform
        </div>

        {/* Nav Links */}
        <div className="flex gap-8 text-gray-300 font-medium">
          <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <Link to="/categories" className="hover:text-blue-400 transition-colors">Categories</Link>
          <Link to="/pages" className="hover:text-blue-400 transition-colors">Pages</Link>
          <Link to="/blog" className="hover:text-blue-400 transition-colors">Blog</Link>
          <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-6 text-gray-300">
          <Link to="/login" className="flex items-center gap-2 hover:text-blue-400 font-medium transition-colors bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
            <User size={18} />
            Login
          </Link>
        </div>

      </nav>


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
          
          {/* Card 1: Web Development */}
          <div className="bg-[#1f2937] rounded-2xl p-6 hover:-translate-y-2 transition-transform duration-300 border border-gray-800 shadow-xl flex flex-col">
           <div className="w-full h-40 rounded-xl mb-6 overflow-hidden shadow-inner">
    <img 
      src={webDevelopmentIcon} 
      alt="Web Development" 
      className="w-full h-full object-cover"
    />
  </div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-white">Web Development</h3>
              <span className="text-yellow-400 font-bold flex items-center gap-1 text-sm">4.8 ⭐</span>
            </div>
            
            <p className="text-gray-400 mb-6 text-sm flex-1">Master HTML, CSS, JavaScript, and modern frameworks to build responsive websites.</p>
            
            <div className="flex justify-between items-center border-t border-gray-700 pt-5 mt-auto">
              <span className="text-2xl font-extrabold text-white">$89.99</span>
              <Link to="/course/web-dev" className="group flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-bold transition-colors">
                Explore Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: Machine Learning */}
          <div className="bg-[#1f2937] rounded-2xl p-6 hover:-translate-y-2 transition-transform duration-300 border border-gray-800 shadow-xl flex flex-col">
            <div className="w-full h-40 rounded-xl mb-6 overflow-hidden shadow-inner">
    <img 
      src={machineLearningIcon} 
      alt="Machine Learning" 
      className="w-full h-full object-cover"
    />
  </div>
            
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-white">Machine Learning</h3>
              <span className="text-yellow-400 font-bold flex items-center gap-1 text-sm">4.9 ⭐</span>
            </div>
            
            <p className="text-gray-400 mb-6 text-sm flex-1">Learn AI fundamentals, neural networks, and build intelligent prediction systems.</p>
            
            <div className="flex justify-between items-center border-t border-gray-700 pt-5 mt-auto">
              <span className="text-2xl font-extrabold text-white">$129.99</span>
              <Link to="/course/machine-learning" className="group flex items-center gap-1.5 text-green-400 hover:text-green-300 font-bold transition-colors">
                Explore Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 3: Data Science */}
          <div className="bg-[#1f2937] rounded-2xl p-6 hover:-translate-y-2 transition-transform duration-300 border border-gray-800 shadow-xl flex flex-col">
                  <div className="w-full h-40 rounded-xl mb-6 overflow-hidden shadow-inner">
    <img 
      src={dataScienceIcon} 
      alt="Data Science" 
      className="w-full h-full object-cover"
    />
  </div>
            
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-white">Data Science</h3>
              <span className="text-yellow-400 font-bold flex items-center gap-1 text-sm">4.7 ⭐</span>
            </div>
            
            <p className="text-gray-400 mb-6 text-sm flex-1">Analyze massive datasets, clean data, and extract valuable business insights.</p>
            
            <div className="flex justify-between items-center border-t border-gray-700 pt-5 mt-auto">
              <span className="text-2xl font-extrabold text-white">$99.99</span>
              <Link to="/course/data-science" className="group flex items-center gap-1.5 text-purple-400 hover:text-purple-300 font-bold transition-colors">
                Explore Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

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

      {/* Footer */}
      <footer className="bg-[#1f2937] px-20 py-16 border-t border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1">
            <div className="text-2xl font-bold text-white mb-6">
              <span className="text-blue-500">Edu</span>Platform
            </div>
            <p className="text-gray-400 leading-relaxed text-sm pr-4">
              Empowering learners worldwide with quality education and cutting-edge courses to master the skills of tomorrow.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Courses</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Instructors</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Support</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">📘</a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-400 hover:text-white transition-colors">🐦</a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-colors">📷</a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-800 hover:text-white transition-colors">💼</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} EduPlatform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;