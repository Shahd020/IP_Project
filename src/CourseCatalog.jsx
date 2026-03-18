import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, CheckCircle, Award, FileText, MonitorPlay, Infinity } from 'lucide-react';
import { catalogData } from './CourseCatalog'; // Import the shared data!

function CourseOverview() {
  const { courseId } = useParams();
  const course = catalogData[courseId] || catalogData["web-dev"]; // Fallback to web-dev if not found

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-20 font-sans">
      
      {/* 1. HERO BANNER */}
      <div className="bg-[#1e293b] border-b border-gray-800 pt-16 pb-24 px-10 lg:px-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 w-full lg:w-2/3 pr-8">
          
          <div className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-400">
            <Link to="/catalog" className="hover:text-blue-400 flex items-center gap-1"><ArrowLeft size={16} /> Back to Catalog</Link>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase">Bestseller</span>
            <span className="text-blue-400 font-semibold">{course.id.replace('-', ' ').toUpperCase()}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">{course.title}</h1>
          <p className="text-lg text-gray-300 mb-8">{course.description}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-1 text-yellow-400 font-bold"><Star size={16} fill="currentColor" /> {course.rating} <span className="text-gray-400 font-normal">(2,104 ratings)</span></div>
            <div className="flex items-center gap-1"><Award size={16} /> 14,203 students enrolled</div>
            <div className="flex items-center gap-1">Created by <span className="text-blue-400 font-bold ml-1">{course.instructor}</span></div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-3 gap-12 relative -mt-10">
        
        {/* Left Column (Description & Syllabus) */}
        <div className="lg:col-span-2 space-y-10 pt-16">
          
          <div className="bg-[#1f2937] p-8 rounded-2xl border border-gray-800">
            <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {course.learn.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="text-green-400 shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Course Content</h2>
            <div className="bg-[#1f2937] rounded-2xl border border-gray-800 overflow-hidden">
              {course.modules.map((module, idx) => (
                <div key={idx} className="p-5 border-b border-gray-800 last:border-0 flex justify-between items-center hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <MonitorPlay className="text-blue-400" size={20} />
                    <span className="font-semibold text-gray-200">{module}</span>
                  </div>
                  <span className="text-sm text-gray-500 flex items-center gap-1"><Clock size={14} /> 2h 15m</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (The Floating Purchase Card from your Image) */}
        <div className="lg:col-span-1 relative">
          <div className="bg-[#1f2937] rounded-2xl border border-gray-700 shadow-2xl overflow-hidden sticky top-8">
            
            {/* Video Preview Block */}
            <div className={`w-full h-48 bg-gradient-to-br from-${course.color}-600 to-${course.color}-900 relative flex items-center justify-center cursor-pointer group`}>
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
               <MonitorPlay size={64} className="text-white drop-shadow-xl z-10 group-hover:scale-110 transition-transform" />
               <span className="absolute bottom-3 text-white font-bold text-sm z-10 bg-black/60 px-3 py-1 rounded-full">Preview this course</span>
            </div>

            <div className="p-8">
              <div className="text-4xl font-extrabold text-white mb-6">{course.price}</div>
              
              <Link to="/login" className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-lg mb-3 shadow-lg transition-colors">
                Add To Cart
              </Link>
              <Link to="/login" className="w-full block text-center bg-transparent border-2 border-gray-500 hover:border-white text-white py-3 rounded-xl font-bold text-lg mb-6 transition-colors">
                Buy Now
              </Link>

              <p className="text-center text-sm text-gray-400 mb-6">30-Day Money-Back Guarantee</p>

              <h4 className="font-bold text-white mb-4">This course includes:</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-3"><MonitorPlay size={16} className="text-gray-400" /> 24 hours on-demand video</li>
                <li className="flex items-center gap-3"><FileText size={16} className="text-gray-400" /> 12 downloadable resources</li>
                <li className="flex items-center gap-3"><Infinity size={16} className="text-gray-400" /> Full lifetime access</li>
                <li className="flex items-center gap-3"><Award size={16} className="text-gray-400" /> Certificate of completion</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CourseOverview;