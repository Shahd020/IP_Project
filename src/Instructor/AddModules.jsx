import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Trash2, Loader, AlertCircle, CheckCircle } from "lucide-react";
import useModules from "../hooks/useModules";

const CONTENT_TYPES = ["video", "pdf", "text", "link"];

const emptyItem = () => ({ type: "video", title: "", url: "", body: "", duration: "" });

const emptyForm = () => ({
  title: "",
  description: "",
  content: [emptyItem()],
});

function AddModules() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");

  const { modules, loading, error, addModule, removeModule } = useModules(courseId);

  const [form, setForm] = useState(emptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const setField = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const setItem = (index, field) => (e) => {
    const items = [...form.content];
    items[index] = { ...items[index], [field]: e.target.value };
    setForm((f) => ({ ...f, content: items }));
  };

  const addItem = () =>
    setForm((f) => ({ ...f, content: [...f.content, emptyItem()] }));

  const removeItem = (index) =>
    setForm((f) => ({
      ...f,
      content: f.content.filter((_, i) => i !== index),
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId) { setFormError("No course selected. Open this page from My Courses."); return; }
    if (!form.title.trim()) { setFormError("Module title is required"); return; }

    setFormError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const content = form.content
        .filter((item) => item.title.trim())
        .map((item) => ({
          type: item.type,
          title: item.title.trim(),
          url: item.url || null,
          body: item.body || null,
          duration: item.duration ? parseInt(item.duration, 10) : 0,
        }));

      await addModule({ title: form.title, description: form.description, content });
      setForm(emptyForm());
      setSuccess("Module added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to add module");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (moduleId, title) => {
    if (!window.confirm(`Delete module "${title}"?`)) return;
    try {
      await removeModule(moduleId);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete module");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Course Modules</h1>

      {!courseId && (
        <div className="flex items-center gap-2 py-4 px-4 bg-yellow-900/30 border border-yellow-600 rounded-xl text-yellow-300 mb-6 text-sm">
          <AlertCircle size={18} />
          No course selected. Navigate here via the <strong className="mx-1">Modules</strong> button on a course card.
        </div>
      )}

      {/* Existing Modules */}
      {loading && (
        <div className="flex items-center gap-3 text-gray-400 mb-6">
          <Loader size={18} className="animate-spin" /> Loading modules…
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center gap-2 text-red-300 bg-red-900/30 border border-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {!loading && modules.length > 0 && (
        <div className="mb-8 space-y-3">
          {modules.map((mod, idx) => (
            <div
              key={mod._id}
              className="flex items-center justify-between bg-[#1f2937] px-5 py-4 rounded-xl"
            >
              <div>
                <span className="text-xs text-gray-500 mr-2">#{idx + 1}</span>
                <span className="font-semibold">{mod.title}</span>
                {mod.content?.length > 0 && (
                  <span className="ml-3 text-xs text-gray-400">
                    {mod.content.length} item{mod.content.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDelete(mod._id, mod.title)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Module Form */}
      <div className="bg-[#1f2937] p-6 rounded-xl space-y-5">
        <h2 className="text-lg font-semibold border-b border-gray-700 pb-3">Add New Module</h2>

        {formError && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <AlertCircle size={14} /> {formError}
          </p>
        )}
        {success && (
          <p className="text-green-400 text-sm flex items-center gap-1">
            <CheckCircle size={14} /> {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Module Title *</label>
            <input
              type="text"
              placeholder="e.g. Introduction to Variables"
              value={form.title}
              onChange={setField("title")}
              className="w-full p-3 rounded bg-[#0f172a] border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Description</label>
            <textarea
              placeholder="Brief description of what this module covers"
              value={form.description}
              onChange={setField("description")}
              rows="2"
              className="w-full p-3 rounded bg-[#0f172a] border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Content Items */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-gray-300 text-sm font-medium">Content Items</label>
              <button
                type="button"
                onClick={addItem}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
              >
                <Plus size={14} /> Add Item
              </button>
            </div>

            {form.content.map((item, index) => (
              <div key={index} className="bg-[#0f172a] p-4 rounded-lg mb-3 border border-slate-700">
                {/* Row 1: type selector + item title + remove */}
                <div className="flex gap-3 mb-3">
                  <select
                    value={item.type}
                    onChange={setItem(index, "type")}
                    className="p-2 rounded bg-[#1f2937] border border-slate-600 text-sm"
                  >
                    {CONTENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Item title (required)"
                    value={item.title}
                    onChange={setItem(index, "title")}
                    className="flex-1 p-2 rounded bg-[#1f2937] border border-slate-600 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />

                  {form.content.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* Row 2: URL + optional duration */}
                {item.type !== "text" && (
                  <div className="flex gap-3">
                    <input
                      type="url"
                      placeholder="URL"
                      value={item.url}
                      onChange={setItem(index, "url")}
                      className="flex-1 p-2 rounded bg-[#1f2937] border border-slate-600 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {item.type === "video" && (
                      <input
                        type="number"
                        placeholder="Duration (min)"
                        min="0"
                        value={item.duration}
                        onChange={setItem(index, "duration")}
                        className="w-36 p-2 rounded bg-[#1f2937] border border-slate-600 text-sm"
                      />
                    )}
                  </div>
                )}

                {item.type === "text" && (
                  <textarea
                    placeholder="Text content"
                    value={item.body}
                    onChange={setItem(index, "body")}
                    rows="3"
                    className="w-full p-2 rounded bg-[#1f2937] border border-slate-600 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting || !courseId}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            {submitting && <Loader size={14} className="animate-spin" />}
            Add Module
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddModules;
