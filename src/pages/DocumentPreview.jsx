import { useParams } from "react-router-dom";
import PDFPreview from "../components/PDFPreview";

function DocumentPreview() {
  const { id } = useParams(); // document ID from URL
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const token = userInfo.token;

  const fileUrl = `http://localhost:5000/api/docs/file/${id}`; // adjust if needed

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