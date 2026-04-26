/**
 * Entry point — loaded by `npm start` / `npm run dev`.
 *
 * Responsibilities:
 *   1. Initialise Sentry (must happen before any other import)
 *   2. Connect to MongoDB
 *   3. Wrap the Express app in a native HTTP server
 *   4. Attach Socket.io to the HTTP server
 *   5. Start listening
 *   6. Register SIGTERM/SIGINT handlers for graceful shutdown
 */

import { initialiseSentry } from './config/sentry.js';
initialiseSentry(); // must be first

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

import app from './app.js';
import connectDB from './config/db.js';
import registerForumHandlers from './sockets/forum.socket.js';

const PORT = process.env.PORT || 5000;

// ─── HTTP Server ──────────────────────────────────────────────────────────────
const httpServer = http.createServer(app);

// ─── Socket.io ────────────────────────────────────────────────────────────────
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  // Reconnection is handled client-side; pingTimeout controls server-side cleanup.
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Attach the forum namespace and its event handlers
registerForumHandlers(io);

// ─── Bootstrap ────────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    console.info(`Server running on http://localhost:${PORT} [${process.env.NODE_ENV}]`);
  });
};

start();

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
/**
 * On SIGTERM (Docker/PM2 stop) or SIGINT (Ctrl+C):
 *   1. Stop accepting new connections
 *   2. Wait for in-flight requests to finish (5-second hard limit)
 *   3. Close the Mongoose connection
 */
const shutdown = (signal) => {
  console.info(`${signal} received — shutting down gracefully`);

  httpServer.close(async () => {
    const mongoose = (await import('mongoose')).default;
    await mongoose.connection.close(false);
    console.info('MongoDB connection closed');
    process.exit(0);
  });

  // Force exit if graceful shutdown takes too long
  setTimeout(() => {
    console.error('Graceful shutdown timed out — forcing exit');
    process.exit(1);
  }, 5000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Surface unhandled promise rejections as fatal errors so they are not silently swallowed
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
  process.exit(1);
});

export { io }; // exported so Socket.io can be injected into services if needed
