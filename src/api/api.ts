// api.ts
import axios from 'axios';
import { AuthService } from '../modules/auth/services/auth'; // Adjust the path as needed

const api = axios.create({
  baseURL: 'http://localhost:3005/api/v1', // Replace with your actual API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;

// Store pending requests to retry after token refresh
let failedQueue: Array<{ 
  resolve: (value: unknown) => void; 
  reject: (reason?: any) => void; 
  config: any; 
}> = [];

// Process the queue of failed requests
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(request => {
    if (error) {
      request.reject(error);
    } else {
      // Update the request with the new token
      if (request.config.headers && token) {
        request.config.headers['Authorization'] = `Bearer ${token}`;
      }
      request.resolve(api(request.config));
    }
  });
  
  // Reset the queue
  failedQueue = [];
};

// Request interceptor to add the access token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses and errors globally
api.interceptors.response.use(
  (response : any) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is not 401 or originalRequest is undefined, reject immediately
    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // If originalRequest already retried (to prevent infinite loops)
    if (originalRequest._retry) {
      // Redirect to login page or clear auth
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login'; // Adjust based on your routing setup
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // If already refreshing, add request to queue
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    // Set refreshing flag and retry flag
    isRefreshing = true;
    originalRequest._retry = true;

    try {
      // Call refresh token API
      const result = await AuthService.refreshToken();
      const newAccessToken = result.data.accessToken;
      
      // Update authorization header
      if (originalRequest.headers) {
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      }
      
      // Process pending requests
      processQueue(null, newAccessToken);
      
      // Retry the original request
      return api(originalRequest);
    } catch (refreshError) {
      // Process queue with error
      processQueue(refreshError, null);
      
      // Clear tokens and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login'; // Adjust based on your routing setup
      
      return Promise.reject(refreshError);
    } finally {
      // Reset refreshing flag
      isRefreshing = false;
    }
  }
);

export default api;
