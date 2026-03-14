import React, { useState } from "react";
import { FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

function LoginPage({ onLogin }) {
  const [isActive, setIsActive] = useState(false);
  const [role, setRole] = useState("admin");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#c9d6ff] bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] font-['Montserrat',_sans-serif]">

      {/* Main Container */}
      <div className="bg-white rounded-[30px] shadow-[0_5px_15px_rgba(0,0,0,0.35)] relative overflow-hidden w-[768px] max-w-full min-h-[480px]">

        {/* SIGN UP */}
        <div
          className={`absolute top-0 h-full transition-all duration-[600ms] ease-in-out left-0 w-1/2 ${
            isActive ? "translate-x-full opacity-100 z-[5]" : "opacity-0 z-[1]"
          }`}
        >
          <form className="bg-white flex flex-col items-center justify-center px-[40px] h-full text-center">
            <h1 className="font-bold text-3xl">Create Account</h1>

            <div className="my-[20px] flex gap-2">
              <a className="border border-[#ccc] rounded-[20%] flex justify-center items-center w-[40px] h-[40px]"><FaGoogle /></a>
              <a className="border border-[#ccc] rounded-[20%] flex justify-center items-center w-[40px] h-[40px]"><FaFacebookF /></a>
              <a className="border border-[#ccc] rounded-[20%] flex justify-center items-center w-[40px] h-[40px]"><FaGithub /></a>
              <a className="border border-[#ccc] rounded-[20%] flex justify-center items-center w-[40px] h-[40px]"><FaLinkedinIn /></a>
            </div>

            <span className="text-[12px]">or use your email for registration</span>

            <input type="text" placeholder="Name" className="bg-[#eee] my-[8px] py-[10px] px-[15px] rounded-[8px] w-full" />
            <input type="email" placeholder="Email" className="bg-[#eee] my-[8px] py-[10px] px-[15px] rounded-[8px] w-full" />
            <input type="password" placeholder="Password" className="bg-[#eee] my-[8px] py-[10px] px-[15px] rounded-[8px] w-full" />

            <button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-[12px] py-[10px] px-[45px] rounded-[8px] mt-[10px]">
              Sign Up
            </button>
          </form>
        </div>

        {/* SIGN IN */}
        <div
          className={`absolute top-0 h-full transition-all duration-[600ms] ease-in-out left-0 w-1/2 z-[2] bg-white ${
            isActive ? "translate-x-full" : ""
          }`}
        >
          <form className="bg-white flex flex-col items-center justify-center px-[40px] h-full text-center">
            <h1 className="font-bold text-3xl">Sign In</h1>

            <div className="my-[20px] flex gap-2">
              <a className="border border-[#ccc] rounded-[20%] flex justify-center items-center w-[40px] h-[40px]"><FaGoogle /></a>
              <a className="border border-[#ccc] rounded-[20%] flex justify-center items-center w-[40px] h-[40px]"><FaFacebookF /></a>
              <a className="border border-[#ccc] rounded-[20%] flex justify-center items-center w-[40px] h-[40px]"><FaGithub /></a>
              <a className="border border-[#ccc] rounded-[20%] flex justify-center items-center w-[40px] h-[40px]"><FaLinkedinIn /></a>
            </div>

            <span className="text-[12px]">or use your email password</span>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-[#eee] my-[8px] py-[10px] px-[15px] rounded-[8px] w-full"
            >
              <option value="admin">Admin</option>
              <option value="instructor">Instructor</option>
              <option value="student">Student</option>
            </select>

            <input type="email" placeholder="Email" className="bg-[#eee] my-[8px] py-[10px] px-[15px] rounded-[8px] w-full" />
            <input type="password" placeholder="Password" className="bg-[#eee] my-[8px] py-[10px] px-[15px] rounded-[8px] w-full" />

            <button
              type="button"
              onClick={() => onLogin(role)}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-[12px] py-[10px] px-[45px] rounded-[8px] mt-[10px]"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* OVERLAY */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-[600ms] ease-in-out z-[1000] ${
            isActive ? "-translate-x-full rounded-[0_150px_100px_0]" : "rounded-[150px_0_0_100px]"
          }`}
        >
          <div
            className={`bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white relative -left-full h-full w-[200%] transition-all duration-[600ms] ${
              isActive ? "translate-x-1/2" : ""
            }`}
          >

            {/* LEFT PANEL */}
            <div className={`absolute w-1/2 h-full flex flex-col items-center justify-center text-center px-[30px] ${isActive ? "" : "-translate-x-[200%]"}`}>
              <h1 className="text-3xl font-bold">Welcome Back!</h1>
              <p className="text-[14px] my-[20px]">Enter your personal details</p>
              <button
                onClick={() => setIsActive(false)}
                className="border border-white px-[45px] py-[10px] rounded-[8px]"
              >
                Sign In
              </button>
            </div>

            {/* RIGHT PANEL */}
            <div className={`absolute w-1/2 h-full flex flex-col items-center justify-center text-center px-[30px] right-0 ${isActive ? "translate-x-[200%]" : ""}`}>
              <h1 className="text-3xl font-bold">Hello, Friend!</h1>
              <p className="text-[14px] my-[20px]">Register to use all features</p>
              <button
                onClick={() => setIsActive(true)}
                className="border border-white px-[45px] py-[10px] rounded-[8px]"
              >
                Sign Up
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;