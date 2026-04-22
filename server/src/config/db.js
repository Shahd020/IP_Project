<<<<<<< HEAD
﻿import mongoose from 'mongoose';
=======
<<<<<<< HEAD
// src/config/db.js
const mongoose = require('mongoose');
>>>>>>> e924226 (phase 2 lilly testing)

/**
 * Establishes and monitors the Mongoose connection.
 *
 * Connection pooling is handled by the MongoDB Node.js driver.
 * `maxPoolSize: 10` is a sensible default for a small-to-medium academic app;
 * raise it if you observe connection-wait bottlenecks under load.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

<<<<<<< HEAD
=======
module.exports = connectDB;
=======
﻿import mongoose from 'mongoose';

/**
 * Establishes and monitors the Mongoose connection.
 *
 * Connection pooling is handled by the MongoDB Node.js driver.
 * `maxPoolSize: 10` is a sensible default for a small-to-medium academic app;
 * raise it if you observe connection-wait bottlenecks under load.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

>>>>>>> e924226 (phase 2 lilly testing)
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  try {
    const conn = await mongoose.connect(uri, options);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    // Exit so the process manager (nodemon / PM2) can restart with back-off.
    process.exit(1);
  }
};

// â”€â”€â”€ Connection Event Listeners â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.info('MongoDB reconnected');
});

export default connectDB;
<<<<<<< HEAD
=======
>>>>>>> 9e18abd (phase 2 test lilly)
>>>>>>> e924226 (phase 2 lilly testing)
