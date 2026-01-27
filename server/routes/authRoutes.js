const express = require('express');
const { getMe, loginUser } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/get-user', verifyToken, getMe);

router.post('/login', loginUser);

module.exports = router