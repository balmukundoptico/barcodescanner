const Barcode = require('../models/Barcode');
const Log = require('../models/Log');

// Scan a barcode
exports.scanBarcode = async (req, res) => {
  const { barcode } = req.body;
  const userId = req.user.id;

  try {
    let existingBarcode = await Barcode.findOne({ barcode });
    if (existingBarcode) {
      if (existingBarcode.status === 'expired') {
        return res.status(400).json({ message: 'Barcode already expired' });
      }
      existingBarcode.status = 'expired';
      existingBarcode.scannedBy = userId;
      existingBarcode.scannedAt = new Date();
      await existingBarcode.save();
      await new Log({ userId, action: 'scan', barcode }).save();
      return res.json({ message: 'Barcode marked as expired' });
    }

    const newBarcode = new Barcode({ barcode, scannedBy: userId, scannedAt: new Date() });
    await newBarcode.save();
    await new Log({ userId, action: 'scan', barcode }).save();
    res.json({ message: 'Barcode scanned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all barcodes
exports.getBarcodes = async (req, res) => {
    try {
      const barcodes = await Barcode.find().populate('scannedBy', 'name email');
      res.json(barcodes);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Search for a barcode
  exports.searchBarcode = async (req, res) => {
    const { barcode } = req.query;
    try {
      const existingBarcode = await Barcode.findOne({ barcode });
      if (existingBarcode) {
        res.json({ exists: true, status: existingBarcode.status });
      } else {
        res.json({ exists: false });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Delete a barcode
  exports.deleteBarcode = async (req, res) => {
    const { barcode } = req.body;
    const userId = req.user.id;
  
    try {
      const existingBarcode = await Barcode.findOne({ barcode });
      if (!existingBarcode) {
        return res.status(404).json({ message: 'Barcode not found' });
      }
      if (existingBarcode.status === 'deleted') {
        return res.status(400).json({ message: 'Barcode already deleted' });
      }
  
      existingBarcode.status = 'deleted';
      existingBarcode.deletedAt = new Date();
      await existingBarcode.save();
      await new Log({ userId, action: 'delete', barcode }).save();
      res.json({ message: 'Barcode deleted', barcode: existingBarcode });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Undo delete a barcode
  exports.undoDeleteBarcode = async (req, res) => {
    const { barcode } = req.body;
    const userId = req.user.id;
  
    try {
      const existingBarcode = await Barcode.findOne({ barcode });
      if (!existingBarcode || existingBarcode.status !== 'deleted') {
        return res.status(400).json({ message: 'Cannot undo: Barcode not deleted' });
      }
  
      existingBarcode.status = 'active';
      existingBarcode.deletedAt = null;
      await existingBarcode.save();
      await new Log({ userId, action: 'undo_delete', barcode }).save();
      res.json({ message: 'Barcode restored', barcode: existingBarcode });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  