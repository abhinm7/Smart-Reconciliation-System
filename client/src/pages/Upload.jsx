import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [type, setType] = useState("RECONCILIATION");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.isAdmin || user?.role === 'admin';
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split("\n").map((row) => row.split(","));

      if (rows.length > 0) {
        setHeaders(rows[0]);
        const dataRows = rows.slice(1, 21).filter((r) => r.length > 1);
        setPreview(dataRows);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center pb-32">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl">
        {" "}
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Upload New File
        </h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* File Type Selection */}
            <div>
              <label className="block font-bold mb-2">File Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="RECONCILIATION">
                  Transaction Statement (Reconciliation)
                </option>
                {isAdmin && (
                  <option value="SYSTEM_DATA">System Data (Admin Only)</option>
                )}
              </select>
            </div>

            {/* File Input */}
            <div>
              <label className="block font-bold mb-2">Select CSV File</label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* PREVIEW SECTION (Only shows after file selected) */}
          {!file && (
            <div className="min-h-96 border border-gray-300 rounded-lg flex justify-center items-center">
              <p className="text-blue-900">Please select a file</p>
            </div>
          )}
          {file && headers.length > 0 && (
            <div className="mb-8 border-t pt-6">
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                File Preview
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Reviewing the first 20 rows of your file.
                <span className="text-orange-600 font-medium ml-2">
                  ⚠️ Ensure headers match: TransactionID, Amount,
                  ReferenceNumber, Date
                </span>
              </p>

              {/* Full Width Scrollable Table */}
              <div className="bg-gray-50 rounded-3xl border overflow-x-auto max-h-80 overflow-y-scroll no-scrollbar">
                <table className="min-w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-200 sticky top-0">
                    <tr>
                      {headers.map((h, i) => (
                        <th
                          key={i}
                          className="px-4 py-3 border-b border-gray-300 whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr
                        key={i}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className="px-4 py-2 border-r border-gray-100 whitespace-nowrap"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {preview.length === 0 && (
                  <p className="p-4 text-center">No data rows found.</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-10">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !file}
              className="bg-blue-600 text-white px-8 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50 transition font-bold"
            >
              {loading ? "Uploading..." : "Confirm & Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;
