const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true, index: true },
    amount: { type: Number, required: true },
    referenceNumber: { type: String, index: true },
    date: { type: Date, required: true },
    description: { type: String },
    sourceJob: { type: mongoose.Schema.Types.ObjectId, ref: 'Upload', index: true }
}, { timestamps: true });

module.exports = mongoose.model('Record', RecordSchema);