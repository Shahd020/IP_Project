import React from "react";

function Help() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Help</h1>

      <div className="bg-[#1f2937] p-6 rounded-xl space-y-4">

        <div>
          <h3 className="font-semibold">How to add a user?</h3>
          <p className="text-gray-400">
            Go to Manage Users and click the Add User button.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">How to monitor courses?</h3>
          <p className="text-gray-400">
            Open the Courses page from the sidebar.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Help;