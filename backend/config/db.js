const mongoose = require('mongoose');
const dns = require('dns');

// Force Google DNS inside Node.js - fixes Windows DNS issues
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log('🔌 Connecting to MongoDB...');

    // Kisi options ki zaroorat nahi, standard multi-shard URI is enough
    const conn = await mongoose.connect(uri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('🔍 Error code:', error.code);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

module.exports = connectDB;