const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, // 'admin' for admin user
  approved: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);