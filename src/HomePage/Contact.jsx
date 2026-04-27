import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import PublicNavbar from "../components/PublicNavbar.jsx";
import PublicFooter from "../components/PublicFooter.jsx";

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pt-20">
      <PublicNavbar activePage="/contact" />

      {/* Hero */}
      <div className="px-6 sm:px-10 lg:px-20 py-16 sm:py-20 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
          Have questions? We're here to help! Get in touch with our team and we'll respond as soon as possible.
        </p>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-10 lg:px-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Contact Form */}
          <div className="bg-[#1f2937] rounded-2xl border border-gray-800 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Send us a Message</h2>

            {submitted && (
              <div className="mb-4 px-4 py-3 bg-green-900/40 border border-green-600 text-green-300 rounded-xl text-sm">
                Thank you! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
                  <input
                    type="text" name="name" value={formData.name} onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#0f172a] border border-gray-700 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#0f172a] border border-gray-700 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Subject</label>
                <input
                  type="text" name="subject" value={formData.subject} onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#0f172a] border border-gray-700 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Message</label>
                <textarea
                  name="message" value={formData.message} onChange={handleChange}
                  rows={6} required
                  className="w-full px-4 py-3 bg-[#0f172a] border border-gray-700 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-white resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3.5 rounded-xl font-bold transition-colors shadow-lg shadow-blue-900/30"
              >
                <Send size={18} /> Send Message
              </button>
            </form>
          </div>

          {/* Contact Info + FAQ */}
          <div className="space-y-6">
            <div className="bg-[#1f2937] rounded-2xl border border-gray-800 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500/20 border border-blue-500/30 p-3 rounded-xl shrink-0">
                    <Mail size={22} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Email</h3>
                    <p className="text-gray-400 text-sm">support@eduplatform.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-green-500/20 border border-green-500/30 p-3 rounded-xl shrink-0">
                    <Phone size={22} className="text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Phone</h3>
                    <p className="text-gray-400 text-sm">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-purple-500/20 border border-purple-500/30 p-3 rounded-xl shrink-0">
                    <MapPin size={22} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Address</h3>
                    <p className="text-gray-400 text-sm">123 Learning Street, Education City, EC 12345</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1f2937] rounded-2xl border border-gray-800 p-6 sm:p-8">
              <h2 className="text-xl font-bold mb-5">Quick Help</h2>
              <div className="space-y-4">
                {[
                  { q: 'How do I enroll in a course?', a: 'Simply browse our courses, click Enroll, and complete payment. Free courses enroll instantly.' },
                  { q: 'Do you offer refunds?', a: 'Yes, we offer a 30-day money-back guarantee on all paid courses — no questions asked.' },
                  { q: 'How do I get a certificate?', a: 'Complete all course modules and pass the final quiz with a score of 70% or above.' },
                ].map(({ q, a }) => (
                  <div key={q} className="border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                    <h3 className="font-semibold text-white text-sm mb-1">{q}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <PublicFooter />
    </div>
  );
}

export default Contact;
