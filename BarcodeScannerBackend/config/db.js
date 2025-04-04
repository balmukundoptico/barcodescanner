//barcodescannerbackend/config/db.js
// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     await mongoose.connect('mongodb://localhost:27017/barcodeScanner', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB connected');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1); // Exit the process if connection fails
//   }
// };

// module.exports = connectDB;

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb+srv://balmukundoptico:lets12help@job-connector.exb7v.mongodb.net/barcodescanner?retryWrites=true&w=majority&appName=job-connector';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Atlas connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process if connection fails
  }
};

module.exports = connectDB;