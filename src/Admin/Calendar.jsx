import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function Calendar() {

  // Load events from localStorage or default events
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("calendarEvents");

    if (saved) {
      return JSON.parse(saved);
    }

    return [
      { title: "React Lecture", date: "2026-03-09" },
      { title: "Cyber Security Lab", date: "2026-03-11" },
      { title: "Networking Exam", date: "2026-03-13" }
    ];
  });

  // Save events whenever they change
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  // Add event when clicking a date
  const handleDateClick = (info) => {
    const title = prompt("Enter event title:");

    if (title) {
      const newEvent = {
        title: title,
        date: info.dateStr
      };

      setEvents([...events, newEvent]);
    }
  };
const handleEventClick = (info) => {
  const confirmDelete = window.confirm(
    `Delete event "${info.event.title}"?`
  );

  if (confirmDelete) {
    const updatedEvents = events.filter(
      (event) =>
        !(event.title === info.event.title && event.date === info.event.startStr)
    );

    setEvents(updatedEvents);
  }
};
  return (
    <div className="w-full">

      <h1 className="text-3xl font-bold mb-2">Calendar</h1>
      

      <div className="flex gap-6">

        {/* Sidebar */}
        <div className="w-64 bg-[#1f2937] p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Events</h2>

          <div className="space-y-3">
            {events.length === 0 && (
              <p className="text-gray-500 text-sm">No events yet. Click a date to add one.</p>
            )}
            {events.map((event, index) => (
              <div key={index} className="bg-blue-900/40 border border-blue-700/50 p-3 rounded-lg">
                <p className="font-semibold text-white text-sm">{event.title}</p>
                <p className="text-xs text-blue-300 mt-0.5">{event.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="flex-1 bg-[#111827] p-6 rounded-xl">

          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay"
            }}
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="auto"
          />

        </div>

      </div>

    </div>
  );
}

export default Calendar;