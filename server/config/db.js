/**
 * MongoDB connection via Mongoose.
 * Call connectDB() once at server start.
 */

import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables.');
  }

  try {
    const conn = await mongoose.connect(uri, {
      // Mongoose 8 no longer needs these flags, but left here for clarity
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
}

// Log disconnects in dev
mongoose.connection.on('disconnected', () => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('⚠️  MongoDB disconnected');
  }
});
