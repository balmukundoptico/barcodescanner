const express = require('express');
const connectDB = require('./config/db'); // Import the connectDB function
const cors = require('cors');
const authRoutes = require('./routes/auth');
const barcodeRoutes = require('./routes/barcode');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB using the db.js function
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/barcode', barcodeRoutes);
app.use('/api/admin', adminRoutes);

// Start the server
app.listen(5000, () => console.log('Server running on port 5000'));