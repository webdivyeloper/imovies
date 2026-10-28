const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1200
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.log(`ℹ️ MongoDB notice: Local connection at ${uri} not active (${err.message}).`);
    console.log('💡 Tip: Start local MongoDB service or set MONGODB_URI in backend/.env (e.g. MongoDB Atlas cluster).');
  }
};

module.exports = connectDB;
