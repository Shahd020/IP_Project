import React from "react";
import MetaLogo from './assets/Logos/Meta.jpeg';
import StanfordLogo from './assets/Logos/Standford.webp';
import GoogleLogo from './assets/Logos/google.jpeg';
import HarvardLogo from './assets/Logos/Harvard.webp';
import AmazonLogo from './assets/Logos/Amazon.jpeg';
import AILogo from './assets/Logos/AI.webp';

function Courses() {
  const courses = [
    {
      title: "React Development",
      provider: "Meta",
      duration: "8 weeks",
      rating: "4.8 ⭐",
      image: MetaLogo
    },
    {
      title: "Cyber Security",
      provider: "Stanford University",
      duration: "10 weeks",
      rating: "4.7 ⭐",
      image: StanfordLogo
    },
    {
      title: "Cloud Computing",
      provider: "Amazon Web Services",
      duration: "6 weeks",
      rating: "4.6 ⭐",
      image: AmazonLogo
    },
    {
      title: "Artificial Intelligence",
      provider: "MIT",
      duration: "12 weeks",
      rating: "4.9 ⭐",
      image: AILogo
    },
    {
      title: "Data Science",
      provider: "Harvard University",
      duration: "9 weeks",
      rating: "4.8 ⭐",
      image: HarvardLogo
    },
    {
      title: "Software Engineering",
      provider: "Google",
      duration: "8 weeks",
      rating: "4.7 ⭐",
      image: GoogleLogo
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Courses</h1>

      <div className="grid grid-cols-3 gap-8">

        {courses.map((course, index) => (
          <div
            key={index}
            className="bg-[#1f2937] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
          >

            {/* Image */}
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-40 object-cover"
            />

            {/* Content */}
            <div className="p-5">

              <h3 className="text-lg font-semibold mb-1">
                {course.title}
              </h3>

              <p className="text-gray-400 text-sm mb-2">
                {course.provider}
              </p>

              <div className="flex justify-between text-sm text-gray-300 mb-4">
                <span>{course.duration}</span>
                <span>{course.rating}</span>
              </div>

        

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default Courses;