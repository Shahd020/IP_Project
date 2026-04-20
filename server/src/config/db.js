// src/config/db.js
const mongoose = require('mongoose');

/**
 * Connects to MongoDB Atlas using the MONGO_URI environment variable.
 * Configures connection pooling to reuse sockets across requests
 * instead of opening a new connection per query (prevents N+1 at the DB level).
 */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,      // max simultaneous connections in the pool
      serverSelectionTimeoutMS: 5000, // fail fast if Atlas is unreachable
      socketTimeoutMS: 45000,
    });
    console.warn('MongoDB connected ✓');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // crash fast — a missing DB is always fatal
  }
}

module.exports = connectDB;
