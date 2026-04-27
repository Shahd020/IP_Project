import React, { useState } from "react";
import PublicNavbar from "../components/PublicNavbar.jsx";
import PublicFooter from "../components/PublicFooter.jsx";
import { ChevronDown, ChevronUp } from "lucide-react";

const POSTS = [
  {
    id: 1,
    title: "5 Tips for Effective Online Learning",
    summary: "Maximize your productivity and retention with these proven strategies for online courses.",
    date: "April 10, 2026",
    tag: "Study Tips",
    body: [
      { heading: "Set a schedule", text: "Treat online classes like in-person ones — block dedicated time on your calendar and stick to it every week." },
      { heading: "Eliminate distractions", text: "Use website blockers and put your phone in another room during study sessions. Even a 5-second distraction can break your flow." },
      { heading: "Take active notes", text: "Summarize key concepts in your own words instead of passively re-reading slides. Writing activates recall far better than highlighting." },
      { heading: "Use the Pomodoro technique", text: "Work in 25-minute focused bursts with 5-minute breaks. After four rounds, take a longer 20-minute break to recharge." },
      { heading: "Join study communities", text: "Engage with course forums and peer groups — discussing concepts out loud deepens your understanding significantly." },
    ],
  },
  {
    id: 2,
    title: "Top 10 In-Demand Tech Skills in 2026",
    summary: "Stay ahead in your career by mastering these essential technology skills that employers are paying premium rates for.",
    date: "April 3, 2026",
    tag: "Career",
    body: [
      { heading: "AI & Machine Learning", text: "From prompt engineering to model fine-tuning, AI literacy is now expected across most tech roles." },
      { heading: "Cloud Architecture", text: "AWS, Azure, and GCP certifications remain the gold standard. Multi-cloud expertise commands even higher salaries." },
      { heading: "Cybersecurity", text: "Zero-trust architecture and threat intelligence are scarce skills — companies are paying handsomely for them." },
      { heading: "Full-Stack Development", text: "React combined with Node.js or Python back-ends is still the dominant pairing for product teams." },
      { heading: "DevOps & Platform Engineering", text: "Kubernetes, Terraform, and CI/CD pipeline experience are increasingly required even for senior developers." },
    ],
  },
  {
    id: 3,
    title: "How to Choose the Right Course for You",
    summary: "A step-by-step guide to selecting courses that genuinely match your goals and learning style.",
    date: "March 28, 2026",
    tag: "Guidance",
    body: [
      { heading: "Define your goal first", text: "Are you switching careers, upskilling for a promotion, or learning a hobby? Your goal determines the level and subject area you need." },
      { heading: "Check the full syllabus", text: "A quality course publishes its complete outline. Match each module against real job descriptions or the skills gap you want to close." },
      { heading: "Look at instructor credentials", text: "Industry experience matters more than academic titles when you are learning practical skills. Check their LinkedIn and portfolio." },
      { heading: "Read recent reviews", text: "Filter for reviews from the last six months. Courses go stale — you want to know the content is still up to date." },
      { heading: "Take the free preview", text: "Most platforms offer a sample lesson. If the teaching style does not click within the first ten minutes, move on and find a better fit." },
    ],
  },
];

function Blog() {
  const [expanded, setExpanded] = useState(null);
  const toggle = (id) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pt-20">
      <PublicNavbar activePage="/blog" />

      {/* Hero */}
      <div className="px-6 sm:px-10 lg:px-20 py-16 sm:py-20 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Blog</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
          Read the latest articles, tips, and news from the world of online learning and education.
        </p>
      </div>

      {/* Posts — items-start prevents row stretching when one card expands */}
      <div className="px-6 sm:px-10 lg:px-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-start">
          {POSTS.map((post) => (
            <div
              key={post.id}
              className="bg-[#1f2937] rounded-xl border border-gray-800 overflow-hidden flex flex-col"
            >
              <div className="p-6 flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-900/30 px-2.5 py-1 rounded-full self-start mb-3">
                  {post.tag}
                </span>
                <h3 className="text-lg font-bold text-white mb-3 leading-snug">{post.title}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{post.summary}</p>
                <p className="text-xs text-gray-500 mb-4">{post.date}</p>

                <button
                  onClick={() => toggle(post.id)}
                  className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors self-start"
                >
                  {expanded === post.id ? (
                    <>Collapse <ChevronUp size={16} /></>
                  ) : (
                    <>Read More <ChevronDown size={16} /></>
                  )}
                </button>
              </div>

              {expanded === post.id && (
                <div className="px-6 pb-6 border-t border-gray-700 pt-5 space-y-4">
                  {post.body.map(({ heading, text }) => (
                    <div key={heading}>
                      <p className="text-white font-semibold text-sm mb-1">{heading}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
                    </div>
                  ))}
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

export default Blog;
