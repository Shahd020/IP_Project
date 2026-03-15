import {
  Users,
  BookOpen,
  ClipboardList,
  Star
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { useState } from "react";

const activityData = [
  { day: "Mon", students: 12 },
  { day: "Tue", students: 18 },
  { day: "Wed", students: 25 },
  { day: "Thu", students: 20 },
  { day: "Fri", students: 28 },
  { day: "Sat", students: 22 }
];

function InstructorDashboard() {

  // Load events from localStorage (calendar starts empty if none exist)
  const [events, setEvents] = useState(() => {
  const savedEvents = localStorage.getItem("calendarEvents");
  return savedEvents ? JSON.parse(savedEvents) : [];
});

  // Add event
  const handleDateClick = (info) => {

    const title = prompt("Enter event title");

    if (title) {

      const newEvent = {
        id: Date.now(),
        title,
        date: info.dateStr
      };

      const updatedEvents = [...events, newEvent];

      setEvents(updatedEvents);

      localStorage.setItem(
        "calendarEvents",
        JSON.stringify(updatedEvents)
      );
    }
  };

  // Delete event
  const handleEventClick = (info) => {

    if (window.confirm("Delete this event?")) {

      const updatedEvents = events.filter(
        (event) => event.id !== Number(info.event.id)
      );

      setEvents(updatedEvents);

      localStorage.setItem(
        "calendarEvents",
        JSON.stringify(updatedEvents)
      );
    }
  };

  // Get today's events
  const today = new Date().toISOString().split("T")[0];

  const todaysEvents = events.filter(
    (event) => event.date === today
  );

  return (
    <div className="p-8 space-y-6">

      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-6">

        <div className="bg-[#1f2937] p-6 rounded-xl">
          <Users className="mb-2 text-blue-400" />
          <h2 className="text-2xl font-bold">320</h2>
          <p className="text-gray-400">Total Students</p>
        </div>

        <div className="bg-[#1f2937] p-6 rounded-xl">
          <BookOpen className="mb-2 text-green-400" />
          <h2 className="text-2xl font-bold">8</h2>
          <p className="text-gray-400">Courses</p>
        </div>

        <div className="bg-[#1f2937] p-6 rounded-xl">
          <ClipboardList className="mb-2 text-purple-400" />
          <h2 className="text-2xl font-bold">15</h2>
          <p className="text-gray-400">Quizzes Created</p>
        </div>

        <div className="bg-[#1f2937] p-6 rounded-xl">
          <Star className="mb-2 text-yellow-400" />
          <h2 className="text-2xl font-bold">4.7</h2>
          <p className="text-gray-400">Average Rating</p>
        </div>

      </div>


      {/* Top Widgets */}
      <div className="grid grid-cols-3 gap-6">

        {/* Calendar */}
        <div className="col-span-2 bg-[#1f2937] p-6 rounded-xl">

          <h2 className="text-lg font-semibold mb-4 text-white">
            Calendar
          </h2>

          <div className="bg-[#1f2937] p-4 rounded-lg">

            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              height="450px"
              events={events}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay"
              }}
            />

          </div>

        </div>


        {/* Today's Schedule */}
        <div className="bg-[#1f2937] p-6 rounded-xl">

          <h2 className="text-lg font-semibold mb-4">
            Today's Schedule
          </h2>

          <div className="space-y-3">

            {todaysEvents.length === 0 ? (
              <p className="text-gray-400">
                No events today
              </p>
            ) : (
              todaysEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex justify-between"
                >
                  <span className="text-blue-400">
                    {event.title}
                  </span>
                  <span className="text-gray-400">
                    Today
                  </span>
                </div>
              ))
            )}

          </div>

        </div>

      </div>


      {/* Learning Progress */}
<div className="col-span-3 bg-[#1f2937] p-6 rounded-xl flex flex-col justify-center">

  <h2 className="text-lg font-semibold mb-6">
    Learning Progress
  </h2>

  <div className="flex items-center justify-between">

    <div className="space-y-2">
      <p className="text-blue-400">10 / 75 Completed</p>
      <p className="text-cyan-400">45 / 75 In Progress</p>
      <p className="text-gray-400">20 / 75 Not Started</p>
    </div>

    {/* Progress Circles */}
    <div className="flex items-center justify-end">

      <div className="relative w-40 h-40">

        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-[10px] border-gray-700"></div>
        <div
          className="absolute inset-0 rounded-full border-[10px] border-blue-500"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)"
          }}
        ></div>

        {/* Middle Ring */}
        <div className="absolute inset-5 rounded-full border-[10px] border-gray-700"></div>
        <div
          className="absolute inset-5 rounded-full border-[10px] border-cyan-400"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)"
          }}
        ></div>

        {/* Inner Ring */}
        <div className="absolute inset-10 rounded-full border-[10px] border-gray-700"></div>
        <div
          className="absolute inset-10 rounded-full border-[10px] border-blue-300"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)"
          }}
        ></div>

      </div>

    </div>

  </div>

</div>



      {/* Middle Section */}
      <div className="grid grid-cols-3 gap-6">

        {/* Course Activity */}
        <div className="col-span-2 bg-[#1f2937] p-6 rounded-xl">

          <h2 className="text-lg font-semibold mb-4">
            Course Activity
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span>React Development</span>
              <span className="text-green-400">120 Students</span>
            </div>

            <div className="flex justify-between">
              <span>Artificial Intelligence</span>
              <span className="text-green-400">80 Students</span>
            </div>

            <div className="flex justify-between">
              <span>Data Structures</span>
              <span className="text-green-400">65 Students</span>
            </div>

          </div>

        </div>


        {/* New Students */}
        <div className="bg-[#1f2937] p-6 rounded-xl">

          <h2 className="text-lg font-semibold mb-4">
            New Students Today
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span>Sarah Ahmed</span>
              <span className="text-gray-400">React</span>
            </div>

            <div className="flex justify-between">
              <span>Mohamed Ali</span>
              <span className="text-gray-400">AI</span>
            </div>

            <div className="flex justify-between">
              <span>Sara Tarek</span>
              <span className="text-gray-400">Data Structures</span>
            </div>

            <div className="flex justify-between">
              <span>John Mark</span>
              <span className="text-gray-400">Java</span>
            </div>

          </div>

        </div>

      </div>


      {/* Bottom Section */}
      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-2 bg-[#1f2937] p-8 rounded-xl h-[260px]">

          <h2 className="text-lg font-semibold mb-4">
            Weekly Student Activity
          </h2>

          <ResponsiveContainer width="100%" height="100%">

            <BarChart data={activityData}>

              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "none",
                  color: "white"
                }}
              />

              <Bar
                dataKey="students"
                fill="#3b82f6"
                radius={[6,6,0,0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}

export default InstructorDashboard;