const express = require('express');
const { uploadFile } = require('../controllers/uploadController');
const upload = require('../middleware/uploadMiddleware');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('admin', 'analyst'), upload.single('file'), uploadFile);

module.exports = router;