const express = require('express');
const router = express.Router();
const { getUsers, approveUser, deleteUser } = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/users', authMiddleware, adminMiddleware, getUsers);
router.put('/approve/:id', authMiddleware, adminMiddleware, approveUser);
router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteUser);

module.exports = router;