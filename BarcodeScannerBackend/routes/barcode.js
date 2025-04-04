const express = require('express');
const router = express.Router();
const { scanBarcode, getBarcodes, searchBarcode, deleteBarcode, undoDeleteBarcode } = require('../controllers/barcodeController');
const { authMiddleware } = require('../middleware/auth');

router.post('/scan', authMiddleware, scanBarcode);
router.get('/list', authMiddleware, getBarcodes);
router.get('/search', authMiddleware, searchBarcode);
router.post('/delete', authMiddleware, deleteBarcode);
router.post('/undo', authMiddleware, undoDeleteBarcode);

module.exports = router;