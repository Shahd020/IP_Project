import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, PlayCircle, CheckCircle, Clock, Star, FileText, Download, Award } from "lucide-react";

import HarvardLogo from '../assets/Logos/Harvard.webp';

function CourseDetail() {
  const { courseId } = useParams();

  // Mock data tailored to your Game Dev project
  const course = {
    title: "2D Game Dev with Unity",
    provider: "Harvard University",
    instructor: "Dr. Alan Turing",
    rating: "4.9",
    reviews: "1,204",
    students: "8,432",
    duration: "8 weeks",
    progress: 45,
    description: "Master the art of 2D game development using Unity and C#. From creating your first sprite sheet to designing complex cutscenes and interactive narratives, this course covers everything you need to bring characters like Aira and Kael to life.",
    whatYouWillLearn: [
      "Master C# scripting for 2D game mechanics",
      "Create and animate complex sprite sheets",
      "Design cinematic dialogue and cutscenes",
      "Implement inventory and quest systems",
    ],
    modules: [
      { title: "Module 1: Unity Basics & Scene Setup", duration: "45 min", completed: true },
      { title: "Module 2: Player Movement & Physics", duration: "1h 20 min", completed: true },
      { title: "Module 3: Designing Aira - Sprite Sheets", duration: "2h 15 min", completed: true },
      { title: "Module 4: Kael's AI & Enemy Behavior", duration: "1h 50 min", completed: false, active: true },
      { title: "Module 5: Crafting Cinematic Cutscenes", duration: "2h 30 min", completed: false },
      { title: "Module 6: UI, Polish & Exporting", duration: "1h 10 min", completed: false },
    ],
    resources: [
      { name: "Aira_Sprite_Template.zip", size: "2.4 MB" },
      { name: "Unity_Shortcuts_CheatSheet.pdf", size: "840 KB" }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-400">
        <Link to="/student/courses" className="hover:text-blue-400 flex items-center gap-1 transition-colors">
          <ArrowLeft size={16} />
          Back to Courses
        </Link>
        <span>/</span>
        <span className="text-gray-200">{course.title}</span>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Course Info & Syllabus (Spans 2 columns) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Section */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                Game Design
              </span>
              <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1 uppercase">
                <Star size={12} fill="currentColor" /> Bestseller
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400" size={18} fill="currentColor" />
                <span className="text-white font-bold">{course.rating}</span>
                <span>({course.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={18} />
                <span>{course.students} students</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{course.duration}</span>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-3">About this course</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              {course.description}
            </p>
          </div>

          {/* What You'll Learn */}
          <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">What you'll learn</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {course.whatYouWillLearn.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-green-400 shrink-0 mt-0.5" size={18} />
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Syllabus */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Course Content</h2>
            <div className="bg-[#1f2937] rounded-xl border border-gray-800 overflow-hidden">
              {course.modules.map((module, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-4 border-b border-gray-800 last:border-0 transition-colors ${module.active ? 'bg-blue-900/10' : 'hover:bg-[#374151]'}`}
                >
                  <div className="flex items-center gap-4">
                    {module.completed ? (
                      <CheckCircle className="text-green-400" size={20} />
                    ) : module.active ? (
                      <PlayCircle className="text-blue-400" size={20} />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                    )}
                    <div>
                      <h4 className={`font-semibold ${module.active ? 'text-blue-400' : 'text-gray-200'}`}>
                        {module.title}
                      </h4>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock size={14} /> {module.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Video & Actions (Spans 1 column) */}
        <div className="lg:col-span-1">
          <div className="bg-[#1f2937] rounded-xl border border-gray-800 shadow-xl overflow-hidden sticky top-8 flex flex-col">
            
            {/* Mock Video Player */}
            <div className="relative w-full h-48 bg-gray-900 group cursor-pointer">
              <img src={HarvardLogo} alt="Course Preview" className="w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircle size={60} className="text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
              </div>
              <span className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded font-semibold">Preview Course</span>
            </div>

            <div className="p-6 flex flex-col flex-1">
              
              {/* Progress Bar Widget */}
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-gray-300 font-semibold">Your Progress</span>
                  <span className="text-white font-bold text-xl">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="text-gray-500 text-xs mt-2 text-center">3 of 6 modules completed</p>
              </div>

              {/* Action Button - ALREADY UPDATED TO LINK */}
              <Link 
                to={`/student/courses/${courseId || 'game-dev-unity'}/study`} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-md mb-6"
              >
                <PlayCircle size={22} />
                Resume Learning
              </Link>

              {/* Course Resources Add-on */}
              <div className="mt-auto border-t border-gray-700 pt-5">
                <h3 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                  <FileText size={16} />
                  Downloadable Resources
                </h3>
                <ul className="space-y-3">
                  {course.resources.map((res, idx) => (
                    <li key={idx} className="flex items-center justify-between group">
                      <span className="text-sm text-gray-400 truncate max-w-[180px]">{res.name}</span>
                      <button className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-900/30 rounded">
                        <Download size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CourseDetail;