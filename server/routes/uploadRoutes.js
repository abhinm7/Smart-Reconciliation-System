const express = require('express');
const { uploadFile, getJobs } = require('../controllers/uploadController');
const upload = require('../middleware/uploadMiddleware');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', verifyToken, authorizeRole('admin', 'analyst'), upload.single('file'), uploadFile);
router.get('/get-jobs',verifyToken,getJobs)

module.exports = router;