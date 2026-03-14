import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
// Imported LayoutDashboard for the new Dashboard link
import { Home, LayoutDashboard, Menu, BookOpen, Layers } from "lucide-react";

function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">

      {/* The One True Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-20"} bg-[#1f2937] p-6 transition-all duration-300 flex flex-col`}>
        <div className="flex justify-between items-center mb-10">
          {sidebarOpen && <h1 className="text-xl font-bold">Student</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
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

      {/* Main Content Area */}
      <div className="flex-1 p-8 w-full overflow-y-auto">
        <Outlet />
      </div>

    </div>
  );
}

export default StudentLayout;