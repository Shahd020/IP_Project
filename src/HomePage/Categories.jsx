import React from "react";
import { Link } from "react-router-dom";
import { Loader, Code2, BarChart3, Brain, Shield, Cloud, Gamepad2, Smartphone, Palette, Link2 } from "lucide-react";
import useFetchCourses from "../hooks/useFetchCourses";
import PublicNavbar from "../components/PublicNavbar.jsx";
import PublicFooter from "../components/PublicFooter.jsx";

// Keys must match the category values stored in MongoDB
const CATEGORY_META = {
  'Web Development':    { Icon: Code2,      color: 'bg-blue-600',   ring: 'ring-blue-500/30',   description: 'HTML, CSS, JavaScript, React, Node.js, and modern frameworks' },
  'Data Science':       { Icon: BarChart3,   color: 'bg-red-600',    ring: 'ring-red-500/30',    description: 'Data analysis, visualisation, Pandas, Python, statistics, and more ' },
  'Machine Learning':   { Icon: Brain,       color: 'bg-indigo-600', ring: 'ring-indigo-500/30', description: 'Supervised learning, algorithims, neural networks, scikit-learn, TensorFlow' },
  'Cyber Security':     { Icon: Shield,      color: 'bg-yellow-600', ring: 'ring-yellow-500/30', description: 'Network security, ethical hacking, penetration testing, OWASP' },
  'Cloud Computing':    { Icon: Cloud,       color: 'bg-sky-600',    ring: 'ring-sky-500/30',    description: 'AWS, Azure, GCP — deploy and scale applications in the cloud' },
  'Game Development':   { Icon: Gamepad2,    color: 'bg-green-600',  ring: 'ring-green-500/30',  description: 'Unity, Unreal Engine, C#, UI, 2D/3D game design and mechanics' },
  'Mobile Development': { Icon: Smartphone,  color: 'bg-pink-600',   ring: 'ring-pink-500/30',   description: 'React Native, Flutter — build apps for iOS and Android' },
  'UI/UX Design':       { Icon: Palette,     color: 'bg-purple-600', ring: 'ring-purple-500/30', description: 'Figma, user research, prototyping, and design systems' },
  'Blockchain':         { Icon: Link2,       color: 'bg-orange-600', ring: 'ring-orange-500/30', description: 'Smart contracts, Solidity, Web3.js, DeFi, and NFTs' },
};

function Categories() {
  const { courses, loading, error } = useFetchCourses();

  const countByCategory = courses.reduce((acc, course) => {
    acc[course.category] = (acc[course.category] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.entries(CATEGORY_META).map(([name, meta]) => ({
    name,
    ...meta,
    count: countByCategory[name] || 0,
  }));

  const totalCourses = courses.length;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pt-20">
      <PublicNavbar activePage="/categories" />

      {/* Hero */}
      <div className="px-6 sm:px-10 lg:px-20 py-16 sm:py-20 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Course Categories</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
          Explore our diverse range of course categories and find the perfect learning path for your goals
        </p>
      </div>

      {loading && (
        <div className="flex justify-center items-center gap-3 pb-16 text-gray-400">
          <Loader size={22} className="animate-spin" /> Loading categories…
        </div>
      )}
      {error && !loading && (
        <p className="text-center text-red-400 pb-16">{error}</p>
      )}

      {!loading && (
        <div className="px-6 sm:px-10 lg:px-20 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories.map(({ name, Icon, color, ring, description, count }) => (
              <Link
                to={`/catalog?category=${encodeURIComponent(name)}`}
                key={name}
                className="bg-[#1f2937] rounded-xl border border-gray-800 p-6 hover:border-gray-600 hover:-translate-y-1 transition-all duration-300 cursor-pointer block"
              >
                <div className={`w-14 h-14 ${color} ring-2 ${ring} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <Icon size={26} className="text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-center text-white">{name}</h3>
                <p className="text-gray-400 text-sm mb-4 text-center leading-relaxed">{description}</p>
                <div className="flex justify-between items-center border-t border-gray-700 pt-4">
                  <span className="text-blue-400 font-semibold text-sm">
                    {count} course{count !== 1 ? 's' : ''}
                  </span>
                  <span className="text-gray-400 text-sm">Explore →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Stats — distinct bg so it doesn't blend with footer */}
      <div className="px-6 sm:px-10 lg:px-20 py-16 bg-[#111827] border-y border-gray-700/60">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Why Choose Our Categories?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Each category is carefully curated to provide comprehensive learning experiences
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-1">{Object.keys(CATEGORY_META).length}</div>
            <div className="text-gray-400 text-sm">Categories</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-400 mb-1">{totalCourses}</div>
            <div className="text-gray-400 text-sm">Total Courses</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400 mb-1">50K+</div>
            <div className="text-gray-400 text-sm">Students</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-yellow-400 mb-1">4.8</div>
            <div className="text-gray-400 text-sm">Avg Rating</div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}

export default Categories;
