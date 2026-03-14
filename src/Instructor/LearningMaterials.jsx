function LearningMaterials() {

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Upload Learning Materials
      </h1>

      <div className="bg-[#1f2937] p-6 rounded-xl space-y-4">

        <input
          type="file"
          className="w-full p-3 bg-[#0f172a] rounded"
        />

        <button className="bg-blue-500 px-6 py-2 rounded">
          Upload
        </button>

      </div>

    </div>
  );
}

export default LearningMaterials;