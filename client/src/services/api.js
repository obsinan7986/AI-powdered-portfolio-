/**
 * Axios API client.
 * All calls go to VITE_API_URL (proxied to :5000 in dev).
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT for admin routes automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio-admin-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
