import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Menu } from "lucide-react";

function Student() {
	const [sidebarOpen, setSidebarOpen] = useState(true);

	return (
		<div className="flex min-h-screen bg-[#0f172a] text-white">

			{/* Sidebar */}
			<div className={`${sidebarOpen ? "w-64" : "w-20"} bg-[#1f2937] p-6 transition-all duration-300`}>

				<div className="flex justify-between items-center mb-10">
					{sidebarOpen && <h1 className="text-xl font-bold">Student</h1>}

					<button onClick={() => setSidebarOpen(!sidebarOpen)}>
						<Menu size={20} />
					</button>
				</div>

				<nav className="space-y-6">

					<Link to="/" className="flex items-center gap-3 hover:text-blue-400">
						<Home size={18} />
						{sidebarOpen && "Home"}
					</Link>

				</nav>

			</div>

			{/* Main Content */}
			<div className="flex-1 p-8">
				<h1 className="text-4xl font-bold mb-4">Student Course Creator</h1>
				<p className="text-gray-400">
					Student page is now loading correctly.
				</p>
			</div>

		</div>
	);
}

export default Student;
