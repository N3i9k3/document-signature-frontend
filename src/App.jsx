import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PublicSign from "./pages/PublicSign"; // ✅ import PublicSign
import DocumentPreview from "./pages/DocumentPreview";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Public signature route */}
        <Route path="/public-sign/:token" element={<PublicSign />} />
        <Route path="/preview/:id" element={<DocumentPreview />} />
      </Routes>
    </Router>
  );
}

export default App;
