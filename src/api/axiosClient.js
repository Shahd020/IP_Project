// src/api/axiosClient.js
// Central Axios instance used by every custom hook.
// Handles: base URL, access token injection, automatic token refresh on 401.
import axios from 'axios';
import { getToken, setToken } from './tokenStore';

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send the httpOnly refresh-token cookie on every request
});

// ── Request interceptor ───────────────────────────────────────────────────────
// Attaches the current Access Token to every outgoing request automatically.
// Components and hooks never touch Authorization headers directly.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor — token refresh logic ────────────────────────────────
// When the server returns 401 (expired access token), we:
//   1. Call POST /auth/refresh — the httpOnly cookie carries the refresh token.
//   2. Store the new access token in memory.
//   3. Retry the original failed request with the new token.
//   4. If refresh also fails, clear the token and redirect to /login.
//
// The failedQueue pattern ensures that multiple concurrent requests that all
// receive 401 are all retried once — not triggering multiple refresh calls.

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Another refresh is in flight — queue this request until it resolves
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint — no Authorization header, uses cookie instead
        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        setToken(data.accessToken);
        processQueue(null, data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setToken(null);
        // Clear stale user info and send to login
        sessionStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
