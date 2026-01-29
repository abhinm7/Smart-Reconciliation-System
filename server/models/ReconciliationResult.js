const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Upload', required: true, index: true },
    uploadedTransactionId: { type: String, required: true },
    uploadedAmount: { type: Number, required: true },
    systemRecordId: { type: mongoose.Schema.Types.ObjectId, ref: 'Record' },
    systemAmount: { type: Number },
    status: {
        type: String,
        enum: ['MATCHED', 'UNMATCHED', 'PARTIAL_MATCH', 'DUPLICATE', 'MANUAL_MATCH'],
        required: true
    },
    variance: { type: Number, default: 0 }

}, { timestamps: true });

module.exports = mongoose.model('ReconciliationResult', ResultSchema);