import { useState } from "react";

function CreateCourse() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Create New Course
      </h1>

      <div className="bg-[#1f2937] p-6 rounded-xl space-y-4">

        <input
          type="text"
          placeholder="Course Title"
          className="w-full p-3 rounded bg-[#0f172a]"
          onChange={(e)=>setTitle(e.target.value)}
        />

        <textarea
          placeholder="Course Description"
          className="w-full p-3 rounded bg-[#0f172a]"
          rows="4"
          onChange={(e)=>setDescription(e.target.value)}
        />

        <button className="bg-blue-500 px-6 py-2 rounded">
          Save Course
        </button>

      </div>

    </div>
  );
}

export default CreateCourse;