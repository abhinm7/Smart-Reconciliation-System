import { useEffect, useState } from "react";
import API from "../api/api";
import Spinner from "./Spinner";

const AuditTimeline = ({ recordId, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (recordId) fetchHistory();
  }, [recordId]);

  const fetchHistory = async () => {
    try {
      const { data } = await API.get(`/analytics/audit-history/${recordId}`);
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-white/10 backdrop-blur-xs bg-opacity-50 flex justify-end z-60"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font text-gray-800">Audit History</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-800 text-2xl"
          >
            &times;
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center">
            {" "}
            <Spinner />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-gray-500">No changes found.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pb-10">
            {logs.map((log) => (
              <div key={log._id} className="relative pl-8">
                {/* Visual Dot */}
                <span
                  className={`absolute -left-2.25 top-1 w-5 h-5 rounded-full border-4 border-white 
                  ${log.action === "MANUAL_CORRECTION" ? "bg-blue-600" : "bg-gray-400"}`}
                ></span>

                {/* The Card */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-xs uppercase text-blue-600 tracking-wider">
                      {log.action.replace("_", " ")}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="mb-2">
                    {log.user?.email && (
                      <div className="text-xs text-gray-500">
                        {log.user.email}
                      </div>
                    )}
                  </div>

                  {log.oldValue && log.newValue && (
                    <div className="text-xs bg-white p-2 rounded border space-y-2">
                      {log.oldValue.uploadedAmount !== log.newValue.uploadedAmount && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 line-through">
                            ${log.oldValue.uploadedAmount}
                          </span>
                          <span>→</span>
                          <span className="font-bold text-green-600">
                            ${log.newValue.uploadedAmount}
                          </span>
                        </div>
                      )}
                      {log.notes && (
                        <p className="italic text-gray-600 border-l-2 border-orange-300 pl-2">
                          "{log.notes}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditTimeline;
