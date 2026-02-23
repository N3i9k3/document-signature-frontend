import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PublicSign from "./pages/PublicSign";
import DocumentPreview from "./pages/DocumentPreview";

function App() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <Router>
      <Routes>

        {/* Smart root route */}
        <Route
          path="/"
          element={
            userInfo?.token
              ? <Navigate to="/dashboard" />
              : <Navigate to="/login" />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            userInfo?.token
              ? <Dashboard />
              : <Navigate to="/login" />
          }
        />

        <Route path="/public-sign/:token" element={<PublicSign />} />
        <Route path="/preview/:id" element={<DocumentPreview />} />

      </Routes>
    </Router>
  );
}

export default App;