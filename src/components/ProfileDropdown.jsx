import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Trash2, LayoutDashboard } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import apiClient from '../api/axios.js';

// align="right" (default) → dropdown opens leftward, right edge flush with trigger
// align="left"           → dropdown opens rightward, left edge flush with trigger
function ProfileDropdown({ align = 'right' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);

  const openMenu     = useCallback(() => { clearTimeout(closeTimer.current); setOpen(true); }, []);
  const scheduleClose = useCallback(() => { closeTimer.current = setTimeout(() => setOpen(false), 180); }, []);

  const dashboardPath = () => {
    if (user?.role === 'admin')      return '/dashboard';
    if (user?.role === 'instructor') return '/instructor';
    return '/student';
  };

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    setOpen(false);
    if (!window.confirm('Delete your account permanently? This cannot be undone.')) return;
    try {
      await apiClient.delete('/users/me');
    } catch { /* ignore */ }
    await logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-2 text-gray-300 hover:text-blue-400 font-medium transition-colors bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
      >
        <User size={18} /> Login
      </Link>
    );
  }

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const panelPositionClass = align === 'left'
    ? 'left-0 top-full mt-1'
    : 'right-0 top-full mt-1';

  return (
    <div
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      {/* Avatar trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white font-bold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1f2937]"
        aria-label="Profile menu"
        aria-expanded={open}
      >
        {initials}
      </button>

      {/* Dropdown panel — rendered in a portal-like position via fixed z */}
      {open && (
        <div
          className={`absolute ${panelPositionClass} w-56 bg-[#1e293b] border border-gray-700 rounded-xl shadow-2xl z-[200] overflow-hidden`}
          onMouseEnter={openMenu}
          onMouseLeave={scheduleClose}
        >
          {/* Profile header */}
          <div className="px-4 py-5 text-center border-b border-gray-700">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-2 select-none">
              {initials}
            </div>
            <p className="text-white font-semibold text-sm truncate">{user.name}</p>
            <p className="text-gray-400 text-xs truncate mt-0.5">{user.email}</p>
          </div>

          {/* Menu items */}
          <div className="p-2">
            <Link
              to={dashboardPath()}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <LayoutDashboard size={15} /> Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-200 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <LogOut size={15} /> Sign Out
            </button>

            <div className="border-t border-gray-700 my-1.5" />

            <button
              onClick={handleDeleteAccount}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={15} /> Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
