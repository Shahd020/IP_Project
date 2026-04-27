import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Home, LayoutDashboard, Menu, BookOpen, Layers } from "lucide-react";
import ProfileDropdown from "../components/ProfileDropdown.jsx";

function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white overflow-x-hidden">

      {/* Profile always floats top-right, outside the sidebar */}
      <div className="fixed top-4 right-5 z-[150]">
        <ProfileDropdown />
      </div>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen ${sidebarOpen ? "w-64" : "w-20"} bg-[#1f2937] p-6 transition-all duration-300 flex flex-col`}>
        <div className={`flex items-center mb-10 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {sidebarOpen && <h1 className="text-xl font-bold">Student</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
            <Menu size={20} />
          </button>
        </div>

        <nav className="space-y-6 flex-1">
          
          {/* 1. Main Website Home Page */}
          <Link to="/Home" className={`flex items-center gap-3 hover:text-blue-400 ${location.pathname === '/Home' || location.pathname === '/' ? 'text-blue-400' : ''}`}>
            <Home size={18} />
            {sidebarOpen && "Home"}
          </Link>

          {/* 2. Student Dashboard */}
          <Link to="/student" className={`flex items-center gap-3 hover:text-blue-400 ${location.pathname === '/student' ? 'text-blue-400' : ''}`}>
            <LayoutDashboard size={18} />
            {sidebarOpen && "Dashboard"}
          </Link>

          <Link to="/student/courses" className={`flex items-center gap-3 hover:text-blue-400 ${location.pathname === '/student/courses' ? 'text-blue-400' : ''}`}>
            <BookOpen size={18} />
            {sidebarOpen && "Courses"}
          </Link>

          <Link to="/student/flashcards" className={`flex items-center gap-3 hover:text-blue-400 ${location.pathname === '/student/flashcards' ? 'text-blue-400' : ''}`}>
            <Layers size={18} />
            {sidebarOpen && "Flashcards"}
          </Link>
          
        </nav>
      </div>

      {/* Main Content Area — pr-20 clears the fixed profile button */}
      <div className={`flex-1 min-w-0 px-6 sm:px-8 pt-8 pb-8 pr-20 overflow-y-auto transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <Outlet />
      </div>

    </div>
  );
}

export default StudentLayout;