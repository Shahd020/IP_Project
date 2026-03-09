import React, { useState } from 'react';
import { FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';

const AuthPage = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#c9d6ff] bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] font-['Montserrat',_sans-serif]">
      
      {/* Main Container */}
      <div className="bg-white rounded-[30px] shadow-[0_5px_15px_rgba(0,0,0,0.35)] relative overflow-hidden w-[768px] max-w-full min-h-[480px]">

        {/* ==================================================== */}
        {/* 1. SIGN UP FORM                                      */}
        {/* ==================================================== */}
        <div 
          className={`absolute top-0 h-full transition-all duration-[600ms] ease-in-out left-0 w-1/2 ${
            isActive ? 'translate-x-full opacity-100 z-[5] animate-[move_0.6s]' : 'opacity-0 z-[1]'
          }`}
        >
          <form className="bg-white flex flex-col items-center justify-center px-[40px] h-full text-center">
            <h1 className="font-bold text-3xl m-0">Create Account</h1>
            
            <div className="my-[20px] flex gap-2">
              <a href="#" className="border border-[#ccc] rounded-[20%] flex justify-center items-center w-[40px] h-[40px] text-[#333] hover:bg-gray-50 transition-colors"><FaGoogle /></a>
              <a href="#" className="border border-[#ccc] rounded-[20%] flex justify-center items-center w-[40px] h-[40px] text-[#333] hover:bg-gray-50 transition-colors"><FaFacebookF /></a>
              <a href="#" className="border border-[#ccc] rounded-[20%] flex justify-center items-center w-[40px] h-[40px] text-[#333] hover:bg-gray-50 transition-colors"><FaGithub /></a>
              <a href="#" className="border border-[#ccc] rounded-[20%] flex justify-center items-center w-[40px] h-[40px] text-[#333] hover:bg-gray-50 transition-colors"><FaLinkedinIn /></a>
            </div>
            
            <span className="text-[12px] tracking-wide">or use your email for registration</span>
            
            <input type="text" placeholder="Name" className="bg-[#eee] border-none my-[8px] py-[10px] px-[15px] text-[13px] rounded-[8px] w-full outline-none focus:bg-[#e4e4e4] transition-colors" />
            <input type="email" placeholder="Email" className="bg-[#eee] border-none my-[8px] py-[10px] px-[15px] text-[13px] rounded-[8px] w-full outline-none focus:bg-[#e4e4e4] transition-colors" />
            <input type="password" placeholder="Password" className="bg-[#eee] border-none my-[8px] py-[10px] px-[15px] text-[13px] rounded-[8px] w-full outline-none focus:bg-[#e4e4e4] transition-colors" />
            
            <button 
              type="button"
              className="bg-[#512da8] text-white text-[12px] py-[10px] px-[45px] rounded-[8px] font-semibold tracking-[0.5px] uppercase mt-[10px] cursor-pointer transition-transform active:scale-95"
            >
              Sign Up
            </button>
          </form>
        </div>

        {/* ==================================================== */}
        {/* 2. SIGN IN FORM                                      */}
        {/* ==================================================== */}
        <div 
          className={`absolute top-0 h-full transition-all duration-[600ms] ease-in-out left-0 w-1/2 z-[2] bg-white ${
            isActive ? 'translate-x-full' : ''
          }`}
        >
          <form className="bg-white flex flex-col items-center justify-center px-[40px] h-full text-center">
            <h1 className="font-bold text-3xl m-0">Sign In</h1>
            
            <div className="my-[20px] flex gap-2">
              <a href="#" className="border border-[#ccc] rounded-[20%] flex justify-center items-center w-[40px] h-[40px] text-[#333] hover:bg-gray-50 transition-colors"><FaGoogle /></a>
              <a href="#" className="border border-[#ccc] rounded-[20%] flex justify-center items-center w-[40px] h-[40px] text-[#333] hover:bg-gray-50 transition-colors"><FaFacebookF /></a>
              <a href="#" className="border border-[#ccc] rounded-[20%] flex justify-center items-center w-[40px] h-[40px] text-[#333] hover:bg-gray-50 transition-colors"><FaGithub /></a>
              <a href="#" className="border border-[#ccc] rounded-[20%] flex justify-center items-center w-[40px] h-[40px] text-[#333] hover:bg-gray-50 transition-colors"><FaLinkedinIn /></a>
            </div>
            
            <span className="text-[12px] tracking-wide">or use your email password</span>
            
            <input type="email" placeholder="Email" className="bg-[#eee] border-none my-[8px] py-[10px] px-[15px] text-[13px] rounded-[8px] w-full outline-none focus:bg-[#e4e4e4] transition-colors" />
            <input type="password" placeholder="Password" className="bg-[#eee] border-none my-[8px] py-[10px] px-[15px] text-[13px] rounded-[8px] w-full outline-none focus:bg-[#e4e4e4] transition-colors" />
            
            <a href="#" className="text-[#333] text-[13px] no-underline my-[15px] mt-[10px] hover:underline">Forget Your Password?</a>
            
            <button 
              type="button"
              className="bg-[#512da8] text-white text-[12px] py-[10px] px-[45px] rounded-[8px] font-semibold tracking-[0.5px] uppercase mt-[10px] cursor-pointer transition-transform active:scale-95"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* ==================================================== */}
        {/* 3. SLIDING TOGGLE OVERLAY                            */}
        {/* ==================================================== */}
        <div 
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-[600ms] ease-in-out z-[1000] ${
            isActive ? '-translate-x-full rounded-[0_150px_100px_0]' : 'rounded-[150px_0_0_100px]'
          }`}
        >
          {/* Purple Gradient Background */}
          <div 
            className={`bg-[#512da8] bg-gradient-to-r from-[#5c6bc0] to-[#512da8] text-white relative -left-full h-full w-[200%] transition-all duration-[600ms] ease-in-out ${
              isActive ? 'translate-x-1/2' : 'translate-x-0'
            }`}
          >

            {/* Left Side (Visible when Sign Up is active) */}
            <div 
              className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-[30px] text-center top-0 transition-all duration-[600ms] ease-in-out ${
                isActive ? 'translate-x-0' : '-translate-x-[200%]'
              }`}
            >
              <h1 className="font-bold text-3xl m-0">Welcome Back!</h1>
              <p className="text-[14px] leading-[20px] tracking-[0.3px] my-[20px]">
                Enter your personal details to use all of site features
              </p>
              <button 
                onClick={() => setIsActive(false)}
                className="bg-transparent border border-white text-white text-[12px] py-[10px] px-[45px] rounded-[8px] font-semibold tracking-[0.5px] uppercase mt-[10px] cursor-pointer transition-transform active:scale-95 hover:bg-white/10"
              >
                Sign In
              </button>
            </div>

            {/* Right Side (Visible when Sign In is active) */}
            <div 
              className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-[30px] text-center top-0 right-0 transition-all duration-[600ms] ease-in-out ${
                isActive ? 'translate-x-[200%]' : 'translate-x-0'
              }`}
            >
              <h1 className="font-bold text-3xl m-0">Hello, Friend!</h1>
              <p className="text-[14px] leading-[20px] tracking-[0.3px] my-[20px]">
                Register with your personal details to use all of site features
              </p>
              <button 
                onClick={() => setIsActive(true)}
                className="bg-transparent border border-white text-white text-[12px] py-[10px] px-[45px] rounded-[8px] font-semibold tracking-[0.5px] uppercase mt-[10px] cursor-pointer transition-transform active:scale-95 hover:bg-white/10"
              >
                Sign Up
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
