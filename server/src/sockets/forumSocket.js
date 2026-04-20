// src/sockets/forumSocket.js
// Real-time course forum using Socket.io.
// Each course has its own "room" — students and instructors join when they open
// the forum for that course. Messages are persisted to MongoDB then broadcast.
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const ForumPost = require('../models/ForumPost');

/**
 * Initialises Socket.io on the given HTTP server and registers all event handlers.
 * Called once from src/index.js after the HTTP server is created.
 *
 * @param {import('http').Server} httpServer
 */
const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
    // Reconnection is handled client-side; pingTimeout keeps idle sockets clean.
    pingTimeout: 60000,
  });

  // ── Auth middleware for Socket.io ────────────────────────────────────────────
  // Runs before the 'connection' event — reject unauthenticated socket upgrades.
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      socket.user = decoded; // attach { userId, role } to the socket object
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  // ── Connection handler ───────────────────────────────────────────────────────
  io.on('connection', (socket) => {

    // CLIENT emits 'join-course' with { courseId } when opening the forum tab.
    // We put the socket in a room named after the courseId so broadcasts are
    // scoped — a message in course A never reaches course B students.
    socket.on('join-course', ({ courseId }) => {
      socket.join(`course:${courseId}`);
    });

    // CLIENT emits 'leave-course' when navigating away from the forum tab.
    socket.on('leave-course', ({ courseId }) => {
      socket.leave(`course:${courseId}`);
    });

    // ── New forum post ─────────────────────────────────────────────────────────
    // CLIENT emits 'new-post' with { courseId, title, body }.
    // We persist to MongoDB, then broadcast the saved document to the whole room.
    socket.on('new-post', async ({ courseId, title, body }) => {
      try {
        const post = await ForumPost.create({
          course: courseId,
          author: socket.user.userId,
          title,
          body,
        });

        // Populate the author field so the client receives name + avatar immediately
        await post.populate('author', 'name avatar');

        // Broadcast to EVERYONE in the room (including the sender) so all
        // connected clients see the new post without polling.
        io.to(`course:${courseId}`).emit('post-created', post);
      } catch (err) {
        // Emit error only back to the sender, not the whole room
        socket.emit('error', { message: err.message });
      }
    });

    // ── New reply ──────────────────────────────────────────────────────────────
    // CLIENT emits 'new-reply' with { courseId, postId, body }.
    socket.on('new-reply', async ({ courseId, postId, body }) => {
      try {
        const post = await ForumPost.findByIdAndUpdate(
          postId,
          {
            $push: {
              replies: { author: socket.user.userId, body },
            },
          },
          { new: true, runValidators: true }
        ).populate('replies.author', 'name avatar');

        if (!post) {
          return socket.emit('error', { message: 'Post not found' });
        }

        // Broadcast the updated post so all clients re-render with the new reply
        io.to(`course:${courseId}`).emit('post-updated', post);
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    // ── Typing indicator ───────────────────────────────────────────────────────
    // Lightweight — no DB write, just relayed to other room members.
    socket.on('typing', ({ courseId }) => {
      socket.to(`course:${courseId}`).emit('user-typing', {
        userId: socket.user.userId,
      });
    });

    // ── Disconnect ─────────────────────────────────────────────────────────────
    // Socket.io handles room cleanup automatically on disconnect,
    // but we log it for debugging reconnection issues.
    socket.on('disconnect', (reason) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Socket disconnected: ${socket.id} — reason: ${reason}`);
      }
    });
  });

  return io;
};

module.exports = { initSocket };
