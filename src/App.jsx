import React, { useState } from "react";
import { Home, Users, FileText, Calendar as CalendarIcon, HelpCircle } from "lucide-react";
import { Routes, Route, Link } from "react-router-dom";
import LoginPage from "./LoginPage";
import ManageUsers from "./ManageUsers";
import Courses from "./Courses";
import Calendar from "./Calendar";
import Help from "./Help";

function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <p className="text-gray-400 mb-8">
        The administrator controls the platform and ensures it functions correctly.
      </p>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-[#1f2937] p-6 rounded-xl">
          <h3 className="text-gray-400">Users</h3>
          <p className="text-2xl font-bold">120</p>
        </div>

        <div className="bg-[#1f2937] p-6 rounded-xl">
          <h3 className="text-gray-400">Courses</h3>
          <p className="text-2xl font-bold">35</p>
        </div>

        <div className="bg-[#1f2937] p-6 rounded-xl">
          <h3 className="text-gray-400">Active Sessions</h3>
          <p className="text-2xl font-bold">18</p>
        </div>
      </div>
    </div>
  );
}

function App() {

  const [loggedIn, setLoggedIn] = useState(false);

  // If user is not logged in → show login page
  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }


  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">

      {/* Sidebar */}
      <div className="w-64 bg-[#111827] p-6 flex flex-col">

        <h1 className="text-xl font-bold mb-8 mt-6">Admin</h1>

        <nav className="space-y-4">

          <Link to="/" className="flex items-center gap-3 hover:text-blue-400">
            <Home size={18} />
            Dashboard
          </Link>

          <Link to="/users" className="flex items-center gap-3 hover:text-blue-400">
            <Users size={18} />
            Manage Users
          </Link>

          <Link to="/courses" className="flex items-center gap-3 hover:text-blue-400">
            <FileText size={18} />
            Courses
          </Link>

          <Link to="/calendar" className="flex items-center gap-3 hover:text-blue-400">
            <CalendarIcon size={18} />
            Calendar
          </Link>

          <Link to="/help" className="flex items-center gap-3 hover:text-blue-400">
            <HelpCircle size={18} />
            Help
          </Link>

        </nav>
      </div>

      {/* Page Content */}
      <div className="flex-1 p-8 w-full">

        <Routes>
          <Route path="/" element={<Dashboard />} />
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