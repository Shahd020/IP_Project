import React, { useState } from "react";
import { Loader, AlertCircle } from "lucide-react";
import useUsers from "../hooks/useUsers";

function ManageUsers() {
  const { users, loading, error, addUser, editUser, removeUser } = useUsers();

  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole]   = useState("Student");

  const [editingId, setEditingId]     = useState(null);
  const [formError, setFormError]     = useState("");
  const [submitting, setSubmitting]   = useState(false);

  const resetForm = () => {
    setName(""); setEmail(""); setRole("Student");
    setEditingId(null); setFormError("");
  };

  const handleAdd = async () => {
    if (!name.trim() || !email.trim()) { setFormError("Please fill all fields"); return; }
    if (!email.includes("@"))          { setFormError("Email must contain @");   return; }
    setSubmitting(true);
    try {
      await addUser({ name, email, role });
      resetForm();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) { setFormError("Please fill all fields"); return; }
    setSubmitting(true);
    try {
      await editUser(editingId, { name, email, role });
      resetForm();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (user) => {
    if (user.role === "Admin") { alert("Admin cannot be deleted"); return; }
    if (!window.confirm(`Delete ${user.name}?`)) return;
    try {
      await removeUser(user.id);
    } catch (err) {
      alert(err.message);
    }
  };

  const startEdit = (user) => {
    setName(user.name); setEmail(user.email); setRole(user.role);
    setEditingId(user.id); setFormError("");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      <div className="bg-[#1f2937] p-6 rounded-xl">

        {/* Form */}
        <div className="flex flex-wrap gap-4 mb-2">
          <input value={name}  onChange={(e) => setName(e.target.value)}  placeholder="Name"  className="p-2 rounded text-black" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="p-2 rounded text-black" />
          <select value={role} onChange={(e) => setRole(e.target.value)} className="p-2 rounded text-black">
            <option>Student</option>
            <option>Instructor</option>
            <option>Admin</option>
          </select>

          {editingId === null ? (
            <button
              onClick={handleAdd}
              disabled={submitting}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && <Loader size={14} className="animate-spin" />} Add User
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={submitting}
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && <Loader size={14} className="animate-spin" />} Save
              </button>
              <button onClick={resetForm} className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700">
                Cancel
              </button>
            </>
          )}
        </div>

        {/* Inline form error */}
        {formError && (
          <p className="text-red-400 text-sm mb-4 flex items-center gap-1">
            <AlertCircle size={14} /> {formError}
          </p>
        )}

        {/* API-level error */}
        {error && (
          <div className="mb-4 flex items-center gap-2 text-red-300 bg-red-900/30 border border-red-700 rounded-lg px-4 py-2 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-2 py-6 text-gray-400">
            <Loader size={20} className="animate-spin" /> Loading users…
          </div>
        )}

        {/* Table */}
        {!loading && (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-700 hover:bg-[#374151]">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => startEdit(user)}
                      className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    {user.role.toLowerCase() !== "admin" && (
                      <button
                        onClick={() => handleDelete(user)}
                        className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-400">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;
