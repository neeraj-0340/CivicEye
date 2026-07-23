import axios from 'axios';

// Get API base URL from environment or default to local backend port 5001
export const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach auth token automatically if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
