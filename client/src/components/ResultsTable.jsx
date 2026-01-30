const ResultsTable = ({ data, onEdit, onViewHistory }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left font-bold text-gray-600 uppercase">
              Transaction ID
            </th>
            <th className="px-6 py-3 text-right font-bold text-gray-600 uppercase">
              System ($)
            </th>
            <th className="px-6 py-3 text-right font-bold text-gray-600 uppercase">
              Bank ($)
            </th>
            <th className="px-6 py-3 text-right font-bold text-gray-600 uppercase">
              Variance
            </th>
            <th className="px-6 py-3 text-center font-bold text-gray-600 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-center font-bold text-gray-600 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row) => {
            const isMismatch = row.status === "UNMATCHED";
            return (
              <tr
                key={row._id}
                className={isMismatch ? "bg-red-50" : "hover:bg-gray-50"}
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {row.uploadedTransactionId}
                  {row.systemRecordId &&
                    row.systemRecordId.transactionId !==
                      row.uploadedTransactionId && (
                      <div className="text-xs text-red-500 font-bold">
                        System ID: {row.systemRecordId.transactionId}
                      </div>
                    )}
                </td>
                <td className="px-6 py-4 text-right text-gray-500">
                  {row.systemRecordId ? row.systemAmount : "-"}
                </td>
                <td
                  className={`px-6 py-4 text-right font-bold ${isMismatch ? "text-red-700" : "text-gray-900"}`}
                >
                  {row.uploadedAmount.toFixed(2)}
                </td>
                <td
                  className={`px-6 py-4 text-right font-bold ${row.variance !== 0 ? "text-red-600" : "text-gray-400"}`}
                >
                  {row.variance !== 0 ? row.variance.toFixed(2) : "0.00"}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase 
                    ${
                      row.status === "MATCHED"||row.status == 'MANUAL_MATCH'
                        ? "bg-green-100 text-green-800"
                        : isMismatch
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {row.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {row.status !== "MATCHED" && (
                    <div className="flex justify-center">
                      <div className="inline-flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1 shadow-sm">
                        <button
                          onClick={() => onEdit(row)}
                          className="px-3 py-1 text-xs font-bold text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                        >
                          FIX
                        </button>

                        <div className="w-px h-4 bg-gray-300 mx-1"></div>

                        <button
                          onClick={() => onViewHistory(row._id)}
                          className="px-2 py-1 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded-md transition-colors"
                          title="View History"
                        >
                          HISTORY
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
