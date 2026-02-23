import { useParams } from "react-router-dom";
import PDFPreview from "../components/PDFPreview";

const BACKEND_URL = "https://document-signature-backend-pewy.onrender.com";

function DocumentPreview() {
  const { id } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const token = userInfo.token;

  // ✅ Production backend URL
  const fileUrl = `${BACKEND_URL}/api/docs/file/${id}`;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Document Preview</h1>

      {token ? (
        <PDFPreview fileUrl={fileUrl} documentId={id} token={token} />
      ) : (
        <p>Please log in to preview this document.</p>
      )}
    </div>
  );
}

export default DocumentPreview;