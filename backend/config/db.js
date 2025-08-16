const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://sakshi:wXNvxjml6N1Gs0U0@cluster0.gyifs.mongodb.net/online_auction");
    console.log('MongoDB Connected: ${conn.connection.host}');
  } catch (error) {
    console.error('Error: ${error.message}');
    process.exit(1);
  }
};

module.exports = connectDB;