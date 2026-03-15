
import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  PlayCircle,
  CheckCircle,
  Clock,
  Star,
  FileText,
  Download,
  Award
} from "lucide-react";

import HarvardLogo from "../assets/Logos/Harvard.webp";
import MetaLogo from "../assets/Logos/Meta.jpeg";
import StanfordLogo from "../assets/Logos/Standford.webp";

const coursesData = {
  "game-dev-unity": {
    title: "2D Game Dev with Unity",
    provider: "Harvard University",
    instructor: "Dr. Alan Turing",
    rating: "4.9",
    reviews: "1,204",
    students: "8,432",
    duration: "8 weeks",
    progress: 45,
    image: HarvardLogo,
    description:
      "Master the art of 2D game development using Unity and C#. From creating your first sprite sheet to designing complex cutscenes and interactive narratives, this course covers everything you need to bring characters like Aira and Kael to life.",
    whatYouWillLearn: [
      "Master C# scripting for 2D game mechanics",
      "Create and animate complex sprite sheets",
      "Design cinematic dialogue and cutscenes",
      "Implement inventory and quest systems"
    ],
    modules: [
      { title: "Module 1: Unity Basics & Scene Setup", duration: "45 min", completed: true },
      { title: "Module 2: Player Movement & Physics", duration: "1h 20 min", completed: true },
      { title: "Module 3: Designing Aira - Sprite Sheets", duration: "2h 15 min", completed: true },
      { title: "Module 4: Kael's AI & Enemy Behavior", duration: "1h 50 min", active: true },
      { title: "Module 5: Crafting Cinematic Cutscenes", duration: "2h 30 min" },
      { title: "Module 6: UI, Polish & Exporting", duration: "1h 10 min" }
    ],
    resources: [
      { name: "Aira_Sprite_Template.zip", size: "2.4 MB" },
      { name: "Unity_Shortcuts_CheatSheet.pdf", size: "840 KB" }
    ]
  },
  "react-programming": {
    title: "Internet Programming with React",
    provider: "Meta",
    instructor: "Dr. Sarah Connor",
    rating: "4.8",
    reviews: "2,310",
    students: "12,500",
    duration: "12 weeks",
    progress: 85,
    image: MetaLogo,
    description:
      "Build modern, responsive web applications using React. Learn component-based architecture, hooks, state management, and how to connect your app to real-world APIs.",
    whatYouWillLearn: [
      "Build reusable React components",
      "Manage state with hooks and context",
      "Fetch and display data from REST APIs",
      "Deploy React apps to production"
    ],
    modules: [
      { title: "Module 1: HTML & CSS Refresher", duration: "30 min", completed: true },
      { title: "Module 2: JavaScript ES6+", duration: "1h 10 min", completed: true },
      { title: "Module 3: React Fundamentals", duration: "2h 00 min", completed: true },
      { title: "Module 4: Hooks & State", duration: "1h 45 min", completed: true },
      { title: "Module 5: React Router", duration: "1h 20 min", active: true },
      { title: "Module 6: Context API", duration: "1h 30 min" },
      { title: "Module 7: REST API Integration", duration: "2h 00 min" },
      { title: "Module 8: Tailwind CSS", duration: "1h 10 min" },
      { title: "Module 9: Testing", duration: "1h 40 min" },
      { title: "Module 10: Deployment", duration: "50 min" }
    ],
    resources: [
      { name: "React_Cheatsheet.pdf", size: "620 KB" },
      { name: "Project_Starter_Kit.zip", size: "3.1 MB" }
    ]
  },
  "operations-research": {
    title: "Operations Research",
    provider: "Stanford University",
    instructor: "Prof. James Wilson",
    rating: "4.5",
    reviews: "890",
    students: "4,230",
    duration: "6 weeks",
    progress: 0,
    image: StanfordLogo,
    description:
      "Explore the mathematical foundations of decision-making. From linear programming to network flows, this course equips you with the analytical tools used in logistics, finance, and engineering.",
    whatYouWillLearn: [
      "Solve linear programming problems",
      "Apply the simplex algorithm",
      "Model and analyse network flows",
      "Use integer programming for real problems"
    ],
    modules: [
      { title: "Module 1: Introduction to OR", duration: "40 min", completed: true },
      { title: "Module 2: Linear Programming", duration: "1h 30 min", completed: true },
      { title: "Module 3: Simplex Method", duration: "2h 00 min", active: true },
      { title: "Module 4: Duality Theory", duration: "1h 45 min" },
      { title: "Module 5: Network Models", duration: "2h 10 min" }
    ],
    resources: [
      { name: "OR_Formulas_Sheet.pdf", size: "410 KB" },
      { name: "Simplex_Examples.xlsx", size: "1.2 MB" }
    ]
  }
};

function CoursePreview() {

  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Fall back to role-specific course list if no previous route exists.
  const fallbackBackPath = location.pathname.startsWith("/instructor")
    ? "/instructor/courses"
    : "/student/courses";

  const handleBack = () => {
    const returnTo = location.state?.from;

    if (typeof returnTo === "string" && returnTo.length > 0) {
      navigate(returnTo);
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallbackBackPath, { replace: true });
  };

  const course = coursesData[courseId] || coursesData["game-dev-unity"];

  return (
    <div className="max-w-6xl mx-auto">

      {/* BACK BUTTON */}
      <div className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-400">
        <button
          type="button"
          onClick={handleBack}
          className="hover:text-blue-400 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Courses
        </button>
        <span>/</span>
        <span className="text-gray-200">{course.title}</span>
      </div>

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>

      <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">

        <div className="flex items-center gap-2">
          <Star className="text-yellow-400" size={18} fill="currentColor" />
          <span className="text-white font-bold">{course.rating}</span>
          <span>({course.reviews} reviews)</span>
        </div>

        <div className="flex items-center gap-2">
          <Award size={18} />
          <span>{course.students} students</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={18} />
          <span>{course.duration}</span>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-8">

          {/* ABOUT */}
          <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold mb-3">About this course</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* WHAT YOU WILL LEARN */}
          <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold mb-4">What you'll learn</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {course.whatYouWillLearn.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-green-400 mt-1" size={18} />
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MODULES */}
          <div>

            <h2 className="text-2xl font-bold mb-4">Course Content</h2>

            <div className="bg-[#1f2937] rounded-xl border border-gray-800 overflow-hidden">

              {course.modules.map((module, index) => (

                <div
                  key={index}
                  className="flex items-center justify-between p-4 border-b border-gray-800 last:border-0 hover:bg-[#374151]"
                >

                  <div className="flex items-center gap-4">

                    {module.completed ? (
                      <CheckCircle className="text-green-400" size={20} />
                    ) : module.active ? (
                      <PlayCircle className="text-blue-400" size={20} />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-gray-600" />
                    )}

                    <span className="text-gray-200">{module.title}</span>

                  </div>

                  <span className="text-sm text-gray-500">
                    {module.duration}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="bg-[#1f2937] rounded-xl border border-gray-800 p-6 h-fit">

          <img
            src={course.image}
            alt="course"
            className="w-full h-40 object-cover rounded-lg mb-6"
          />

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Your Progress</span>
              <span>{course.progress}%</span>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">

            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <FileText size={16} />
              Downloadable Resources
            </h3>

            {course.resources.map((res, idx) => (

              <div key={idx} className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">{res.name}</span>
                <Download size={16} className="text-blue-400 cursor-pointer" />
              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default CoursePreview;
