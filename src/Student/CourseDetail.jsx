import React from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, PlayCircle, CheckCircle, Clock, Star, FileText, Download, Award } from "lucide-react";

import StanfordLogo from '../assets/Logos/Standford.webp';
import AmazonLogo from '../assets/Logos/Amazon.jpeg';
import MetaLogo from '../assets/Logos/Meta.jpeg';
import HarvardLogo from '../assets/Logos/Harvard.webp';

// --- MOCK DATABASE FOR COURSE DETAILS ---
const courseDetailData = {
  "cyber-security": {
    id: "cyber-security", title: "Cyber Security & Cryptography", provider: "Stanford University", instructor: "Prof. Dan Boneh",
    rating: "4.7", reviews: "3,204", students: "18,432", duration: "10 weeks", progress: 70, image: StanfordLogo,
    description: "Learn the fundamentals of securing networks, cryptographic protocols, and defending against modern cyber threats. Protect sensitive data from emerging vulnerabilities.",
    whatYouWillLearn: ["Understand symmetric and asymmetric encryption", "Analyze network vulnerabilities", "Implement firewall rules", "Secure web applications"],
    modules: [
      { title: "Module 1: Intro to InfoSec", duration: "1h 10 min", completed: true },
      { title: "Module 2: Cryptographic Hashes", duration: "2h 20 min", completed: true },
      { title: "Module 3: Public Key Infrastructure", duration: "1h 45 min", completed: false, active: true },
      { title: "Module 4: Network Defense", duration: "2h 10 min", completed: false }
    ],
    resources: [{ name: "Crypto_CheatSheet.pdf", size: "1.2 MB" }]
  },
  "cloud-computing": {
    id: "cloud-computing", title: "Cloud Computing", provider: "Amazon Web Services", instructor: "Jeff Barr",
    rating: "4.6", reviews: "5,120", students: "25,000", duration: "6 weeks", progress: 33, image: AmazonLogo,
    description: "Master the core AWS services, cloud architecture, and serverless deployment strategies to scale modern web applications globally.",
    whatYouWillLearn: ["Deploy EC2 instances", "Manage S3 buckets", "Design scalable architectures", "Implement IAM security policies"],
    modules: [
      { title: "Week 1: Cloud Basics", duration: "2h 00 min", completed: true },
      { title: "Week 2: Compute & Networking", duration: "3h 15 min", completed: false, active: true },
      { title: "Week 3: Storage & Databases", duration: "2h 45 min", completed: false }
    ],
    resources: [{ name: "AWS_Architecture_Diagrams.zip", size: "5.5 MB" }]
  },
  "game-dev": {
    id: "game-dev", title: "2D Game Dev with Unity", provider: "Harvard University", instructor: "Dr. Alan Turing",
    rating: "4.9", reviews: "1,204", students: "8,432", duration: "8 weeks", progress: 45, image: HarvardLogo,
    description: "Master the art of 2D game development using Unity and C#. From creating your first sprite sheet to designing complex cutscenes and interactive narratives.",
    whatYouWillLearn: ["Master C# scripting for 2D game mechanics", "Create and animate complex sprite sheets", "Design cinematic dialogue", "Implement quest systems"],
    modules: [
      { title: "Module 1: Unity Basics", duration: "45 min", completed: true },
      { title: "Module 2: Player Movement", duration: "1h 20 min", completed: true },
      { title: "Module 3: Sprite Sheets", duration: "2h 15 min", completed: true },
      { title: "Module 4: Kael's AI", duration: "1h 50 min", completed: false, active: true },
      { title: "Module 5: Cutscenes", duration: "2h 30 min", completed: false }
    ],
    resources: [{ name: "Aira_Sprite.zip", size: "2.4 MB" }, { name: "Unity_Shortcuts.pdf", size: "840 KB" }]
  },
  "react": {
    id: "react", title: "Internet Programming with React", provider: "Meta", instructor: "Mark Zuckerberg",
    rating: "4.8", reviews: "12,000", students: "50,000", duration: "12 weeks", progress: 85, image: MetaLogo,
    description: "Build robust, dynamic, and responsive web applications using React, Tailwind CSS, and modern JavaScript. Prepare for a career as a Frontend Developer.",
    whatYouWillLearn: ["Understand React Hooks", "Manage global state", "Implement React Router", "Integrate REST APIs"],
    modules: [
      { title: "Module 1-8: React Fundamentals", duration: "15h 00 min", completed: true },
      { title: "Module 9: Advanced Hooks", duration: "2h 30 min", completed: true },
      { title: "Module 10: Routing & Auth", duration: "3h 15 min", completed: false, active: true },
      { title: "Module 11: Deployment", duration: "1h 45 min", completed: false }
    ],
    resources: [{ name: "React_Router_Docs.pdf", size: "1.1 MB" }]
  }
};

function CourseDetail() {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Grab the right course based on the URL, fallback to Game Dev if something breaks
  const course = courseDetailData[courseId] || courseDetailData["game-dev"];

  const fallbackBackPath = location.pathname.startsWith("/instructor")
    ? "/instructor/courses"
    : "/student/courses";

  const handleBack = () => {
    const returnTo = location.state?.from;

    if (typeof returnTo === "string" && returnTo.length > 0) {
      navigate(returnTo);
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallbackBackPath, { replace: true });
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-400">
        <button
          type="button"
          onClick={handleBack}
          className="hover:text-blue-400 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Courses
        </button>
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
                {course.provider}
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
            <div className="relative w-full h-48 bg-white group cursor-pointer flex items-center justify-center border-b border-gray-700">
              <img src={course.image} alt="Course Preview" className="w-2/3 h-2/3 object-contain opacity-90 group-hover:opacity-70 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
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
                <p className="text-gray-500 text-xs mt-2 text-center">Module in progress</p>
              </div>

              {/* Action Button */}
              <Link 
                to={`/student/courses/${course.id}/study`} 
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