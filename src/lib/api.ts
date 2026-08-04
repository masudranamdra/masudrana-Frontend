import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Crucial for cookie transmission
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to attach Bearer tokens from localStorage as a fallback
API.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      // Don't log 401 errors for /auth/me as they are expected when user is not logged in
      if (!(error.response.status === 401 && error.config?.url?.includes('/auth/me'))) {
        console.error('API Error Response:', error.response.status, error.response.data);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('API Network Error:', error.request);
      console.error('API URL:', process.env.NEXT_PUBLIC_API_URL);
    } else {
      // Error in request setup
      console.error('API Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Health check - test backend connectivity
export const testBackendConnection = async (): Promise<boolean> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
    const response = await axios.get(`${baseURL}/health`, { timeout: 5000 });
    console.log('Backend health check:', response.data);
    return true;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

// Helper to format local asset URLs or Cloudinary URLs
export const getAssetUrl = (url: string | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const host = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
  return `${host}${url}`;
};

export default API;
