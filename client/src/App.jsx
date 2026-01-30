import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import JobListing from "./pages/JobListing";
import ProtectedRoute from "./components/ProtectedRoute";
import Upload from "./pages/Upload";
import ResultsDashboard from "./pages/ResultsDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <JobListing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/:jobId"
          element={
            <ProtectedRoute>
              <ResultsDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
