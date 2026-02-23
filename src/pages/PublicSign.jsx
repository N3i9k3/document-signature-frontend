import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PublicSign = () => {
  const { token } = useParams();
  const [signatureData, setSignatureData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // To show signing success
  const [loading, setLoading] = useState(false); // For button state

  useEffect(() => {
    // Fetch signature info using token
    axios
      .get(`http://localhost:5000/api/public/sign/${token}`)
      .then((res) => {
        setSignatureData(res.data);
      })
      .catch(() => {
        setError("Invalid or expired link");
      });
  }, [token]);

  const handleSign = async () => {
    if (!signatureData) return;

    setLoading(true);
    try {
      // ✅ Updated PATCH call with token query param
      await axios.patch(
        `http://localhost:5000/api/public/sign/${signatureData.signatureId}?token=${token}`
      );

      setSuccess("You have successfully signed the document!");
      setError("");
    } catch (err) {
      setError("Failed to sign. Link may be expired.");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div>{error}</div>;
  if (!signatureData) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sign Document</h2>
      <p>
        Page: {signatureData.page}, X: {signatureData.x}, Y: {signatureData.y}
      </p>

      {success ? (
        <p style={{ color: "green" }}>{success}</p>
      ) : (
        <button onClick={handleSign} disabled={loading}>
          {loading ? "Signing..." : "Click to Sign"}
        </button>
      )}
    </div>
  );
};

export default PublicSign;
