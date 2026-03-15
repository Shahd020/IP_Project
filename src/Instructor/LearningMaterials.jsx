
import React, { useState, useEffect } from "react";
import { FileText, Download, Trash2 } from "lucide-react";

function LearningMaterials() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [materials, setMaterials] = useState([]);

  // Load saved materials when page opens
  useEffect(() => {
    const savedMaterials = JSON.parse(localStorage.getItem("materials")) || [];
    setMaterials(savedMaterials);
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please choose a file first");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {

      const newMaterial = {
        id: Date.now(),
        name: selectedFile.name,
        size: (selectedFile.size / 1024).toFixed(2) + " KB",
        data: event.target.result
      };

      const updatedMaterials = [...materials, newMaterial];

      setMaterials(updatedMaterials);

      // Save to localStorage
      localStorage.setItem("materials", JSON.stringify(updatedMaterials));

      setSelectedFile(null);
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleDelete = (id) => {
    const updatedMaterials = materials.filter((m) => m.id !== id);
    setMaterials(updatedMaterials);
    localStorage.setItem("materials", JSON.stringify(updatedMaterials));
  };

  const handleDownload = (material) => {
    const link = document.createElement("a");
    link.href = material.data;
    link.download = material.name;
    link.click();
  };

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Upload Learning Materials
      </h1>

      <div className="bg-[#1f2937] p-6 rounded-xl space-y-4">

        <input
          type="file"
          onChange={handleFileChange}
          className="w-full p-3 bg-[#0f172a] rounded"
        />

        {selectedFile && (
          <p className="text-gray-300 text-sm">
            Selected file: {selectedFile.name}
          </p>
        )}

        <button
          onClick={handleUpload}
          className="bg-blue-500 px-6 py-2 rounded hover:bg-blue-600"
        >
          Upload
        </button>

      </div>

      <div className="mt-8 space-y-4">

        {materials.length === 0 ? (
          <p className="text-gray-400">No materials uploaded yet</p>
        ) : (

          materials.map((material) => (

            <div
              key={material.id}
              className="flex justify-between items-center bg-[#1f2937] p-4 rounded-lg"
            >

              <div className="flex items-center gap-3">

                <FileText className="text-blue-400" />

                <div>
                  <p>{material.name}</p>
                  <p className="text-sm text-gray-400">
                    {material.size}
                  </p>
                </div>

              </div>

              <div className="flex gap-3">

                <button
                  onClick={() => handleDownload(material)}
                  className="bg-green-500 p-2 rounded hover:bg-green-600"
                >
                  <Download size={16} />
                </button>

                <button
                  onClick={() => handleDelete(material.id)}
                  className="bg-red-500 p-2 rounded hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default LearningMaterials;
