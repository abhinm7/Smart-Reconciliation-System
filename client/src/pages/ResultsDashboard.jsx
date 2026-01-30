import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api";
import SummaryCards from "../components/SummaryCards";
import ResultsTable from "../components/ResultsTable";
import EditModal from "../components/EditModal";
import StatusChart from "../components/StatusChart";
import VarianceChart from "../components/VarianceChart";
import AuditTimeline from "../components/AuditTimeLine";

const ResultsDashboard = () => {
  const { jobId } = useParams();
  const [summary, setSummary] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyId, setHistoryId] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, [jobId]);

  useEffect(() => {
    fetchTable();
  }, [jobId, page, statusFilter]);

  const fetchSummary = async () => {
    try {
      const { data } = await API.get(`/analytics/${jobId}/summary`);
      setSummary(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTable = async () => {
    setLoading(true);
    try {
      const queryParams = {
        page: page,
        status: statusFilter === "ALL" ? undefined : statusFilter,
      };
      const { data } = await API.get(`/analytics/${jobId}/details`, {
        params: queryParams,
      });
      setTableData(data.results);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handleSaveCorrection = async (id, updatedData) => {
    try {
      await API.put(`/analytics/${id}/edit`, updatedData);

      fetchTable();
      fetchSummary();

      setIsModalOpen(false);
    } catch (err) {
      alert("Failed to update record: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <Link
            to="/dashboard"
            className="text-blue-600 text-sm font-bold hover:underline"
          >
            ← Back to Jobs
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">
            Reconciliation Report
          </h1>
          <p className="text-gray-500">
            Reviewing discrepancies for Job:{" "}
            <span className="font-mono text-xs">{jobId}</span>
          </p>
        </div>

        <div className="flex bg-gray-200 p-1 rounded-lg">
          {["ALL", "UNMATCHED", "MATCHED", "PARTIAL_MATCH","MANUAL_MATCH"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`px-4 py-1 text-xs font-bold rounded-md transition ${statusFilter === s ? "bg-white shadow text-blue-600" : "text-gray-600 hover:text-gray-800"}`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="lg:col-span-2">
          <SummaryCards
            stats={summary?.stats}
            totalProcessed={summary?.job?.processedRecords}
            statusFilter={setStatusFilter}
            setPage={setPage}
          />
        </div>
        <div className="lg:col-span-1 h-full">
          {summary && <StatusChart stats={summary.stats} />}
        </div>
        <div className="h-full flex flex-col justify-between">
          <div className="h-80">
            {summary && <VarianceChart stats={summary.stats} />}
          </div>
          <div className=" bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-bold text-blue-800"> Quick Insight</h4>
            <p className="text-sm text-blue-600">
              You have{" "}
              <span className="font-bold">
                {summary?.stats.find((s) => s._id === "UNMATCHED")?.count || 0}{" "}
                mismatches
              </span>{" "}
              requiring attention. Total variance is{" "}
              <span className="font-bold">
                $
                {summary?.stats
                  .find((s) => s._id === "UNMATCHED")
                  ?.totalVariance.toFixed(2) || "0.00"}
              </span>
              .
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        <ResultsTable
          data={tableData}
          onEdit={handleEditClick}
          onViewHistory={(id) => setHistoryId(id)}
        />
      </div>

      {historyId && (
        <AuditTimeline
          recordId={historyId}
          onClose={() => setHistoryId(null)}
        />
      )}

      <div className="mt-6 flex justify-between items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded bg-white disabled:opacity-50 hover:bg-gray-50"
        >
          Previous
        </button>
        <p className="text-sm text-gray-600 font-medium">
          Page {page} of {totalPages}
        </p>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded bg-white disabled:opacity-50 hover:bg-gray-50"
        >
          Next
        </button>
      </div>

      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        record={selectedRow}
        onSave={handleSaveCorrection}
      />
    </div>
  );
};

export default ResultsDashboard;
