import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart, 
  Pie, 
  Cell
} from "recharts";

const mobileData = [
  { name: "Mobile", value: 6098 },
  { name: "Desktop", value: 3902 }
];

const COLORS = ["#7c3aed", "#374151"];
const trafficData = [
  { name: "Jan", organic: 300, direct: 200, referral: 100 },
  { name: "Feb", organic: 400, direct: 300, referral: 150 },
  { name: "Mar", organic: 350, direct: 320, referral: 200 },
  { name: "Apr", organic: 500, direct: 420, referral: 250 },
  { name: "May", organic: 450, direct: 390, referral: 230 },
  { name: "Jun", organic: 600, direct: 520, referral: 300 }
];
const data = [
  { month: "Jan", users: 20 },
  { month: "Feb", users: 40 },
  { month: "Mar", users: 60 },
  { month: "Apr", users: 80 },
  { month: "May", users: 100 },
  { month: "Jun", users: 120 }
];

function Dashboard() {
  const totalSessions = mobileData.reduce((sum, item) => sum + item.value, 0);
const mobilePercent = Math.round((mobileData[0].value / totalSessions) * 100);
  return (
   <div className="w-full p-8 min-h-screen">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      {/* Cards */}
    
      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-[#1f2937] p-6 rounded-xl">
          <p className="text-gray-400">Users</p>
          <h2 className="text-3xl font-bold">120</h2>
        </div>

        <div className="bg-[#1f2937] p-6 rounded-xl">
          <p className="text-gray-400">Courses</p>
          <h2 className="text-3xl font-bold">35</h2>
        </div>

        <div className="bg-[#1f2937] p-6 rounded-xl">
          <p className="text-gray-400">Active Sessions</p>
          <h2 className="text-3xl font-bold">18</h2>
        </div>

      </div>

  <div className="grid grid-cols-3 gap-6 mb-10">


  {/* Total Revenue */}
  <div className="bg-[#1f2937] p-6 rounded-xl">
    <p className="text-gray-400">Total Revenue</p>
    <h2 className="text-3xl font-bold">$99,560</h2>
    <span className="text-green-400 text-sm">+2.8%</span>
  </div>

  {/* Total Visitors */}
  <div className="bg-[#1f2937] p-6 rounded-xl">
    <p className="text-gray-400">Total Visitors</p>
    <h2 className="text-3xl font-bold">45,600</h2>
    <span className="text-red-400 text-sm">-0.5%</span>
  </div>

  {/* Net Profit */}
  <div className="bg-[#1f2937] p-6 rounded-xl">
    <p className="text-gray-400">Net Profit</p>
    <h2 className="text-3xl font-bold">$60,450</h2>
    <span className="text-green-400 text-sm">+1.8%</span>
  </div>

</div>
  <div className="grid grid-cols-3 gap-6 mt-10">

  {/* Performance Statistics */}
  <div className="bg-[#1f2937] text-white p-6 rounded-xl shadow-lg">

    <div className="flex justify-between items-center mb-6">
      <h2 className="font-semibold text-lg">Performance Statistics</h2>
     
    </div>

    {/* Developer */}
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span>Developer Team</span>
        <span>65%</span>
      </div>
      <div className="w-full bg-gray-600 rounded-full h-2">
        <div className="bg-orange-400 h-2 rounded-full w-[65%]"></div>
      </div>
    </div>

    {/* Design */}
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span>Design Team</span>
        <span>84%</span>
      </div>
      <div className="w-full bg-gray-600 rounded-full h-2">
        <div className="bg-blue-500 h-2 rounded-full w-[84%]"></div>
      </div>
    </div>

    {/* Marketing */}
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span>Marketing Team</span>
        <span>28%</span>
      </div>
      <div className="w-full bg-gray-600 rounded-full h-2">
        <div className="bg-green-500 h-2 rounded-full w-[28%]"></div>
      </div>
    </div>

    {/* Management */}
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>Management Team</span>
        <span>18%</span>
      </div>
      <div className="w-full bg-gray-600 rounded-full h-2">
        <div className="bg-purple-500 h-2 rounded-full w-[18%]"></div>
      </div>
    </div>

  </div>


  {/* Chart */}
  <div className="col-span-2 bg-[#1f2937] p-6 rounded-xl">

    <h2 className="text-lg font-semibold mb-4">
      User Growth
    </h2>

    <ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
      <XAxis dataKey="month" stroke="#9ca3af" />
      <YAxis stroke="#9ca3af" />
      <Tooltip />
      <Bar dataKey="users" fill="#3b82f6" />
    </BarChart>

    </ResponsiveContainer>

  </div>

</div>

<div className="grid grid-cols-3 gap-6 mt-10">

  {/* Traffic Source */}
  <div className="col-span-2 bg-[#1f2937] p-6 rounded-xl">

    <h2 className="text-lg font-semibold mb-2">Traffic Source</h2>
    <p className="text-gray-400 text-sm mb-6">
      Measures your user's sources that generate traffic metrics to your website for this month.
    </p>

    <div className="flex gap-10 mb-6">
      <div>
        <p className="text-2xl font-bold">86,376</p>
        <p className="text-purple-400 text-sm">Organic</p>
      </div>

      <div>
        <p className="text-2xl font-bold">25,001</p>
        <p className="text-blue-400 text-sm">Direct</p>
      </div>

      <div>
        <p className="text-2xl font-bold">12,809</p>
        <p className="text-cyan-400 text-sm">Referral</p>
      </div>
    </div>

    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={trafficData}>
        <XAxis dataKey="name" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip />
        <Area type="monotone" dataKey="organic" stackId="1" stroke="#a855f7" fill="#a855f7" />
        <Area type="monotone" dataKey="direct" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
        <Area type="monotone" dataKey="referral" stackId="1" stroke="#06b6d4" fill="#06b6d4" />
      </AreaChart>
    </ResponsiveContainer>

  </div>


  {/* Mobile Sessions */}
  <div className="bg-[#1f2937] p-6 rounded-xl flex flex-col items-center">

    <h2 className="text-lg font-semibold mb-2">Mobile Sessions</h2>

    <p className="text-gray-400 text-sm text-center mb-6">
      The percentage of users who uses mobile devices compare to other devices.
    </p>

    <PieChart width={200} height={200}>
  <Pie
    data={mobileData}
    cx="50%"
    cy="50%"
    innerRadius={60}
    outerRadius={80}
    dataKey="value"
  >
    {mobileData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index]} />
    ))}
  </Pie>

  {/* Percentage in center */}
  <text
    x="50%"
    y="50%"
    textAnchor="middle"
    dominantBaseline="middle"
    className="fill-white text-xl font-bold"
  >
    {mobilePercent}%
  </text>

</PieChart>

    <div className="flex justify-between w-full mt-6 text-sm">
      <div>
        <p className="text-purple-400">Mobile</p>
        <p className="text-lg font-bold">6,098</p>
      </div>

      <div>
        <p className="text-gray-400">Desktop</p>
        <p className="text-lg font-bold">3,902</p>
      </div>
    </div>

  </div>

</div>
</div>

   
  );
}

export default Dashboard;