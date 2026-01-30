const express = require('express');
const { getJobSummary, getJobDetails, editReconciliationResult } = require('../controllers/analyticsController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');
const { getAuditLogs, getRecordHistory, getJobActivity } = require('../controllers/auditController');

const router = express.Router();

router.get('/:jobId/summary', verifyToken, getJobSummary);
router.get('/:jobId/details', verifyToken, getJobDetails);
router.put('/:id/edit', verifyToken, editReconciliationResult);

router.get('/audits', verifyToken, authorizeRole('admin'), getAuditLogs);
router.get('/audit-history/:docId', verifyToken, getRecordHistory);
// router.get('/recent-audits/:jobId', verifyToken, getJobActivity);

module.exports = router;