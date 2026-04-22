import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, BookOpen, FileText, Loader, AlertCircle } from "lucide-react";
import apiClient from "../api/axios.js";

const CATEGORIES = ['Technology', 'Business', 'Design', 'Data Science', 'Health & Fitness', 'Languages'];
const LEVELS = ['beginner', 'intermediate', 'advanced'];

function CreateCourse() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "", description: "", category: "", level: "", price: "", duration: "", thumbnail: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price) || 0,
      };
      await apiClient.post("/courses", payload);
      navigate("/instructor/courses");
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Failed to create course";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <BookOpen size={30} />
        Create Course
      </h1>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-red-300 bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#1f2937] p-8 rounded-xl space-y-6 w-full max-w-6xl">

        <div>
          <label className="block text-gray-200 font-medium mb-2">Course Title</label>
          <input
            type="text"
            placeholder="Enter course title"
            value={form.title}
            onChange={set("title")}
            className="w-full p-3 rounded bg-[#0f172a] border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-200 font-medium mb-2">Course Description</label>
          <textarea
            placeholder="Enter course description"
            value={form.description}
            onChange={set("description")}
            rows="4"
            className="w-full p-3 rounded bg-[#0f172a] border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-200 font-medium mb-2">Category</label>
            <select
              value={form.category}
              onChange={set("category")}
              className="w-full p-3 rounded bg-[#0f172a] border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-gray-200 font-medium mb-2">Level</label>
            <select
              value={form.level}
              onChange={set("level")}
              className="w-full p-3 rounded bg-[#0f172a] border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Level</option>
              {LEVELS.map((l) => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-200 font-medium mb-2">Price (USD)</label>
            <input
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={form.price}
              onChange={set("price")}
              className="w-full p-3 rounded bg-[#0f172a] border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-200 font-medium mb-2">Duration</label>
            <input
              type="text"
              placeholder='e.g. "12 hours" or "8 weeks"'
              value={form.duration}
              onChange={set("duration")}
              className="w-full p-3 rounded bg-[#0f172a] border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-200 font-medium mb-2 flex items-center gap-2">
            <Upload size={18} /> Thumbnail URL
          </label>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={form.thumbnail}
            onChange={set("thumbnail")}
            className="w-full p-3 rounded bg-[#0f172a] border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-500 text-white px-8 py-3 rounded hover:bg-blue-600 transition disabled:opacity-50 flex items-center gap-2"
          >
            {submitting && <Loader size={16} className="animate-spin" />}
            Create Course
          </button>
          <button
            type="button"
            onClick={() => navigate("/instructor/courses")}
            className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCourse;
