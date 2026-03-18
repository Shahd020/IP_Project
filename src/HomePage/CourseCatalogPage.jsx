import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

import MetaLogo from "../assets/Logos/Meta.jpeg";
import StanfordLogo from "../assets/Logos/Standford.webp";
import GoogleLogo from "../assets/Logos/google.jpeg";
import HarvardLogo from "../assets/Logos/Harvard.webp";
import AmazonLogo from "../assets/Logos/Amazon.jpeg";
import AILogo from "../assets/Logos/AI.webp";

const courses = [
  {
    id: "web-dev",
    title: "Web Development Bootcamp",
    provider: "EduPlatform",
    duration: "10 weeks",
    rating: 4.8,
    price: "$89.99",
    image: MetaLogo,
    description: "Build responsive websites with HTML, CSS, JavaScript, and React."
  },
  {
    id: "machine-learning",
    title: "Machine Learning Essentials",
    provider: "MIT",
    duration: "12 weeks",
    rating: 4.9,
    price: "$129.99",
    image: AILogo,
    description: "Learn model training, evaluation, and practical ML workflows from scratch."
  },
  {
    id: "data-science",
    title: "Data Science in Practice",
    provider: "Harvard University",
    duration: "9 weeks",
    rating: 4.7,
    price: "$99.99",
    image: HarvardLogo,
    description: "Analyze data, visualize insights, and solve real-world business problems."
  },
  {
    id: "react-development",
    title: "React Development",
    provider: "Meta",
    duration: "8 weeks",
    rating: 4.8,
    price: "$84.99",
    image: MetaLogo,
    description: "Create modern single-page applications using React and component architecture."
  },
  {
    id: "cyber-security",
    title: "Cyber Security",
    provider: "Stanford University",
    duration: "10 weeks",
    rating: 4.7,
    price: "$109.99",
    image: StanfordLogo,
    description: "Understand security fundamentals, threat models, and core defense techniques."
  },
  {
    id: "cloud-computing",
    title: "Cloud Computing",
    provider: "Amazon Web Services",
    duration: "6 weeks",
    rating: 4.6,
    price: "$94.99",
    image: AmazonLogo,
    description: "Deploy and scale applications with cloud-native tools and architecture."
  },
  {
    id: "artificial-intelligence",
    title: "Artificial Intelligence",
    provider: "MIT",
    duration: "12 weeks",
    rating: 4.9,
    price: "$139.99",
    image: AILogo,
    description: "Study intelligent systems, search algorithms, and practical AI applications."
  },
  {
    id: "software-engineering",
    title: "Software Engineering",
    provider: "Google",
    duration: "8 weeks",
    rating: 4.7,
    price: "$89.99",
    image: GoogleLogo,
    description: "Learn software design, testing strategy, and maintainable development practices."
  },
  {
    id: "game-dev-unity",
    title: "2D Game Dev with Unity",
    provider: "Harvard University",
    duration: "8 weeks",
    rating: 4.9,
    price: "$79.99",
    image: HarvardLogo,
    description: "Build complete 2D games with gameplay systems, scenes, and asset pipelines."
  },
  {
    id: "internet-programming-react",
    title: "Internet Programming with React",
    provider: "Meta",
    duration: "12 weeks",
    rating: 4.8,
    price: "$119.99",
    image: MetaLogo,
    description: "Master front-end routing, state management, and production-ready UI patterns."
  },
  {
    id: "operations-research",
    title: "Operations Research",
    provider: "Stanford University",
    duration: "6 weeks",
    rating: 4.5,
    price: "$74.99",
    image: StanfordLogo,
    description: "Apply optimization, decision analysis, and modeling techniques to operations."
  }
];

function CourseCatalogPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 sm:px-10 lg:px-20 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/Home"
          className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="mt-5 mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">All Courses</h1>
          <p className="mt-3 text-gray-400 max-w-3xl">
            Browse the complete course catalog. This page lists public courses only and is separate from Student Courses.
          </p>
          <p className="mt-2 text-sm text-gray-500">{courses.length} courses available</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {courses.map((course) => {
            return (
              <div
                key={course.id}
                className="bg-[#1f2937] rounded-2xl overflow-hidden border border-gray-800 shadow-xl flex flex-col"
              >
                <img src={course.image} alt={course.title} className="w-full h-44 object-cover" />

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <h2 className="text-xl font-bold text-white leading-tight">{course.title}</h2>
                    <span className="text-yellow-400 font-bold flex items-center gap-1 text-sm shrink-0">
                      {course.rating}
                      <Star size={14} fill="currentColor" />
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mt-2">{course.provider}</p>
                  <p className="text-gray-400 text-sm mt-1">Duration: {course.duration}</p>

                  <p className="text-gray-300 text-sm mt-4 mb-6 flex-1">{course.description}</p>

                  <div className="flex justify-between items-center border-t border-gray-700 pt-5 mt-auto">
                    <span className="text-2xl font-extrabold text-white">{course.price}</span>
                    <Link
                      to={`/course/${course.id}`}
                      className="group flex items-center gap-1.5 font-bold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View Details
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CourseCatalogPage;