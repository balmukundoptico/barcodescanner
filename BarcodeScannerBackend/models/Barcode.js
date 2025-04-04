const mongoose = require('mongoose');

const barcodeSchema = new mongoose.Schema({
  barcode: { type: String, required: true, unique: true }, // The barcode value
  status: { type: String, default: 'active' }, // 'active' or 'expired'
  scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who scanned it
  scannedAt: { type: Date }, // Timestamp of scan
  deletedAt: { type: Date }, // For undo functionality
});

module.exports = mongoose.model('Barcode', barcodeSchema);