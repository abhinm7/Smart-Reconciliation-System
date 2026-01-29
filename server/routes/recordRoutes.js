const express = require('express');
const { getJobRecords } = require('../controllers/recordController');

const router = express.Router();

router.get('/:jobId', getJobRecords); 

module.exports = router;