import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import useAuth from './useAuth.js';

const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
  .replace('/api', ''); // Socket.io connects to the root server, not the /api prefix

/**
 * Manages a Socket.io connection to the /forum namespace.
 *
 * - Connects only when a valid accessToken exists
 * - Passes the token in the handshake so the server can authenticate the socket
 * - Automatically joins/leaves course rooms as courseId changes
 * - Handles reconnection transparently (Socket.io reconnects internally;
 *   we re-join the room after reconnect via the 'connect' event)
 *
 * @param {string|null} courseId  Join this course room when provided
 * @returns {{ socket: Socket|null, connected: boolean }}
 */
const useSocket = (courseId) => {
  const { accessToken } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    const socket = io(`${SOCKET_URL}/forum`, {
      auth: { token: accessToken },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      if (courseId) socket.emit('join_course', { courseId });
    });

    socket.on('disconnect', () => setConnected(false));

    socket.on('connect_error', (err) => {
      console.warn('[useSocket] connection error:', err.message);
    });

    return () => {
      if (courseId) socket.emit('leave_course', { courseId });
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  // Reconnect when the access token rotates (after a silent refresh)
  }, [accessToken, courseId]);

  return { socket: socketRef.current, connected };
};

export default useSocket;
