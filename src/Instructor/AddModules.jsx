import { useState } from "react";

function AddModules() {

  const [module, setModule] = useState("");

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Course Modules
      </h1>

      <div className="bg-[#1f2937] p-6 rounded-xl space-y-4">

        <input
          type="text"
          placeholder="Module Name"
          className="w-full p-3 rounded bg-[#0f172a]"
          onChange={(e)=>setModule(e.target.value)}
        />

        <button className="bg-blue-500 px-6 py-2 rounded">
          Add Module
        </button>

      </div>

    </div>
  );
}

export default AddModules;