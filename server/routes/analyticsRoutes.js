const express = require('express');
const { getJobSummary, getJobDetails } = require('../controllers/analyticsController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:jobId/summary', verifyToken, getJobSummary);
router.get('/:jobId/details', verifyToken, getJobDetails);

module.exports = router;