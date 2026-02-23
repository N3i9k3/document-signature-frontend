import React from "react";

export default function Documents() {
  const files = [
    { name: "01_Cloud_Computing_Assignment.pdf", uploaded: "21/02/2026", status: "Pending" },
    { name: "01_Cloud_Computing_Assignment.pdf", uploaded: "20/02/2026", status: "Pending" },
    { name: "01_Cloud_Computing_Assignment.pdf", uploaded: "19/02/2026", status: "Signed" },
    { name: "01_Cloud_Computing_Assignment.pdf", uploaded: "18/02/2026", status: "Signed" },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4">My Documents</h1>
      <ul className="space-y-2">
        {files.map((file, idx) => (
          <li
            key={idx}
            className="p-4 bg-white rounded shadow hover:bg-gray-50 flex justify-between items-center"
          >
            {file.name}
            <span className="text-sm text-gray-500">Uploaded: {file.uploaded}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}