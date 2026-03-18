
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
import CourseCatalog from "./CourseCatalog";
import CourseOverview from "./CourseOverview";

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

/* NEW IMPORT FOR PREVIEW */
import CoursePreview from "./Instructor/CoursePreview";

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const isInstructorRoute =
    location.pathname === "/instructor" ||
    location.pathname.startsWith("/instructor/");

  const isPublicRoute =
    [
      "/",
      "/Home",
      "/login",
      "/categories",
      "/pages",
      "/blog",
      "/contact"
    ].includes(location.pathname) ||
    location.pathname.startsWith("/student");

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

  if (isPublicRoute || isInstructorRoute) {
    return (
      <Routes>

        {/* PUBLIC WEBSITE */}
        <Route path="/" element={<HomePage />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/catalog" element={<CourseCatalog />} />
        <Route path="/course/:courseId" element={<CourseOverview />} />
        <Route path="/pages" element={<Pages />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />

        {/* STUDENT ROUTES */}
        <Route path="/student" element={<StudentLayout />}>

          <Route index element={<Student />} />

          <Route path="courses" element={<StudentCourses />} />

          <Route path="courses/:courseId" element={<CourseDetail />} />

          <Route path="courses/:courseId/study" element={<CourseStudy />} />

          <Route path="flashcards" element={<Flashcards />} />

        </Route>

        {/* INSTRUCTOR ROUTES */}
        <Route path="/instructor" element={<InstructorLayout />}>

          <Route index element={<InstructorDashboard />} />

          <Route path="create-course" element={<CreateCourse />} />

          <Route path="modules" element={<AddModules />} />

          <Route path="materials" element={<LearningMaterials />} />

          <Route path="quiz" element={<CreateQuiz />} />

          <Route path="courses" element={<CoursesList />} />

          {/* NEW PREVIEW PAGE */}
          <Route path="courses/:courseId" element={<CoursePreview />} />
               <Route path="courses/:courseId/preview" element={<CourseDetail />} />

        </Route>

      </Routes>
    );
  }

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">

      <div
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-[#1f2937] p-6 transition-all duration-300`}
      >

        <div className="flex justify-between items-center mb-10">
          {sidebarOpen && <h1 className="text-xl font-bold">Admin</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </button>
        </div>

        <nav className="space-y-6">

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

      <div className="flex-1 p-8 w-full">

        <Routes>
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