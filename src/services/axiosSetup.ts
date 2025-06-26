import axios from 'axios';

// Create an axios instance with default configuration
export const axiosInstance = axios.create({
  // Use environment variable for base URL if available, otherwise default to localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
  // Ensure cookies are sent with requests (important for authentication)
  withCredentials: true,
});

// Request interceptor to add auth token from localStorage if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token'); // Fixed: Using 'auth_token' instead of 'token'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (e.g., token expired)
    if (error.response && error.response.status === 401) {
      // Could handle logout or token refresh here
      console.warn('Authentication error, you may need to log in again');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
