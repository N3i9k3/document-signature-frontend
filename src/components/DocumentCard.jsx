// src/components/DocumentCard.jsx

const BACKEND_URL = "https://document-signature-backend-pewy.onrender.com";

const DocumentCard = ({ doc }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-6 flex flex-col justify-between h-full">
      {/* Title */}
      <h2 className="text-lg font-semibold mb-2 truncate">{doc.title}</h2>

      {/* Upload date */}
      <p className="text-sm text-gray-500 mb-4">
        Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
      </p>

      {/* Status and View button */}
      <div className="flex justify-between items-center mt-auto">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            doc.status === "Signed"
              ? "bg-green-100 text-green-800"
              : doc.status === "Rejected"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {doc.status}
        </span>

        <button
          onClick={() =>
            window.open(`${BACKEND_URL}${doc.filePath}`, "_blank")
          }
          className="text-blue-600 font-medium hover:underline text-sm"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;