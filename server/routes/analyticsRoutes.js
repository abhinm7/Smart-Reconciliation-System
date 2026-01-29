const express = require('express');
const { getJobSummary, getJobDetails, editReconciliationResult } = require('../controllers/analyticsController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');
const { getAuditLogs, getRecordHistory } = require('../controllers/AuditController');

const router = express.Router();

router.get('/:jobId/summary', verifyToken, getJobSummary);
router.get('/:jobId/details', verifyToken, getJobDetails);
router.put('/:id/edit', verifyToken, editReconciliationResult);

router.get('/audits', verifyToken, authorizeRole('admin'), getAuditLogs);
router.get('/audit-history', verifyToken, authorizeRole('admin'), getRecordHistory);

module.exports = router;