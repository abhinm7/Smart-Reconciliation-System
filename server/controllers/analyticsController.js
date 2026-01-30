const mongoose = require('mongoose');
const ReconciliationResult = require("../models/ReconciliationResult");
const Upload = require("../models/Upload");
const Record = require('../models/Record');
const { logAudit } = require('../utils/auditlogger');

const editReconciliationResult = async (req, res) => {
    try {
        const { id } = req.params;
        const { uploadedAmount, uploadedTransactionId, notes } = req.body;
        const oldResult = await ReconciliationResult.findById(id).lean();

        if (!oldResult) {
            return res.status(404).json({ message: 'Record not found' });
        }
        // update changes
        const newResult = await ReconciliationResult.findByIdAndUpdate(
            id,
            {
                uploadedAmount: uploadedAmount || oldResult.uploadedAmount,
                uploadedTransactionId: uploadedTransactionId || oldResult.uploadedTransactionId,
                status: 'MANUAL_MATCH',
                notes: notes || 'Manually corrected by user'
            },
            { new: true }
        );
        // add audit for changes
        await logAudit({
            req,
            action: 'MANUAL_CORRECTION',
            collection: 'ReconciliationResult',
            docId: id,
            oldValue: oldResult,
            newValue: newResult.toObject(),
            notes
        });

        res.json(newResult);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getJobSummary = async (req, res) => {
    try {

        const { jobId } = req.params;

        const stats = await ReconciliationResult.aggregate([
            {
                $match: {
                    jobId: new mongoose.Types.ObjectId(jobId)
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalVariance: { $sum: { $abs: '$variance' } }
                }
            }
        ]);
        const job = await Upload.findById(jobId).select('status fileName createdAt totalRecords processedRecords');

        res.status(200).json({
            job, stats
        })

    } catch (error) {
        res.status(500).josn({ message: error.message });
    }
};

const getJobDetails = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { page = 1, limit = 10, status } = req.query;

        const query = { jobId };

        if (status) {
            query.status = status;
        }

        const results = await ReconciliationResult
            .find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ variance: -1 })
            .populate('systemRecordId', 'description date');

        const total = await ReconciliationResult.countDocuments(query);

        res.json({
            results,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        })



    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getJobSummary, getJobDetails, editReconciliationResult };