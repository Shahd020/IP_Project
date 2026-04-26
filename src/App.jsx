import React, { useState } from "react";
import useAuth from "./hooks/useAuth";
import { LayoutDashboard, Home, Users, FileText, Calendar as CalendarIcon, HelpCircle, Menu } from "lucide-react";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";

import LoginPage from "./LoginPage";
import ManageUsers from "./Admin/ManageUsers";
import Courses from "./Admin/Courses";
import Calendar from "./Admin/Calendar";
import Help from "./Admin/Help";
import Dashboard from "./Admin/Dashboard";
import HomePage from "./HomePage/Home";
import Contact from "./HomePage/Contact";
import Categories from "./HomePage/Categories";
import Pages from "./HomePage/Pages";
import Blog from "./HomePage/Blog";
import CourseCatalog from "./HomePage/CourseCatalogPage";
import CourseOverview from "./HomePage/CourseCatalog";

/* STUDENT */
import StudentLayout from "./Student/StudentLayout";
import Student from "./Student/Student";
import StudentCourses from "./Student/StudentCourses";
import CourseDetail from "./Student/CourseDetail";
import CourseStudy from "./Student/CourseStudy";
import Flashcards from "./Student/Flashcards";

/* INSTRUCTOR */
import InstructorLayout from "./Instructor/InstructorLayout";
import InstructorDashboard from "./Instructor/InstructorDashboard";
import CreateCourse from "./Instructor/CreateCourse";
import AddModules from "./Instructor/AddModules";
import LearningMaterials from "./Instructor/LearningMaterials";
import CreateQuiz from "./Instructor/CreateQuiz";
import CoursesList from "./Instructor/CoursesList";
import CoursePreview from "./Instructor/CoursePreview";

import PrivateRoute from "./components/PrivateRoute";

// Admin sidebar shell — wraps the admin-only pages
function AdminShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">
      <div className={`fixed top-0 left-0 h-screen ${sidebarOpen ? "w-64" : "w-20"} bg-[#1f2937] p-6 transition-all duration-300`}>
        <div className="flex justify-between items-center mb-10">
          {sidebarOpen && <h1 className="text-xl font-bold">Admin</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={20} /></button>
        </div>
        <nav className="space-y-6">
          <Link to="/Home"      className="flex items-center gap-3 hover:text-blue-400"><Home size={18} />{sidebarOpen && "Home"}</Link>
          <Link to="/dashboard" className="flex items-center gap-3 hover:text-blue-400"><LayoutDashboard size={18} />{sidebarOpen && "Dashboard"}</Link>
          <Link to="/users"     className="flex items-center gap-3 hover:text-blue-400"><Users size={18} />{sidebarOpen && "Manage Users"}</Link>
          <Link to="/courses"   className="flex items-center gap-3 hover:text-blue-400"><FileText size={18} />{sidebarOpen && "Courses"}</Link>
          <Link to="/calendar"  className="flex items-center gap-3 hover:text-blue-400"><CalendarIcon size={18} />{sidebarOpen && "Calendar"}</Link>
          <Link to="/help"      className="flex items-center gap-3 hover:text-blue-400"><HelpCircle size={18} />{sidebarOpen && "Help"}</Link>
        </nav>
      </div>
      <div className={`flex-1 min-w-0 p-8 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    if (role === "admin")      { navigate("/dashboard");  return; }
    if (role === "instructor") { navigate("/instructor"); return; }
    navigate("/student");
  };

  return (
    <Routes>

      {/* ── Public routes ────────────────────────────────────────── */}
      <Route path="/"           element={<HomePage />} />
      <Route path="/Home"       element={<HomePage />} />
      <Route path="/login"      element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/catalog"    element={<CourseCatalog />} />
      <Route path="/course/:courseId" element={<CourseOverview />} />
      <Route path="/pages"      element={<Pages />} />
      <Route path="/blog"       element={<Blog />} />
      <Route path="/contact"    element={<Contact />} />

      {/* ── Student routes ───────────────────────────────────────── */}
      <Route element={<PrivateRoute roles={["student"]} />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index                              element={<Student />} />
          <Route path="courses"                     element={<StudentCourses />} />
          <Route path="courses/:courseId"           element={<CourseDetail />} />
          <Route path="courses/:courseId/study"     element={<CourseStudy />} />
          <Route path="flashcards"                  element={<Flashcards />} />
        </Route>
      </Route>

      {/* ── Instructor routes ────────────────────────────────────── */}
      <Route element={<PrivateRoute roles={["instructor", "admin"]} />}>
        <Route path="/instructor" element={<InstructorLayout />}>
          <Route index                              element={<InstructorDashboard />} />
          <Route path="create-course"               element={<CreateCourse />} />
          <Route path="modules"                     element={<AddModules />} />
          <Route path="materials"                   element={<LearningMaterials />} />
          <Route path="quiz"                        element={<CreateQuiz />} />
          <Route path="courses"                     element={<CoursesList />} />
          <Route path="courses/:courseId"           element={<CoursePreview />} />
          <Route path="courses/:courseId/preview"   element={<CourseDetail />} />
        </Route>
      </Route>

      {/* ── Admin routes ─────────────────────────────────────────── */}
      <Route element={<PrivateRoute roles={["admin"]} />}>
        <Route element={<AdminShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users"     element={<ManageUsers />} />
          <Route path="/courses"   element={<Courses />} />
          <Route path="/calendar"  element={<Calendar />} />
          <Route path="/help"      element={<Help />} />
        </Route>
      </Route>

    </Routes>
  );
}

export default App;
