import { verifyAccessToken } from '../utils/jwt.js';
import ForumPost from '../models/ForumPost.js';

/**
 * Registers all Socket.io event handlers for the real-time course forum.
 *
 * Namespace: /forum
 *
 * Authentication:
 *   Clients must pass the access token in the handshake auth object:
 *     socket = io('/forum', { auth: { token: '<accessToken>' } })
 *
 * Events (client → server):
 *   join_course   { courseId }         — subscribe to a course room
 *   leave_course  { courseId }         — unsubscribe
 *   send_message  { courseId, moduleId?, text } — broadcast + persist
 *
 * Events (server → client):
 *   new_message   { post }             — broadcast to all room members
 *   error         { message }          — sent only to the offending socket
 *
 * @param {import('socket.io').Server} io
 */
const registerForumHandlers = (io) => {
  const forum = io.of('/forum');

  // ─── Per-connection Auth Middleware ─────────────────────────────────────────
  forum.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) throw new Error('No token');

      const decoded = verifyAccessToken(token);
      socket.data.userId = decoded.id;
      socket.data.role = decoded.role;
      next();
    } catch {
      next(new Error('Authentication failed'));
    }
  });

  // ─── Connection Handler ──────────────────────────────────────────────────────
  forum.on('connection', (socket) => {
    console.info(`[forum] socket connected: ${socket.id} (user: ${socket.data.userId})`);

    // ── join_course ────────────────────────────────────────────────────────────
    socket.on('join_course', ({ courseId }) => {
      if (!courseId) return socket.emit('error', { message: 'courseId is required' });
      socket.join(`course:${courseId}`);
      console.info(`[forum] ${socket.id} joined course:${courseId}`);
    });

    // ── leave_course ───────────────────────────────────────────────────────────
    socket.on('leave_course', ({ courseId }) => {
      socket.leave(`course:${courseId}`);
    });

    // ── send_message ───────────────────────────────────────────────────────────
    socket.on('send_message', async ({ courseId, moduleId, text }) => {
      if (!courseId || !text?.trim()) {
        return socket.emit('error', { message: 'courseId and text are required' });
      }

      if (text.length > 2000) {
        return socket.emit('error', { message: 'Message cannot exceed 2000 characters' });
      }

      try {
        // Persist to MongoDB
        const post = await ForumPost.create({
          course: courseId,
          module: moduleId || null,
          author: socket.data.userId,
          text: text.trim(),
        });

        // Populate author name + avatar for the client to render immediately
        const populated = await post.populate('author', 'name avatar');

        // Broadcast to all sockets in this course room (including sender)
        forum.to(`course:${courseId}`).emit('new_message', { post: populated });
      } catch (err) {
        console.error('[forum] send_message error:', err.message);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // ── disconnect ─────────────────────────────────────────────────────────────
    socket.on('disconnect', (reason) => {
      console.info(`[forum] socket disconnected: ${socket.id} (${reason})`);
    });
  });
};

export default registerForumHandlers;
