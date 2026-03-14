import React, { useState } from "react";
import { LayoutDashboard, Home, Users, FileText, Calendar as CalendarIcon, HelpCircle, Menu } from "lucide-react";
import { Routes, Route, Link } from "react-router-dom";

import LoginPage from "./LoginPage";
import ManageUsers from "./ManageUsers";
import Courses from "./Courses";
import Calendar from "./Calendar";
import Help from "./Help";
import Dashboard from "./Dashboard";

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Login check
  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">

      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-20"} bg-[#1f2937] p-6 transition-all duration-300`}>

        {/* Sidebar Header */}
        <div className="flex justify-between items-center mb-10">

          {sidebarOpen && <h1 className="text-xl font-bold">Admin</h1>}

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

          {/* Home Page */}
          <Route path="/" element={<h1 className="text-3xl font-bold">Welcome Home</h1>} />

          {/* Dashboard */}
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