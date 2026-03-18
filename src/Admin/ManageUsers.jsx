import React, { useState, useEffect } from "react";

function ManageUsers() {

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) return JSON.parse(savedUsers);

    return [
      { name: "John Doe", email: "john@email.com", role: "Student" },
      { name: "Sara Ali", email: "sara@email.com", role: "Instructor" },
      { name: "System Admin", email: "admin@email.com", role: "Admin" }
    ];
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Student");

  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const addUser = () => {

  if (!name || !email) {
    alert("Please fill all fields");
    return;
  }

  if (!email.includes("@")) {
    alert("Email must contain @");
    return;
  }

  const newUser = { name, email, role };
  setUsers([...users, newUser]);

  setName("");
  setEmail("");
  setRole("Student");
};

  const deleteUser = (index) => {

    if (users[index].role === "Admin") {
      alert("Admin cannot be deleted");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    const updated = users.filter((_, i) => i !== index);
    setUsers(updated);
  };

  const startEdit = (index) => {
    setName(users[index].name);
    setEmail(users[index].email);
    setRole(users[index].role);
    setEditingIndex(index);
  };

  const saveEdit = () => {
    const updated = [...users];
    updated[editingIndex] = { name, email, role };

    setUsers(updated);
    setEditingIndex(null);

    setName("");
    setEmail("");
    setRole("Student");
  };

  

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      <div className="bg-[#1f2937] p-6 rounded-xl">

        {/* Inputs */}
        <div className="flex gap-4 mb-6">

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded text-black"
          />

          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded text-black"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-2 rounded text-black"
          >
            <option>Student</option>
            <option>Instructor</option>
            <option>Admin</option>
          </select>

          {editingIndex === null ? (
            <button
              onClick={addUser}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Add User
            </button>
          ) : (
            <button
              onClick={saveEdit}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              Save
            </button>
          )}

        </div>

        {/* Table */}
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

            {users.map((user, index) => (
              <tr key={index} className="border-b border-gray-700 hover:bg-[#374151]">

                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>

                <td className="p-3">
                    {user.role}
                </td>

                <td className="p-3 flex gap-2">

  <button
    onClick={() => startEdit(index)}
    className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
  >
    Edit
  </button>

  {(user.role.toLowerCase() === "student" || user.role.toLowerCase() === "instructor") && (
    <button
      onClick={() => deleteUser(index)}
      className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
    >
      Delete
    </button>
  )}

</td>

                

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ManageUsers;