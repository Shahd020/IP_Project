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

const activityData = [
  { day: "Mon", students: 12 },
  { day: "Tue", students: 18 },
  { day: "Wed", students: 25 },
  { day: "Thu", students: 20 },
  { day: "Fri", students: 28 },
  { day: "Sat", students: 22 }
];

function InstructorDashboard() {
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

        {/* Weekly Activity Chart */}
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
                radius={[6, 6, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* Instructor Schedule */}
        <div className="bg-[#1f2937] p-6 rounded-xl">

          <h2 className="text-lg font-semibold mb-4">
            Today's Schedule
          </h2>

          <div className="space-y-3">

            <div className="flex justify-between">
              <span>10:00</span>
              <span>React Lecture</span>
            </div>

            <div className="flex justify-between">
              <span>12:00</span>
              <span>Quiz Review</span>
            </div>

            <div className="flex justify-between">
              <span>14:00</span>
              <span>Student Meeting</span>
            </div>

            <div className="flex justify-between">
              <span>16:00</span>
              <span>Upload Materials</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default InstructorDashboard;