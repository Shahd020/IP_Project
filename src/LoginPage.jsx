import React, { useState } from 'react';
import { Mail, Lock, User, Briefcase, ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from './hooks/useAuth.js';

function LoginPage({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (isSignUp && !formData.name.trim()) {
      newErrors.name = 'Name is required.';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      // ---> UPDATED: Clearer error message for any domain <---
      newErrors.email = 'Please enter a valid email (e.g., name@gmail.com).';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validateForm()) return;

    try {
      let user;
      if (isSignUp) {
        user = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role.toLowerCase(),
        });
      } else {
        user = await login(formData.email, formData.password);
      }

      if (onLogin) onLogin(user.role);

      if (user.role === 'student') navigate('/student');
      else if (user.role === 'instructor') navigate('/instructor');
      else navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Main Sliding Container */}
      <div className="relative w-full max-w-4xl h-[600px] bg-[#1f2937] rounded-3xl shadow-2xl border border-gray-800 overflow-hidden z-10 hidden md:block">
        
        {/* ================= SIGN UP FORM (Left Side) ================= */}
        <div className={`absolute top-0 left-0 h-full w-1/2 p-12 transition-all duration-700 ease-in-out flex flex-col justify-center ${isSignUp ? 'translate-x-full opacity-100 z-50' : 'opacity-0 z-10 pointer-events-none'}`}>
          <h2 className="text-3xl font-extrabold text-white mb-2 text-center">Create Account</h2>
          <p className="text-gray-400 text-sm text-center mb-8">Join 100K+ students and start learning.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><User size={18} /></div>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className={`w-full bg-[#0f172a] text-white pl-11 pr-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-700 focus:border-blue-500'} focus:outline-none transition-colors`} />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.name}</p>}
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><Mail size={18} /></div>
                <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className={`w-full bg-[#0f172a] text-white pl-11 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-700 focus:border-blue-500'} focus:outline-none transition-colors`} />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><Lock size={18} /></div>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password (Min. 6 chars)" className={`w-full bg-[#0f172a] text-white pl-11 pr-4 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-700 focus:border-blue-500'} focus:outline-none transition-colors`} />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>}
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><Briefcase size={18} /></div>
                <select name="role" value={formData.role} onChange={handleChange} className={`w-full bg-[#0f172a] text-white pl-11 pr-4 py-3 rounded-xl border ${errors.role ? 'border-red-500' : 'border-gray-700 focus:border-blue-500'} focus:outline-none transition-colors appearance-none cursor-pointer`}>
                  <option value="" disabled>Select your role</option>
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              {errors.role && <p className="text-red-400 text-xs mt-1 ml-1">{errors.role}</p>}
            </div>

            {apiError && <p className="text-red-400 text-sm text-center">{apiError}</p>}
            {/* ---> UPDATED: Darker Button Colors <--- */}
            <button type="submit" className="w-full bg-gradient-to-r from-blue-900 to-indigo-950 hover:from-blue-800 hover:to-indigo-900 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg transition-transform hover:-translate-y-0.5 mt-2">
              Sign Up
            </button>
          </form>
        </div>

        {/* ================= SIGN IN FORM (Left Side initially) ================= */}
        <div className={`absolute top-0 left-0 h-full w-1/2 p-12 transition-all duration-700 ease-in-out flex flex-col justify-center ${isSignUp ? 'translate-x-full opacity-0 z-10 pointer-events-none' : 'opacity-100 z-50'}`}>
          <div className="flex justify-center mb-4 text-blue-400"><BookOpen size={48} /></div>
          <h2 className="text-3xl font-extrabold text-white mb-2 text-center">Welcome Back</h2>
          <p className="text-gray-400 text-sm text-center mb-8">Enter your credentials to access your dashboard.</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><Mail size={18} /></div>
                <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className={`w-full bg-[#0f172a] text-white pl-11 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-700 focus:border-blue-500'} focus:outline-none transition-colors`} />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><Lock size={18} /></div>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className={`w-full bg-[#0f172a] text-white pl-11 pr-4 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-700 focus:border-blue-500'} focus:outline-none transition-colors`} />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>}
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500"><Briefcase size={18} /></div>
                <select name="role" value={formData.role} onChange={handleChange} className={`w-full bg-[#0f172a] text-white pl-11 pr-4 py-3 rounded-xl border ${errors.role ? 'border-red-500' : 'border-gray-700 focus:border-blue-500'} focus:outline-none transition-colors appearance-none cursor-pointer`}>
                  <option value="" disabled>Select destination role</option>
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              {errors.role && <p className="text-red-400 text-xs mt-1 ml-1">{errors.role}</p>}
            </div>

            {apiError && <p className="text-red-400 text-sm text-center">{apiError}</p>}
            {/* ---> UPDATED: Darker Button Colors <--- */}
            <button type="submit" className="w-full bg-gradient-to-r from-blue-900 to-indigo-950 hover:from-blue-800 hover:to-indigo-900 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg transition-transform hover:-translate-y-0.5">
              Sign In
            </button>
          </form>
        </div>
        
        {/* ================= THE SLIDING OVERLAY ================= */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-[100] ${isSignUp ? '-translate-x-full' : ''}`}>
          
          <div className={`bg-gradient-to-r from-blue-900 to-indigo-950 relative -left-full h-full w-[200%] transform transition-transform duration-700 ease-in-out ${isSignUp ? 'translate-x-1/2' : 'translate-x-0'}`}>
            
            {/* Overlay Left Panel (Active when Sign Up is showing) */}
            <div className={`absolute top-0 left-0 flex flex-col items-center justify-center w-1/2 h-full px-12 text-center transition-transform duration-700 ease-in-out ${isSignUp ? 'translate-x-0' : '-translate-x-[20%]'}`}>
              <h2 className="text-4xl font-bold text-white mb-4">Welcome Back!</h2>
              <p className="text-blue-200 mb-8 leading-relaxed">Already have an account? Sign in to pick up right where you left off.</p>
              <button 
                onClick={() => { setIsSignUp(false); setErrors({}); }} 
                className="border-2 border-gray-400 text-gray-200 hover:border-white hover:text-blue-900 hover:bg-white px-10 py-3 rounded-full font-bold uppercase tracking-wider transition-colors"
              >
                Sign In
              </button>
            </div>

            {/* Overlay Right Panel (Active when Sign In is showing) */}
            <div className={`absolute top-0 right-0 flex flex-col items-center justify-center w-1/2 h-full px-12 text-center transition-transform duration-700 ease-in-out ${isSignUp ? 'translate-x-[20%]' : 'translate-x-0'}`}>
              <h2 className="text-4xl font-bold text-white mb-4">Hello, Learner!</h2>
              <p className="text-blue-200 mb-8 leading-relaxed">Enter your personal details and start your journey with us today.</p>
              <button 
                onClick={() => { setIsSignUp(true); setErrors({}); }} 
                className="border-2 border-gray-400 text-gray-200 hover:border-white hover:text-indigo-900 hover:bg-white px-10 py-3 rounded-full font-bold uppercase tracking-wider transition-colors"
              >
                Sign Up
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Mobile Fallback (Stacks vertically on small screens) */}
      <div className="md:hidden w-full max-w-md bg-[#1f2937] rounded-3xl p-8 shadow-2xl border border-gray-800 z-10">
         <h2 className="text-2xl font-bold text-center mb-6">Please use a desktop browser for the full animated experience!</h2>
         <p className="text-gray-400 text-center">Mobile layout coming soon.</p>
      </div>

    </div>
  );
}

export default LoginPage;