import React, { useState } from "react";
import { LayoutDashboard, Home, Users, FileText, Calendar as CalendarIcon, HelpCircle, Menu } from "lucide-react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";

import LoginPage from "./LoginPage";
import ManageUsers from "./ManageUsers";
import Courses from "./Courses";
import Calendar from "./Calendar";
import Help from "./Help";
import Dashboard from "./Dashboard";
import HomePage from "./Home";
import Contact from "./Contact";
import Categories from "./Categories";
import Pages from "./Pages";
import Blog from "./Blog";
import Student from "./Student";


import InstructorLayout from "./Instructor/InstructorLayout";
import InstructorDashboard from "./Instructor/InstructorDashboard";
import CreateCourse from "./Instructor/CreateCourse";
import AddModules from "./Instructor/AddModules";
import LearningMaterials from "./Instructor/LearningMaterials";
import CreateQuiz from "./Instructor/CreateQuiz";
import CoursesList from "./Instructor/CoursesList";

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const isInstructorRoute = location.pathname === "/instructor" || location.pathname.startsWith("/instructor/");

  // Public website routes
  const isPublicRoute = [
    "/", "/Home", "/login", "/student",
    "/categories", "/pages",
    "/blog", "/contact"
  ].includes(location.pathname);

  const handleLogin = (role) => {

    if (role === "admin") {
      setLoggedIn(true);
      navigate("/dashboard");
      return;
    }

    if (role === "instructor") {
      navigate("/instructor");
      return;
    }

    navigate("/student");
  };

  // PUBLIC WEBSITE
  if (isPublicRoute || isInstructorRoute) {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/student" element={<Student />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/pages" element={<Pages />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/student" element={<Student />} />

        <Route path="/instructor" element={<InstructorLayout />}>
          <Route index element={<InstructorDashboard />} />
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="modules" element={<AddModules />} />
          <Route path="materials" element={<LearningMaterials />} />
          <Route path="quiz" element={<CreateQuiz />} />
          <Route path="courses" element={<CoursesList />} />
        </Route>
      </Routes>
    );
  }

  // ADMIN LOGIN CHECK
  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">

      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-20"} bg-[#1f2937] p-6 transition-all duration-300`}>

        {/* Header */}
        <div className="flex justify-between items-center mb-10">

          {sidebarOpen && <h1 className="text-xl font-bold">Admin</h1>}

          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </button>

        </div>

        {/* Navigation */}
        <nav className="space-y-6">

          {/* ADMIN */}
            <Link to="/Home" className="flex items-center gap-3 hover:text-blue-400">
            <Home size={18} />
            {sidebarOpen && "Home"}
          </Link>

          <Link to="/dashboard" className="flex items-center gap-3 hover:text-blue-400">
            <LayoutDashboard size={18} />
            {sidebarOpen && "Dashboard"}
          </Link>

          <Link to="/users" className="flex items-center gap-3 hover:text-blue-400">
            <Users size={18} />
            {sidebarOpen && "Manage Users"}
          </Link>

          <Link to="/courses" className="flex items-center gap-3 hover:text-blue-400">
            <FileText size={18} />
            {sidebarOpen && "Courses"}
          </Link>

          <Link to="/calendar" className="flex items-center gap-3 hover:text-blue-400">
            <CalendarIcon size={18} />
            {sidebarOpen && "Calendar"}
          </Link>

          <Link to="/help" className="flex items-center gap-3 hover:text-blue-400">
            <HelpCircle size={18} />
            {sidebarOpen && "Help"}
          </Link>

        </nav>

      </div>

      {/* Page Content */}
      <div className="flex-1 p-8 w-full">

        <Routes>

          {/* ADMIN */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<ManageUsers />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/help" element={<Help />} />

        </Routes>

      </div>

    </div>
  );
}

export default App;