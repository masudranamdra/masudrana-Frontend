import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Crucial for cookie transmission
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
      // Don't log expected 401 errors for auth routes (/auth/login, /auth/me, /auth/register)
      const isExpectedAuthError = error.response.status === 401 && (
        error.config?.url?.includes('/auth/me') ||
        error.config?.url?.includes('/auth/login') ||
        error.config?.url?.includes('/auth/register')
      );

      if (!isExpectedAuthError) {
        console.error('API Error Response:', error.response.status, error.response.data);
      }
    } else if (error.request) {
      // Request made but no response received
      const fullUrl = (error.config?.baseURL || '') + (error.config?.url || '');
      console.error('API Network Error:', error.message || 'No response received from server', fullUrl ? `(${fullUrl})` : '');
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

// Helper to transform Google Drive, ImgBB, Cloudinary, or raw PDF URLs into embeddable PDF URLs
export const formatPdfEmbedUrl = (url: string | undefined): string => {
  if (!url) return '';
  const cleanUrl = url.trim();

  // If Google Drive link: convert /view or /edit to /preview
  if (cleanUrl.includes('drive.google.com')) {
    const driveIdMatch = cleanUrl.match(/\/file\/d\/([^\/]+)/) || cleanUrl.match(/id=([^&]+)/);
    if (driveIdMatch && driveIdMatch[1]) {
      return `https://drive.google.com/file/d/${driveIdMatch[1]}/preview`;
    }
  }

  // If direct PDF link or Cloudinary PDF: use Google Docs PDF Viewer Embedder
  if (cleanUrl.toLowerCase().endsWith('.pdf') || cleanUrl.includes('cloudinary.com') || cleanUrl.includes('.pdf?')) {
    return `https://docs.google.com/gview?url=${encodeURIComponent(cleanUrl)}&embedded=true`;
  }

  return cleanUrl;
};

// Helper to transform Google Drive image URLs into direct displayable image links
export const formatImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  const cleanUrl = url.trim();

  // If Google Drive image link: convert to direct display URL
  if (cleanUrl.includes('drive.google.com')) {
    const driveIdMatch = cleanUrl.match(/\/file\/d\/([^\/]+)/) || cleanUrl.match(/id=([^&]+)/);
    if (driveIdMatch && driveIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
    }
  }

  return cleanUrl;
};

export default API;
