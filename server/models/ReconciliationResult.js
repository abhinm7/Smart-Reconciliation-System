const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  // Link to the specific file upload job
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'UploadJob', required: true, index: true },

  // Data from the CSV (The "Bank" side)
  uploadedTransactionId: { type: String, required: true },
  uploadedAmount: { type: Number, required: true },

  // Data from our DB (The "System" side) - Null if not found
  systemRecordId: { type: mongoose.Schema.Types.ObjectId, ref: 'Record' },
  systemAmount: { type: Number },

  // The Verdict
  status: { 
    type: String, 
    enum: ['MATCHED', 'MISMATCH', 'NOT_FOUND_IN_SYSTEM'], 
    required: true 
  },
  
  // How much off are we? (0 if matched)
  variance: { type: Number, default: 0 }

}, { timestamps: true });

module.exports = mongoose.model('ReconciliationResult', ResultSchema);