import { Users, BookOpen, ClipboardList, Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";
import useInstructorCourses from "../hooks/useInstructorCourses";
import useAuth from "../hooks/useAuth";

// Weekly activity data stays static — a real analytics table is out of scope here
const activityData = [
  { day: "Mon", students: 12 },
  { day: "Tue", students: 18 },
  { day: "Wed", students: 25 },
  { day: "Thu", students: 20 },
  { day: "Fri", students: 28 },
  { day: "Sat", students: 22 },
];

function InstructorDashboard() {
  const { user } = useAuth();
  const { courses, loading } = useInstructorCourses();

  // Derive stats from live course data
  const totalStudents = courses.reduce((sum, c) => sum + (c.enrollmentCount ?? 0), 0);
  const publishedCourses = courses.filter((c) => c.status === "published").length;
  const avgRating = courses.length > 0
    ? (courses.reduce((sum, c) => sum + (c.rating ?? 0), 0) / courses.length).toFixed(1)
    : "—";

  // Top courses by enrollment
  const topCourses = [...courses]
    .sort((a, b) => (b.enrollmentCount ?? 0) - (a.enrollmentCount ?? 0))
    .slice(0, 5);

  // Calendar (localStorage-persisted)
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("calendarEvents");
    return saved ? JSON.parse(saved) : [];
  });

  const handleDateClick = (info) => {
    const title = prompt("Enter event title");
    if (title) {
      const newEvent = { id: Date.now(), title, date: info.dateStr };
      const updated = [...events, newEvent];
      setEvents(updated);
      localStorage.setItem("calendarEvents", JSON.stringify(updated));
    }
  };

  const handleEventClick = (info) => {
    if (window.confirm("Delete this event?")) {
      const updated = events.filter((e) => e.id !== Number(info.event.id));
      setEvents(updated);
      localStorage.setItem("calendarEvents", JSON.stringify(updated));
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const todaysEvents = events.filter((e) => e.date === today);

  return (
    <div className="p-8 space-y-6">

      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-[#1f2937] p-6 rounded-xl">
          <Users className="mb-2 text-blue-400" />
          <h2 className="text-2xl font-bold">{loading ? "…" : totalStudents}</h2>
          <p className="text-gray-400">Total Students</p>
        </div>
        <div className="bg-[#1f2937] p-6 rounded-xl">
          <BookOpen className="mb-2 text-green-400" />
          <h2 className="text-2xl font-bold">{loading ? "…" : publishedCourses}</h2>
          <p className="text-gray-400">Published Courses</p>
        </div>
        <div className="bg-[#1f2937] p-6 rounded-xl">
          <ClipboardList className="mb-2 text-purple-400" />
          <h2 className="text-2xl font-bold">{loading ? "…" : courses.length}</h2>
          <p className="text-gray-400">Total Courses</p>
        </div>
        <div className="bg-[#1f2937] p-6 rounded-xl">
          <Star className="mb-2 text-yellow-400" />
          <h2 className="text-2xl font-bold">{loading ? "…" : avgRating}</h2>
          <p className="text-gray-400">Average Rating</p>
        </div>
      </div>

      {/* Calendar + Today's Schedule */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#1f2937] p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4 text-white">Calendar</h2>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="450px"
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
          />
        </div>

        <div className="bg-[#1f2937] p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
          <div className="space-y-3">
            {todaysEvents.length === 0 ? (
              <p className="text-gray-400">No events today</p>
            ) : (
              todaysEvents.map((event) => (
                <div key={event.id} className="flex justify-between">
                  <span className="text-blue-400">{event.title}</span>
                  <span className="text-gray-400">Today</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Courses by Enrollment */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#1f2937] p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Course Activity</h2>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading…</p>
          ) : topCourses.length === 0 ? (
            <p className="text-gray-400 text-sm">No courses yet.</p>
          ) : (
            <div className="space-y-4">
              {topCourses.map((course) => (
                <div key={course._id} className="flex justify-between">
                  <span className="text-gray-200 truncate max-w-xs">{course.title}</span>
                  <span className="text-green-400 shrink-0 ml-4">{course.enrollmentCount ?? 0} Students</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#1f2937] p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Welcome</h2>
          <p className="text-gray-300 text-lg font-semibold">{user?.name ?? "Instructor"}</p>
          <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
          <p className="text-gray-500 text-xs mt-3 capitalize">{user?.role}</p>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#1f2937] p-8 rounded-xl h-[260px]">
          <h2 className="text-lg font-semibold mb-4">Weekly Student Activity</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData}>
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "none", color: "white" }} />
              <Bar dataKey="students" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

export default InstructorDashboard;
