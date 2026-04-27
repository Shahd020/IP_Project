import React, { useState } from "react";
import PublicNavbar from "../components/PublicNavbar.jsx";
import PublicFooter from "../components/PublicFooter.jsx";
import { ChevronDown, ChevronUp } from "lucide-react";

const PAGES = [
  {
    title: "About Us",
    icon: "👥",
    summary: "Learn about our mission, vision, and the team behind EduPlatform",
    detail: "EduPlatform was founded in 2021 with a single mission: make world-class education accessible to everyone, everywhere. Our team of educators, engineers, and designers believe that learning should be engaging, practical, and affordable. Today we serve 500 000+ students across 120 countries.",
  },
  {
    title: "Our Instructors",
    icon: "👨‍🏫",
    summary: "Meet our expert instructors and course creators",
    detail: "All EduPlatform instructors are vetted industry professionals with at least three years of hands-on experience in their field. They go through a rigorous onboarding process including demo lessons, peer review, and student-satisfaction benchmarking before their courses go live.",
  },
  {
    title: "Student Success Stories",
    icon: "🎓",
    summary: "Read inspiring stories from our successful students",
    detail: "\"I landed my first junior dev role within 3 months of finishing the Web Development bootcamp!\" — Sara K.\n\n\"The Data Science path gave me the confidence to negotiate a 30 % salary raise.\" — James T.\n\nJoin thousands of alumni who have transformed their careers through EduPlatform courses.",
  },
  {
    title: "Career Center",
    icon: "💼",
    summary: "Find job opportunities and career guidance",
    detail: "Our Career Center gives you access to 500+ partner employers, a résumé review service, mock interview sessions, and a job-board filtered specifically for EduPlatform graduates. Students who complete at least one certificate have a 4× higher response rate from recruiters.",
  },
  {
    title: "Help & Support",
    icon: "🆘",
    summary: "Get help with your learning journey",
    detail: "Need help? Our support team is available Monday–Friday 9 am–6 pm UTC. You can reach us at support@eduplatform.com, via the live chat bubble on every page, or by submitting a ticket in your student dashboard. Average first-response time is under 2 hours.",
  },
  {
    title: "Privacy Policy",
    icon: "🔒",
    summary: "Learn about how we protect your data",
    detail: "We take your privacy seriously. EduPlatform never sells your personal data. We collect only what is necessary to deliver and improve the service. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). You can request a full export or deletion of your data at any time from your account settings.",
  },
];

function Pages() {
  const [expanded, setExpanded] = useState(null);
  const toggle = (i) => setExpanded((prev) => (prev === i ? null : i));

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pt-20">
      <PublicNavbar activePage="/pages" />

      {/* Hero */}
      <div className="px-6 sm:px-10 lg:px-20 py-16 sm:py-20 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Pages</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
          Explore all the important pages and resources available on our platform
        </p>
      </div>

      {/* Grid */}
      <div className="px-6 sm:px-10 lg:px-20 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PAGES.map((page, i) => (
            <div
              key={i}
              className="bg-[#1f2937] rounded-xl border border-gray-800 overflow-hidden flex flex-col"
            >
              <div className="p-6 flex flex-col flex-1">
                <div className="text-4xl mb-4">{page.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-white">{page.title}</h3>
                <p className="text-gray-400 text-sm mb-5 flex-1 leading-relaxed">{page.summary}</p>
                <button
                  onClick={() => toggle(i)}
                  className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors self-start"
                >
                  {expanded === i ? (
                    <>Show Less <ChevronUp size={16} /></>
                  ) : (
                    <>Learn More <ChevronDown size={16} /></>
                  )}
                </button>
              </div>

              {expanded === i && (
                <div className="px-6 pb-6 border-t border-gray-700 pt-4">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{page.detail}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}

export default Pages;
