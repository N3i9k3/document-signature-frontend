import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect } from "react";
import axios from "axios";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

// 🔥 Production backend URL
const API = "https://document-signature-backend-pewy.onrender.com";

function PDFPreview({ fileUrl, documentId, token }) {
  const [numPages, setNumPages] = useState(null);
  const [signatures, setSignatures] = useState([]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // ✅ Fetch signatures
  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        const res = await axios.get(
          `${API}/api/signatures/${documentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSignatures(res.data);
      } catch (err) {
        console.error("Error fetching signatures:", err);
      }
    };

    if (documentId && token) {
      fetchSignatures();
    }
  }, [documentId, token]);

  // ✅ Create signature
  const handleClick = async (e, pageNumber) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const relativeX = clickX / rect.width;
    const relativeY = clickY / rect.height;

    try {
      const res = await axios.post(
        `${API}/api/public/sign`,
        {
          documentId,
          x: relativeX,
          y: relativeY,
          page: pageNumber,
          token,
        }
      );

      setSignatures((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error saving signature:", err);
    }
  };

  // ✅ Accept
  const handleAccept = async (id) => {
    try {
      const res = await axios.put(
        `${API}/api/signatures/${id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSignatures((prev) =>
        prev.map((sig) =>
          sig._id === id ? res.data.signature : sig
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Error accepting");
    }
  };

  // ✅ Reject
  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      const res = await axios.put(
        `${API}/api/signatures/${id}/reject`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSignatures((prev) =>
        prev.map((sig) =>
          sig._id === id ? res.data.signature : sig
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Error rejecting");
    }
  };

  return (
    <div className="mt-6 border p-4">
      <Document file={{ url: fileUrl }} onLoadSuccess={onDocumentLoadSuccess}>
        {numPages &&
          Array.from(new Array(numPages), (_, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                marginBottom: "20px",
                cursor: "crosshair",
              }}
              onClick={(e) => handleClick(e, index + 1)}
            >
              <Page pageNumber={index + 1} />

              {signatures
                .filter((sig) => sig.page === index + 1)
                .map((sig) => (
                  <div
                    key={sig._id}
                    style={{
                      position: "absolute",
                      top: `${sig.y * 100}%`,
                      left: `${sig.x * 100}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    className="bg-yellow-300 px-2 py-1 rounded text-sm shadow"
                  >
                    Sign Here
                  </div>
                ))}
            </div>
          ))}
      </Document>

      <div className="mt-8">
        <h3 className="font-semibold mb-4 text-lg">Signatures</h3>

        {signatures.map((signature) => (
          <div
            key={signature._id}
            className="p-4 border rounded mb-4 shadow-sm"
          >
            <p>Status: {signature.status}</p>

            {signature.status === "Pending" && (
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleAccept(signature._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Accept
                </button>

                <button
                  onClick={() => handleReject(signature._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            )}

            {signature.status === "Signed" && (
              <p className="text-green-600 font-semibold mt-2">
                ✅ Signed
              </p>
            )}

            {signature.status === "Rejected" && (
              <div className="text-red-600 font-semibold mt-2">
                ❌ Rejected
                <p className="text-sm mt-1">
                  Reason: {signature.rejectionReason}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PDFPreview;