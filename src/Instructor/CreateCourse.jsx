import React, { useState } from "react";
import { Upload, BookOpen, FileText } from "lucide-react";

function CreateCourse() {
  const [courseTitle, setCourseTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const courseData = {
      id: Date.now(),
      title: courseTitle,
      description: description,
      category: category,
      file: file ? file.name : null,
      image: image ? image.name : null
    };

    // Save to localStorage
    const existingCourses =
      JSON.parse(localStorage.getItem("courses")) || [];

    existingCourses.push(courseData);

    localStorage.setItem("courses", JSON.stringify(existingCourses));

    console.log("Course Created:", courseData);

    alert("Course Created Successfully!");

    // Reset form
    setCourseTitle("");
    setDescription("");
    setCategory("");
    setFile(null);
    setImage(null);
  };

  return (
    <div className="p-6 text-white">

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <BookOpen size={30} />
        Create Course
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#1f2937] p-8 rounded-xl space-y-6 w-full max-w-6xl"
      >

        {/* Course Title */}
        <div>
          <label className="block text-gray-200 font-medium mb-2">
            Course Title
          </label>

          <input
            type="text"
            placeholder="Enter course title"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            className="w-full p-3 rounded bg-[#0f172a] border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Course Description */}
        <div>
          <label className="block text-gray-200 font-medium mb-2">
            Course Description
          </label>

          <textarea
            placeholder="Enter course description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full p-3 rounded bg-[#0f172a] border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-200 font-medium mb-2">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 rounded bg-[#0f172a] border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Category</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Business">Business</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        {/* Upload Course Material */}
        <div>
          <label className="block text-gray-200 font-medium mb-2 flex items-center gap-2">
            <FileText size={18} />
            Upload Course Material
          </label>

          <input
            type="file"
            onChange={handleFileUpload}
            className="w-full p-2 rounded bg-[#0f172a] border border-slate-700 text-gray-300"
          />
        </div>

        {/* Upload Course Image */}
        <div>
          <label className="block text-gray-200 font-medium mb-2 flex items-center gap-2">
            <Upload size={18} />
            Upload Course Image
          </label>

          <input
            type="file"
            onChange={handleImageUpload}
            className="w-full p-2 rounded bg-[#0f172a] border border-slate-700 text-gray-300"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
        >
          Create Course
        </button>

      </form>

    </div>
  );
}

export default CreateCourse;