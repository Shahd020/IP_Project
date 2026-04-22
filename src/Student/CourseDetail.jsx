import React from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, PlayCircle, CheckCircle, Clock, Star, FileText, Award, Loader, AlertCircle } from "lucide-react";
import { useCourseById } from "../hooks/useFetchCourses";
import useEnrollments from "../hooks/useEnrollments";

import StanfordLogo from '../assets/Logos/Standford.webp';
import AmazonLogo from '../assets/Logos/Amazon.jpeg';
import MetaLogo from '../assets/Logos/Meta.jpeg';
import HarvardLogo from '../assets/Logos/Harvard.webp';

// this page holds the the Video, Forum, Quiz, and Certificate.

// --- MOCK DATABASE FOR COURSE DETAILS ---
const courseDetailData = {
  "cyber-security": {
    id: "cyber-security", title: "Cyber Security & Cryptography", provider: "Stanford University", instructor: "Prof. Dan Boneh",
    rating: "4.7", reviews: "3,204", students: "18,432", duration: "10 weeks", progress: 70, image: StanfordLogo,
    description: "Learn the fundamentals of securing networks, cryptographic protocols, and defending against modern cyber threats. Protect sensitive data from emerging vulnerabilities.",
    whatYouWillLearn: ["Understand symmetric and asymmetric encryption", "Analyze network vulnerabilities", "Implement firewall rules", "Secure web applications"],
    modules: [
      { title: "Module 1: Intro to InfoSec", duration: "1h 10 min", completed: true },
      { title: "Module 2: Cryptographic Hashes", duration: "2h 20 min", completed: true },
      { title: "Module 3: Public Key Infrastructure", duration: "1h 45 min", completed: false, active: true },
      { title: "Module 4: Network Defense", duration: "2h 10 min", completed: false }
    ],
    resources: [{ name: "Crypto_CheatSheet.pdf", size: "1.2 MB" }]
  },
  "cloud-computing": {
    id: "cloud-computing", title: "Cloud Computing", provider: "Amazon Web Services", instructor: "Jeff Barr",
    rating: "4.6", reviews: "5,120", students: "25,000", duration: "6 weeks", progress: 33, image: AmazonLogo,
    description: "Master the core AWS services, cloud architecture, and serverless deployment strategies to scale modern web applications globally.",
    whatYouWillLearn: ["Deploy EC2 instances", "Manage S3 buckets", "Design scalable architectures", "Implement IAM security policies"],
    modules: [
      { title: "Week 1: Cloud Basics", duration: "2h 00 min", completed: true },
      { title: "Week 2: Compute & Networking", duration: "3h 15 min", completed: false, active: true },
      { title: "Week 3: Storage & Databases", duration: "2h 45 min", completed: false }
    ],
    resources: [{ name: "AWS_Architecture_Diagrams.zip", size: "5.5 MB" }]
  },
  "game-dev": {
    id: "game-dev", title: "2D Game Dev with Unity", provider: "Harvard University", instructor: "Dr. Alan Turing",
    rating: "4.9", reviews: "1,204", students: "8,432", duration: "8 weeks", progress: 45, image: HarvardLogo,
    description: "Master the art of 2D game development using Unity and C#. From creating your first sprite sheet to designing complex cutscenes and interactive narratives.",
    whatYouWillLearn: ["Master C# scripting for 2D game mechanics", "Create and animate complex sprite sheets", "Design cinematic dialogue", "Implement quest systems"],
    modules: [
      { title: "Module 1: Unity Basics", duration: "45 min", completed: true },
      { title: "Module 2: Player Movement", duration: "1h 20 min", completed: true },
      { title: "Module 3: Sprite Sheets", duration: "2h 15 min", completed: true },
      { title: "Module 4: Kael's AI", duration: "1h 50 min", completed: false, active: true },
      { title: "Module 5: Cutscenes", duration: "2h 30 min", completed: false }
    ],
    resources: [{ name: "Aira_Sprite.zip", size: "2.4 MB" }, { name: "Unity_Shortcuts.pdf", size: "840 KB" }]
  },
  "react": {
    id: "react", title: "Internet Programming with React", provider: "Meta", instructor: "Mark Zuckerberg",
    rating: "4.8", reviews: "12,000", students: "50,000", duration: "12 weeks", progress: 85, image: MetaLogo,
    description: "Build robust, dynamic, and responsive web applications using React, Tailwind CSS, and modern JavaScript. Prepare for a career as a Frontend Developer.",
    whatYouWillLearn: ["Understand React Hooks", "Manage global state", "Implement React Router", "Integrate REST APIs"],
    modules: [
      { title: "Module 1-8: React Fundamentals", duration: "15h 00 min", completed: true },
      { title: "Module 9: Advanced Hooks", duration: "2h 30 min", completed: true },
      { title: "Module 10: Routing & Auth", duration: "3h 15 min", completed: false, active: true },
      { title: "Module 11: Deployment", duration: "1h 45 min", completed: false }
    ],
    resources: [{ name: "React_Router_Docs.pdf", size: "1.1 MB" }]
  }
};

function CourseDetail() {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { course, loading, error } = useCourseById(courseId);
  const { enrollments } = useEnrollments();

  const isInstructorPreview = location.pathname.startsWith("/instructor");
  const enrollment = !isInstructorPreview
    ? enrollments.find((e) => e.courseId === courseId)
    : null;
  const progressPercent = enrollment?.progressPercent ?? 0;

  const handleBack = () => {
    const returnTo = location.state?.from;
    if (typeof returnTo === "string" && returnTo.length > 0) { navigate(returnTo); return; }
    if (window.history.length > 1) { navigate(-1); return; }
    navigate(isInstructorPreview ? "/instructor/courses" : "/student/courses", { replace: true });
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32 gap-3 text-gray-400">
      <Loader size={28} className="animate-spin" /> Loading courseâ€¦
    </div>
  );

  if (error) return (
    <div className="flex items-center gap-3 py-6 px-4 bg-red-900/30 border border-red-700 rounded-xl text-red-300 max-w-2xl mt-12">
      <AlertCircle size={20} /> {error}
    </div>
  );

  if (!course) return null;

  const instructorName = course.instructor?.name ?? "Unknown Instructor";
  const modules       = course.modules ?? [];
  const outcomes      = course.learningOutcomes ?? [];

  return (
    <div className="max-w-6xl mx-auto pb-12">

      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-400">
        <button type="button" onClick={handleBack} className="hover:text-blue-400 flex items-center gap-1 transition-colors">
          <ArrowLeft size={16} /> Back to Courses
        </button>
        <span>/</span>
        <span className="text-gray-200">{course.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* â”€â”€ Left column â”€â”€ */}
        <div className="lg:col-span-2 space-y-8">

          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                {course.category}
              </span>
              {course.rating >= 4.5 && (
                <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1 uppercase">
                  <Star size={12} fill="currentColor" /> Bestseller
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              {course.rating > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400" size={18} fill="currentColor" />
                  <span className="text-white font-bold">{course.rating.toFixed(1)}</span>
                  <span>({course.totalRatings ?? 0} reviews)</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Award size={18} />
                <span>{course.enrollmentCount ?? 0} students</span>
              </div>
              {course.duration && (
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{course.duration}</span>
                </div>
              )}
            </div>
          </div>

          {/* About */}
          <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-3">About this course</h2>
            <p className="text-gray-300 leading-relaxed text-sm">{course.description}</p>
            <p className="text-gray-400 text-sm mt-3">
              Instructor: <span className="text-white font-medium">{instructorName}</span>
            </p>
          </div>

          {/* Learning Outcomes */}
          {outcomes.length > 0 && (
            <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4">What you'll learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {outcomes.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="text-green-400 shrink-0 mt-0.5" size={18} />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modules */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Course Content
              <span className="ml-2 text-base font-normal text-gray-400">
                ({modules.length} module{modules.length !== 1 ? "s" : ""})
              </span>
            </h2>
            {modules.length === 0 ? (
              <p className="text-gray-400 text-sm">No modules added yet.</p>
            ) : (
              <div className="bg-[#1f2937] rounded-xl border border-gray-800 overflow-hidden">
                {modules.map((mod, index) => (
                  <div
                    key={mod._id}
                    className="flex items-center justify-between p-4 border-b border-gray-800 last:border-0 hover:bg-[#374151] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-600 flex items-center justify-center shrink-0">
                        <span className="text-[10px] text-gray-400 font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-200">{mod.title}</h4>
                        {mod.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{mod.description}</p>
                        )}
                      </div>
                    </div>
                    {mod.content?.length > 0 && (
                      <span className="text-sm text-gray-500 flex items-center gap-1 shrink-0">
                        <FileText size={14} />
                        {mod.content.length} item{mod.content.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* â”€â”€ Right sidebar â”€â”€ */}
        <div className="lg:col-span-1">
          <div className="bg-[#1f2937] rounded-xl border border-gray-800 shadow-xl overflow-hidden sticky top-8 flex flex-col">

            {/* Thumbnail / preview */}
            <div className="relative w-full h-48 bg-gray-900 border-b border-gray-700 overflow-hidden">
              <img
                src={course.thumbnail || PLACEHOLDER}
                alt={course.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = PLACEHOLDER; }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <PlayCircle size={52} className="text-white drop-shadow-lg" />
              </div>
              <span className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded font-semibold">
                Preview Course
              </span>
            </div>

            <div className="p-6 flex flex-col gap-5">

              {/* Price */}
              <p className="text-3xl font-extrabold text-white">
                {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
              </p>

              {/* Progress (student only) */}
              {!isInstructorPreview && (
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-300 font-semibold text-sm">Your Progress</span>
                    <span className="text-white font-bold">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* CTA */}
              {!isInstructorPreview ? (
                <Link
                  to={`/student/courses/${courseId}/study`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <PlayCircle size={22} />
                  {progressPercent > 0 ? "Resume Learning" : "Start Learning"}
                </Link>
              ) : (
                <span className="w-full text-center py-2 text-sm text-yellow-400 border border-yellow-700 rounded-lg bg-yellow-900/20">
                  Instructor Preview Mode
                </span>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CourseDetail;
