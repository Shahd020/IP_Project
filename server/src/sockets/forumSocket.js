// src/sockets/forumSocket.js
// Real-time forum using Socket.io — events match what useSocket.js and
// CourseStudy.jsx expect on the client side.
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const ForumPost = require('../models/ForumPost');

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
    pingTimeout: 60000,
  });

  // ── Auth middleware ───────────────────────────────────────────────────────────
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      socket.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {

    // join_course — client sends { courseId }
    socket.on('join_course', ({ courseId }) => {
      socket.join(`course:${courseId}`);
    });

    // leave_course — client sends { courseId }
    socket.on('leave_course', ({ courseId }) => {
      socket.leave(`course:${courseId}`);
    });

    // send_message — client sends { courseId, moduleId?, text }
    // persist + broadcast back as new_message with { post }
    socket.on('send_message', async ({ courseId, moduleId, text }) => {
      try {
        if (!text?.trim()) return;
        const post = await ForumPost.create({
          course: courseId,
          module: moduleId || null,
          author: socket.user.userId,
          text: text.trim(),
        });
        await post.populate('author', 'name avatar');
        // Broadcast to everyone in the room (including sender)
        io.to(`course:${courseId}`).emit('new_message', { post });
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('disconnect', (reason) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Socket disconnected: ${socket.id} — ${reason}`);
      }
    });
  });

  return io;
};

module.exports = { initSocket };
