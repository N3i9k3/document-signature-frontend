import { useRef, useState, useEffect } from "react";
import axios from "axios";

function SignatureEditor({ documentId, fileUrl }) {
  const containerRef = useRef(null);
  const [signatures, setSignatures] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [isDragging, setIsDragging] = useState(false); // track drag state

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/signatures/${documentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSignatures(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    if (token) fetchSignatures();
  }, [documentId, token]);

  const handleClick = async (e) => {
    if (isDragging) return; // ignore click if we were dragging

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/signatures",
        { documentId, x, y, page: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSignatures((prev) => [...prev, res.data.signature]);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleMouseDown = (e, sigId) => {
    e.stopPropagation();
    setDraggingId(sigId);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!draggingId) return;

    const rect = containerRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / rect.width;
    let y = (e.clientY - rect.top) / rect.height;

    x = Math.max(0, Math.min(1, x));
    y = Math.max(0, Math.min(1, y));

    setSignatures((prev) =>
      prev.map((s) => (s._id === draggingId ? { ...s, x, y } : s))
    );
  };

  const handleMouseUp = async () => {
    if (!draggingId) return;

    const sig = signatures.find((s) => s._id === draggingId);
    if (!sig) return;

    try {
      await axios.put(
        `http://localhost:5000/api/signatures/${draggingId}`,
        { x: sig.x, y: sig.y },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setDraggingId(null);
      setTimeout(() => setIsDragging(false), 0); // reset drag state after event loop
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ position: "relative", width: "100%", border: "1px solid #ccc" }}
    >
      <img
        src={fileUrl}
        alt="PDF preview"
        style={{
          width: "100%",
          height: "800px",
          objectFit: "contain",
          display: "block",
          pointerEvents: "none",
        }}
      />

      {signatures.map((sig) => (
        <div
          key={sig._id}
          onMouseDown={(e) => handleMouseDown(e, sig._id)}
          style={{
            position: "absolute",
            top: `${sig.y * 100}%`,
            left: `${sig.x * 100}%`,
            transform: "translate(-50%, -50%)",
            backgroundColor: "yellow",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "black",
            border: "1px solid black",
            cursor: "move",
            zIndex: 9999,
            userSelect: "none",
          }}
        >
          Sign Here
        </div>
      ))}
    </div>
  );
}

export default SignatureEditor;
