import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Mail, Phone, MapPin, Send } from "lucide-react";

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pt-20">

     

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1f2937] shadow border-b border-gray-800">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-10 py-4">
          <div className="justify-self-start text-xl font-bold text-white tracking-wide">
            <Link to="/">
              <span className="text-blue-500">Edu</span>Platform
            </Link>
          </div>

          <div className="justify-self-center flex gap-8 text-gray-300 font-medium">
            <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <Link to="/categories" className="hover:text-blue-400 transition-colors">Categories</Link>
            <Link to="/pages" className="hover:text-blue-400 transition-colors">Pages</Link>
            <Link to="/blog" className="hover:text-blue-400 transition-colors">Blog</Link>
            <Link to="/contact" className="hover:text-blue-400 transition-colors text-blue-400">Contact</Link>
          </div>

          <div className="justify-self-end flex items-center gap-6 text-gray-300">
            <Link
              to="/login"
              className="flex items-center gap-2 hover:text-blue-400 font-medium transition-colors bg-gray-800 px-4 py-2 rounded-lg border border-gray-700"
            >
              <User size={18} />
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-20 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Have questions? We're here to help! Get in touch with our team and we'll respond as soon as possible.
        </p>
      </div>

      {/* Contact Content */}
      <div className="px-20 pb-20">
        <div className="grid grid-cols-2 gap-12">

          {/* Contact Form */}
          <div className="bg-[#1f2937] rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0f172a] border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0f172a] border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0f172a] border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-3 bg-[#0f172a] border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none resize-none"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">

            {/* Contact Details */}
            <div className="bg-[#1f2937] rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-400">support@eduplatform.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-green-500 p-3 rounded-lg">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-gray-400">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-purple-500 p-3 rounded-lg">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-gray-400">123 Learning Street<br />Education City, EC 12345</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-[#1f2937] rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Quick Help</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">How do I enroll in a course?</h3>
                  <p className="text-gray-400 text-sm">Simply browse our courses, click enroll, and complete your payment.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
                  <p className="text-gray-400 text-sm">Yes, we offer a 30-day money-back guarantee on all courses.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">How do I get a certificate?</h3>
                  <p className="text-gray-400 text-sm">Complete all course modules and pass the final assessment.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1f2937] px-20 py-12">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">EduPlatform</h3>
            <p className="text-gray-400">
              Empowering learners worldwide with quality education and cutting-edge courses.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Courses</a></li>
              <li><a href="#" className="hover:text-white">Instructors</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white text-xl">📘</a>
              <a href="#" className="text-gray-400 hover:text-white text-xl">🐦</a>
              <a href="#" className="text-gray-400 hover:text-white text-xl">📷</a>
              <a href="#" className="text-gray-400 hover:text-white text-xl">💼</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 EduPlatform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Contact;