import { useState, useEffect } from "react";

const EditModal = ({ isOpen, onClose, record, onSave }) => {
  const [formData, setFormData] = useState({
    uploadedTransactionId: "",
    uploadedAmount: "",
    notes: "",
  });

  useEffect(() => {
    if (record) {
      setFormData({
        uploadedTransactionId: record.uploadedTransactionId,
        uploadedAmount: record.uploadedAmount,
        notes: "",
      });
    }
  }, [record]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(record._id, {
      uploadedTransactionId: formData.uploadedTransactionId,
      uploadedAmount: Number(formData.uploadedAmount),
      notes: formData.notes,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Manually Resolve Discrepancy
        </h2>

        <form onSubmit={handleSubmit}>
          {/* ID Field */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Transaction ID
            </label>
            <input
              type="text"
              className="w-full border rounded p-2 bg-gray-50"
              value={formData.uploadedTransactionId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  uploadedTransactionId: e.target.value,
                })
              }
            />
          </div>

          {/* Amount Field */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
              value={formData.uploadedAmount}
              onChange={(e) =>
                setFormData({ ...formData, uploadedAmount: e.target.value })
              }
            />
          </div>

          {/* Justification Field */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Reason for Change
            </label>
            <textarea
              required
              placeholder="e.g. Bank fee was missing, confirmed with manager."
              className="w-full border rounded p-2 h-24 focus:ring-2 focus:ring-blue-500"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold"
            >
              Save & Resolve
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
