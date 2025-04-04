const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g., 'scan', 'delete'
  barcode: { type: String, required: true }, // The barcode affected
  device: { type: String }, // Device info (optional, can be added later)
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Log', logSchema);