const mongoose = require('mongoose');

// URL kết nối đến MongoDB
const MONGO_URI = 'mongodb://admin:password@localhost:27017/web_truyen?authSource=admin';

// Hàm kết nối đến MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
