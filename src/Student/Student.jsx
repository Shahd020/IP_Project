import React, { useState } from "react";
import { BookOpen, Award, Clock, TrendingUp, ChevronLeft, ChevronRight, Calendar as CalendarIcon, AlertCircle } from "lucide-react";

function Student() {
  const stats = [
    { 
      title: "Enrolled Courses", 
      value: "4", 
      trend: "Active this term", 
      icon: BookOpen, 
      color: "text-blue-400", 
      bgColor: "bg-blue-400/10" 
    },
    { 
      title: "Completed Courses", 
      value: "12", 
      trend: "All time", 
      icon: Award, 
      color: "text-purple-400", 
      bgColor: "bg-purple-400/10" 
    },
    { 
      title: "Study Hours", 
      value: "34h", 
      trend: "This week", 
      icon: Clock, 
      color: "text-green-400", 
      bgColor: "bg-green-400/10" 
    },
    { 
      title: "Overall Progress", 
      value: "68%", 
      trend: "+5% this week", 
      icon: TrendingUp, 
      color: "text-orange-400", 
      bgColor: "bg-orange-400/10" 
    },
  ];

  // --- DYNAMIC CALENDAR LOGIC ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ day: daysInPrevMonth - firstDayOfMonth + i + 1, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, isCurrentMonth: true });
  }
  const totalCells = calendarDays.length > 35 ? 42 : 35;
  const remainingDays = totalCells - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({ day: i, isCurrentMonth: false });
  }

  // Events tied directly to your active enrolled courses!
  const upcomingDeadlines = [
    { day: 12, title: "React Vite Website Final", course: "Internet Programming", color: "text-blue-400", bgColor: "bg-blue-500/20", borderColor: "border-blue-500/30" },
    { day: 18, title: "Aira Sprite Sheet Submission", course: "2D Game Dev with Unity", color: "text-purple-400", bgColor: "bg-purple-500/20", borderColor: "border-purple-500/30" },
    { day: 24, title: "Cryptography Security Lab", course: "Cyber Security", color: "text-red-400", bgColor: "bg-red-500/20", borderColor: "border-red-500/30" },
    { day: 28, title: "Cloud Deployment Project", course: "Cloud Computing", color: "text-orange-400", bgColor: "bg-orange-500/20", borderColor: "border-orange-500/30" }
  ];

  const getEventForDay = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return null;
    return upcomingDeadlines.find(deadline => deadline.day === day) || null;
  };

  return (
    <div>
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
        <p className="text-gray-400">Welcome back, Cookie! Here is your learning overview.</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-[#1f2937] p-6 rounded-xl shadow-lg border border-gray-800 flex items-center gap-5 hover:border-gray-700 transition-colors"
            >
              <div className={`p-4 rounded-xl ${stat.bgColor} ${stat.color}`}>
                <Icon size={28} />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Bottom Row: Calendar & Deadlines (3 Column Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Compact Calendar (Spans 1 column out of 3) */}
        <div className="lg:col-span-1 bg-[#1f2937] p-5 rounded-xl shadow-lg border border-gray-800 flex flex-col">
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">Calendar</h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="text-gray-400 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 p-1 rounded-lg">
                <ChevronLeft size={16} />
              </button>
              <span className="text-gray-200 text-sm font-semibold w-24 text-center">
                {monthNames[month]} {year}
              </span>
              <button onClick={nextMonth} className="text-gray-400 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 p-1 rounded-lg">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-center text-gray-500 text-[10px] font-semibold py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 flex-1">
            {calendarDays.map((item, index) => {
              const isToday = item.day === today.getDate() && item.isCurrentMonth && month === today.getMonth() && year === today.getFullYear();
              const event = getEventForDay(item.day, item.isCurrentMonth);

              return (
                <div 
                  key={index} 
                  className={`p-1 min-h-[45px] flex flex-col items-center justify-start rounded-md border transition-colors ${
                    item.isCurrentMonth ? 'bg-[#1a2332] border-gray-800 hover:border-gray-600' : 'bg-transparent border-transparent opacity-30'
                  } ${isToday ? 'ring-1 ring-blue-500 bg-blue-900/10' : ''}`}
                >
                  <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-medium mb-0.5 ${
                    isToday ? 'bg-blue-600 text-white shadow-sm' : item.isCurrentMonth ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {item.day}
                  </span>
                  
                  {event && (
                    <div className={`w-full h-1.5 rounded-full mt-auto mb-1 ${event.color.replace('text-', 'bg-')}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Upcoming Deadlines List (Spans 2 columns out of 3) */}
        <div className="lg:col-span-2 bg-[#1f2937] p-6 rounded-xl shadow-lg border border-gray-800 flex flex-col">
           <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-4">
             <CalendarIcon className="text-blue-400" size={24} />
             <h2 className="text-xl font-bold text-white">Upcoming Deadlines</h2>
           </div>

           <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2">
              {upcomingDeadlines.map((deadline, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-4 rounded-xl border ${deadline.borderColor} ${deadline.bgColor} bg-opacity-30 transition-transform hover:-translate-y-1`}
                >
                  <div className="flex items-center gap-4">
                    {/* Date Block */}
                    <div className={`flex flex-col items-center justify-center min-w-[60px] h-[60px] rounded-lg bg-[#1a2332] border border-gray-700 shadow-inner`}>
                      <span className="text-xs text-gray-400 font-semibold uppercase">{monthNames[month].substring(0, 3)}</span>
                      <span className={`text-xl font-bold ${deadline.color}`}>{deadline.day}</span>
                    </div>
                    
                    {/* Event Info */}
                    <div>
                      <h3 className="text-white font-bold text-lg">{deadline.title}</h3>
                      <p className="text-sm font-medium text-gray-400">{deadline.course}</p>
                    </div>
                  </div>

                  <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors">
                    <AlertCircle size={20} />
                  </button>
                </div>
              ))}
           </div>
        </div>

      </div>

    </div>
  );
}

export default Student;