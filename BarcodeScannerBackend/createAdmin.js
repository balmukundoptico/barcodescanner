const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/barcodeScanner', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Admin',
      companyName: 'Admin Co',
      email: 'admin@example.com',
      mobile: '1234567890',
      password: hashedPassword,
      role: 'admin',
      approved: true,
    });
    await admin.save();
    console.log('Admin user created');
    mongoose.connection.close();
  })
  .catch(err => console.log(err));