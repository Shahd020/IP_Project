import { Link } from 'react-router-dom';

function PublicFooter() {
  return (
    <footer className="bg-[#1f2937] px-6 sm:px-10 lg:px-20 py-16 border-t border-gray-800">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        <div className="sm:col-span-2 md:col-span-1">
          <div className="text-2xl font-bold text-white mb-4">
            <span className="text-blue-500">Edu</span>Platform
          </div>
          <p className="text-gray-400 leading-relaxed text-sm">
            Empowering learners worldwide with quality education and cutting-edge courses to master the skills of tomorrow.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/catalog"    className="hover:text-blue-400 transition-colors">Courses</Link></li>
            <li><Link to="/categories" className="hover:text-blue-400 transition-colors">Categories</Link></li>
            <li><Link to="/contact"    className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
            <li><Link to="/blog"       className="hover:text-blue-400 transition-colors">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Support</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/pages" className="hover:text-blue-400 transition-colors">Help Center</Link></li>
            <li><Link to="/pages" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
            <li><Link to="/pages" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400 transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Connect</h4>
          <div className="flex space-x-3">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">📘</a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-400 hover:text-white transition-colors">🐦</a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-colors">📷</a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-800 hover:text-white transition-colors">💼</a>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} EduPlatform. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default PublicFooter;
