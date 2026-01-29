import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<h1>Upload Page Coming Soon...</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
