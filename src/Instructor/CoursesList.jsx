
import React from "react";
import { Link } from "react-router-dom";
import { Users, FileText, ClipboardList, Eye, Edit } from "lucide-react";

import StanfordLogo from "../assets/Logos/Standford.webp";
import HarvardLogo from "../assets/Logos/Harvard.webp";
import MetaLogo from "../assets/Logos/Meta.jpeg";

function CoursesList() {

  const courses = [
    {
      id: "game-dev-unity",
      title: "2D Game Dev with Unity",
      provider: "Harvard University",
      students: 842,
      modules: 6,
      image: HarvardLogo
    },
    {
      id: "react-programming",
      title: "Internet Programming with React",
      provider: "Meta",
      students: 512,
      modules: 10,
      image: MetaLogo
    },
    {
      id: "operations-research",
      title: "Operations Research",
      provider: "Stanford University",
      students: 230,
      modules: 5,
      image: StanfordLogo
    }
  ];

  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        My Courses
      </h1>

      <div className="grid grid-cols-3 gap-8">

        {courses.map((course) => (

          <div
            key={course.id}
            className="bg-[#1f2937] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 flex flex-col"
          >

            <img
              src={course.image}
              alt={course.title}
              className="w-full h-40 object-cover"
            />

            <div className="p-5 flex flex-col flex-1">

              <h3 className="text-lg font-semibold mb-1">
                {course.title}
              </h3>

              <p className="text-gray-400 text-sm mb-4">
                {course.provider}
              </p>

              <div className="flex justify-between text-sm text-gray-300 mb-6">
                <span className="flex items-center gap-1">
                  <Users size={16} />
                  {course.students} Students
                </span>

                <span className="flex items-center gap-1">
                  <FileText size={16} />
                  {course.modules} Modules
                </span>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-3">

                <Link
                  to="/instructor/modules"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Modules
                </Link>

                <Link
                  to="/instructor/materials"
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <FileText size={16} />
                  Materials
                </Link>

                <Link
                  to="/instructor/quiz"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <ClipboardList size={16} />
                  Quiz
                </Link>

                {/* PREVIEW BUTTON */}
                <Link
                  to={`/instructor/courses/${course.id}`}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  Preview
                </Link>
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default CoursesList;

