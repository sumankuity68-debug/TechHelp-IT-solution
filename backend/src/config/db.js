
import mongoose from 'mongoose';
import dns from 'dns';

// Configure custom DNS servers for Node's c-ares resolver to fix local querySrv ECONNREFUSED errors on some networks
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  console.warn('⚠️ Could not set custom DNS servers, relying on system resolver:', err.message);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // fail fast after 10s
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('⚠️  Server will continue but DB operations will fail.');
    // Don't call process.exit(1) — let server run so we can diagnose
  }
};

export default connectDB;