const express = require('express');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');
const { getUsers, registerUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.use(verifyToken);
router.use(authorizeRole('admin'));

router.get('/', getUsers);
router.post('/', registerUser);
router.delete('/:id', deleteUser);

module.exports = router