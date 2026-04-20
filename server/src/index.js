// src/index.js — entry point
// Tip (Lab 8): dotenv.config() is called inside app.js before anything else,
// so process.env is populated by the time we reach this file.
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./sockets/forumSocket');

const PORT = process.env.PORT || 5000;

// Wrap in an async IIFE so we can await the DB before accepting requests.
(async () => {
  await connectDB();

  const server = http.createServer(app);

  // Attach Socket.io to the same HTTP server as Express
  initSocket(server);

  server.listen(PORT, () => {
    console.warn(`Server running on http://localhost:${PORT}`);
  });

  // Graceful shutdown — close DB connection on SIGTERM (e.g. from Docker / cloud)
  process.on('SIGTERM', () => {
    console.warn('SIGTERM received — shutting down gracefully');
    server.close(() => process.exit(0));
  });
})();
