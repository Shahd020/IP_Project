import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Module-level token store — updated by AuthContext whenever the token rotates.
 * This lets the interceptor read the latest token without needing React context.
 */
let currentAccessToken = null;

export const setAccessToken = (token) => {
  currentAccessToken = token;
};

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends HttpOnly refresh-token cookie automatically
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Attach the current access token to every outgoing request.
apiClient.interceptors.request.use((config) => {
  if (currentAccessToken) {
    config.headers['Authorization'] = `Bearer ${currentAccessToken}`;
  }
  return config;
});

// ─── Response Interceptor — Silent Token Refresh ──────────────────────────────
// When a request fails with 401, attempt one silent refresh then retry.
// Multiple concurrent requests that 401 simultaneously are queued until
// the single refresh resolves, then all are replayed with the new token.

let isRefreshing = false;
let refreshQueue = [];

const drainQueue = (token) => {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    const is401 = error.response?.status === 401;
    // Skip retry for the refresh call itself to avoid infinite loops
    const isRefreshCall = original.url?.includes('/auth/refresh');

    if (!is401 || original._retry || isRefreshCall) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      // Queue this request until the in-flight refresh finishes
      return new Promise((resolve) => {
        refreshQueue.push((token) => {
          original.headers['Authorization'] = `Bearer ${token}`;
          resolve(apiClient(original));
        });
      });
    }

    isRefreshing = true;

    try {
      const res = await apiClient.post('/auth/refresh');
      const newToken = res.data.data.accessToken;

      currentAccessToken = newToken;
      drainQueue(newToken);
      isRefreshing = false;

      original.headers['Authorization'] = `Bearer ${newToken}`;
      return apiClient(original);
    } catch (refreshError) {
      isRefreshing = false;
      currentAccessToken = null;
      drainQueue(null);
      // Session is dead — send the user back to login
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
