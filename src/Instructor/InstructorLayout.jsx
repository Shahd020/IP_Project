import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  LayoutDashboard,
  BookOpen,
  Folder,
  FileText,
  ClipboardList,
  Menu
} from "lucide-react";

function InstructorLayout() {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="bg-[#0f172a] min-h-screen text-white">

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen ${
          sidebarOpen ? "w-64" : "w-20"
        } bg-[#1f2937] p-6 transition-all duration-300`}
      >

        {/* Header */}
        <div className="flex justify-between items-center mb-10">

          {sidebarOpen && (
            <h1 className="text-xl font-bold">
              Instructor
            </h1>
          )}

          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </button>

        </div>

        {/* Navigation */}
        <nav className="space-y-6">

          <Link to="/" className="flex items-center gap-3 hover:text-blue-400">
            <Home size={18} />
            {sidebarOpen && "Home"}
          </Link>

          <Link to="/instructor" className="flex items-center gap-3 hover:text-blue-400">
            <LayoutDashboard size={18} />
            {sidebarOpen && "Dashboard"}
          </Link>

          <Link to="/instructor/create-course" className="flex items-center gap-3 hover:text-blue-400">
            <BookOpen size={18} />
            {sidebarOpen && "Create Course"}
          </Link>

          <Link to="/instructor/materials" className="flex items-center gap-3 hover:text-blue-400">
            <FileText size={18} />
            {sidebarOpen && "Materials"}
          </Link>

          <Link to="/instructor/quiz" className="flex items-center gap-3 hover:text-blue-400">
            <ClipboardList size={18} />
            {sidebarOpen && "Quiz"}
          </Link>

          <Link to="/instructor/courses" className="flex items-center gap-3 hover:text-blue-400">
            <BookOpen size={18} />
            {sidebarOpen && "My Courses"}
          </Link>

        </nav>

      </div>

      {/* Page Content */}
      <div
        className={`transition-all duration-300 p-10 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <Outlet />
      </div>

    </div>
  );
}

export default InstructorLayout;