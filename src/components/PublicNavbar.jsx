import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown.jsx';

const NAV_LINKS = [
  { to: '/',           label: 'Home' },
  { to: '/categories', label: 'Categories' },
  { to: '/catalog',    label: 'Catalog' },
  { to: '/blog',       label: 'Blog' },
  { to: '/contact',    label: 'Contact' },
];

function PublicNavbar({ activePage }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to) => {
    if (activePage) return activePage === to;
    if (to === '/') return location.pathname === '/' || location.pathname === '/Home';
    return location.pathname === to || location.pathname.startsWith(to + '/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1f2937] shadow border-b border-gray-800">
      <div className="flex items-center justify-between px-6 sm:px-10 py-4">

        {/* Logo */}
        <div className="text-xl font-bold text-white tracking-wide shrink-0">
          <Link to="/"><span className="text-blue-500">Edu</span>Platform</Link>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-6 lg:gap-8 text-gray-300 font-medium">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`hover:text-blue-400 transition-colors ${isActive(to) ? 'text-blue-400' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side: ProfileDropdown + mobile burger */}
        <div className="flex items-center gap-4 text-gray-300">
          <ProfileDropdown />
          <button
            className="md:hidden p-1"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-700 bg-[#1f2937] px-6 pb-5 pt-3 flex flex-col gap-3">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`font-medium py-2 transition-colors border-b border-gray-800 last:border-0 ${
                isActive(to) ? 'text-blue-400' : 'text-gray-300 hover:text-blue-400'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default PublicNavbar;
