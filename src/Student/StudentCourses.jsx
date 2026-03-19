import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import { ArrowRight, Play, CheckCircle } from "lucide-react"; 

import StanfordLogo from '../assets/Logos/Standford.webp';
import AmazonLogo from '../assets/Logos/Amazon.jpeg';
import MetaLogo from '../assets/Logos/Meta.jpeg';
import GoogleLogo from '../assets/Logos/google.jpeg';
import HarvardLogo from '../assets/Logos/Harvard.webp';
import AILogo from '../assets/Logos/AI.webp';

function StudentCourses() {
  const [activeTab, setActiveTab] = useState("in-progress");

  const courses = [
    // --- IN PROGRESS (4 Courses) ---
    {
      id: "cyber-security", // <-- ADDED ID
      title: "Cyber Security & Cryptography",
      provider: "Stanford University",
      duration: "10 weeks",
      rating: "4.7 ⭐",
      image: StanfordLogo,
      progressPercent: 70,
      progressText: "7/10 Weeks",
      status: "in-progress"
    },
    {
      id: "cloud-computing", // <-- ADDED ID
      title: "Cloud Computing",
      provider: "Amazon Web Services",
      duration: "6 weeks",
      rating: "4.6 ⭐",
      image: AmazonLogo,
      progressPercent: 33,
      progressText: "2/6 Weeks",
      status: "in-progress"
    },
    {
      id: "game-dev", // <-- ADDED ID
      title: "2D Game Dev with Unity",
      provider: "Harvard University",
      duration: "8 weeks",
      rating: "4.9 ⭐",
      image: HarvardLogo,
      progressPercent: 45,
      progressText: "Module 4",
      status: "in-progress"
    },
    {
      id: "react", // <-- ADDED ID
      title: "Internet Programming with React",
      provider: "Meta",
      duration: "12 weeks",
      rating: "4.8 ⭐",
      image: MetaLogo,
      progressPercent: 85,
      progressText: "Module 10",
      status: "in-progress"
    },

    // --- COMPLETED (12 Courses) ---
    { title: "UI/UX Design Fundamentals", provider: "Meta", duration: "5 weeks", rating: "4.8 ⭐", image: MetaLogo, progressPercent: 100, progressText: "Finished", status: "completed" },
    { title: "Software Engineering", provider: "Google", duration: "8 weeks", rating: "4.7 ⭐", image: GoogleLogo, progressPercent: 100, progressText: "Finished", status: "completed" },
    { title: "Object-Oriented Design (OOD)", provider: "Stanford University", duration: "6 weeks", rating: "4.9 ⭐", image: StanfordLogo, progressPercent: 100, progressText: "Finished", status: "completed" },
    { title: "Data Structures & Algorithms", provider: "Harvard University", duration: "10 weeks", rating: "4.6 ⭐", image: HarvardLogo, progressPercent: 100, progressText: "Finished", status: "completed" },
    { title: "Intro to Artificial Intelligence", provider: "MIT", duration: "12 weeks", rating: "4.9 ⭐", image: AILogo, progressPercent: 100, progressText: "Finished", status: "completed" },
    { title: "Operations Research", provider: "Stanford University", duration: "6 weeks", rating: "4.5 ⭐", image: StanfordLogo, progressPercent: 100, progressText: "Finished", status: "completed" },
    { title: "Java Programming Basics", provider: "Google", duration: "4 weeks", rating: "4.8 ⭐", image: GoogleLogo, progressPercent: 100, progressText: "Finished", status: "completed" },
    { title: "Software Project Management", provider: "Meta", duration: "5 weeks", rating: "4.7 ⭐", image: MetaLogo, progressPercent: 100, progressText: "Finished", status: "completed" },
    { title: "Game Cutscene Design", provider: "Harvard University", duration: "3 weeks", rating: "4.9 ⭐", image: HarvardLogo, progressPercent: 100, progressText: "Finished", status: "completed" },
    { title: "Sprite Sheet Creation", provider: "MIT", duration: "2 weeks", rating: "4.6 ⭐", image: AILogo, progressPercent: 100, progressText: "Finished", status: "completed" },
    { title: "Operating Systems", provider: "Amazon Web Services", duration: "10 weeks", rating: "4.5 ⭐", image: AmazonLogo, progressPercent: 100, progressText: "Finished", status: "completed" },
    { title: "Supply Chain Tracking Systems", provider: "Amazon Web Services", duration: "4 weeks", rating: "4.8 ⭐", image: AmazonLogo, progressPercent: 100, progressText: "Finished", status: "completed" },

    // --- SAVED / NOT STARTED (3 Courses) ---
    { title: "Advanced Machine Learning", provider: "MIT", duration: "12 weeks", rating: "4.9 ⭐", image: AILogo, progressPercent: 0, progressText: "Not Started", status: "saved" },
    { title: "3D Modeling for Games", provider: "Meta", duration: "8 weeks", rating: "4.8 ⭐", image: MetaLogo, progressPercent: 0, progressText: "Not Started", status: "saved" },
    { title: "Blockchain Architecture", provider: "Stanford University", duration: "6 weeks", rating: "4.7 ⭐", image: StanfordLogo, progressPercent: 0, progressText: "Not Started", status: "saved" }
  ];

  const filteredCourses = courses.filter(course => course.status === activeTab);
  
  // Passed courseId into this function to make the link dynamic!
  const renderCardButton = (status, courseId) => {
    if (status === "completed") {
      return (
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors duration-200 shadow-md">
          Review Course
          <CheckCircle size={16} />
        </button>
      );
    } else if (status === "saved") {
      return (
        <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors duration-200 shadow-md">
          Start Course
          <Play size={16} fill="currentColor" />
        </button>
      );
    } else {
      return (
        <Link 
          to={`/student/courses/${courseId || 'game-dev'}`} // <-- DYNAMIC LINK!
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors duration-200 shadow-md"
        >
          Continue
          <ArrowRight size={16} />
        </Link>
      );
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      {/* Tabs Navigation */}
      <div className="flex gap-6 mb-8 border-b border-gray-700">
        <button 
          onClick={() => setActiveTab("in-progress")}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === "in-progress" ? "border-blue-500 text-blue-400" : "border-transparent text-gray-400 hover:text-gray-200"}`}
        >
          In Progress
        </button>
        <button 
          onClick={() => setActiveTab("completed")}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === "completed" ? "border-purple-500 text-purple-400" : "border-transparent text-gray-400 hover:text-gray-200"}`}
        >
          Completed
        </button>
        <button 
          onClick={() => setActiveTab("saved")}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === "saved" ? "border-green-500 text-green-400" : "border-transparent text-gray-400 hover:text-gray-200"}`}
        >
          Saved / Not Started
        </button>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-3 gap-8">
        {filteredCourses.map((course, index) => (
          <div
            key={index}
            className="bg-[#1f2937] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 flex flex-col justify-between"
          >
            <div className="flex flex-col flex-1">
              <img src={course.image} alt={course.title} className="w-full h-40 object-cover" />
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{course.provider}</p>
                <div className="flex justify-between text-sm text-gray-300 mb-6">
                  <span>{course.duration}</span>
                  <span>{course.rating}</span>
                </div>
                
                <div className="mt-auto">
                  <div className="flex justify-between items-end text-sm mb-2">
                    <span className="text-gray-400 font-medium">Progress</span>
                    <div className="text-right">
                      <span className="text-white font-bold">{course.progressPercent}%</span>
                      <span className="text-gray-400 text-xs ml-2">({course.progressText})</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        course.status === 'completed' ? 'bg-purple-500' : 
                        course.status === 'saved' ? 'bg-gray-500' : 'bg-blue-500'
                      }`} 
                      style={{ width: `${course.progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 p-5 flex justify-between items-center mt-auto bg-[#1a2332]">
              <span className="text-gray-400 font-bold text-sm tracking-widest uppercase">
                {course.status === 'saved' ? 'Wishlist' : 'Enrolled In'}
              </span>
              
              {/* Passed the ID down so it links to the right place */}
              {renderCardButton(course.status, course.id)}

            </div>

          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-20 bg-[#1f2937] rounded-xl border border-gray-800">
          <p className="text-gray-400 text-lg">No courses found in this category.</p>
        </div>
      )}

    </div>
  );
}

export default StudentCourses;