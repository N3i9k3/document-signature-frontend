// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DocumentCard from "../components/DocumentCard";

// ✅ Create centralized API instance
const API = axios.create({
  baseURL: "https://document-signature-backend-pewy.onrender.com",
});

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // FILTER LOGIC
  const filteredDocs =
    filter === "All"
      ? documents
      : documents.filter((doc) => doc.status === filter);

  // FETCH DOCUMENTS
  useEffect(() => {
    const fetchDocuments = async () => {
      const storedUser = localStorage.getItem("userInfo");
      if (!storedUser) {
        navigate("/login");
        return;
      }

      const userInfo = JSON.parse(storedUser);

      try {
        const res = await API.get("/api/docs", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        setDocuments(res.data);
      } catch (error) {
        localStorage.removeItem("userInfo");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [navigate]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="p-6 bg-gray-200 rounded-xl animate-pulse h-48"
              ></div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header + Filters */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            My Documents
          </h1>

          <div className="flex flex-wrap gap-4">
            {["All", "Pending", "Signed", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg border transition font-medium ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* DOCUMENT GRID */}
        {filteredDocs.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            No documents found for this status.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => (
              <DocumentCard key={doc._id} doc={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;