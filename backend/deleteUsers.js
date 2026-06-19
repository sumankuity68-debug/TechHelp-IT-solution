import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/user.js';
import dns from 'dns';

// Configure DNS to use Google's Public DNS to bypass local DNS issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const deleteUsersAndAdmins = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    const result = await User.deleteMany({ role: { $in: ['user', 'admin'] } });
    console.log(`Deleted ${result.deletedCount} users and admins.`);

    console.log('Disconnecting...');
    await mongoose.disconnect();
    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Error deleting users:', err);
    process.exit(1);
  }
};

deleteUsersAndAdmins();
