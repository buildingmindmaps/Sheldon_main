import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Define API base URL
const API_BASE_URL = 'http://localhost:5001/api';

// Define user interface based on your backend's user model
export interface User {
  _id: string;
  username: string;
  email: string;
  dateOfJoining: string;
  modulesCompleted: Array<{
    moduleId: string;
    completedAt: string;
  }>;
  experiencePoints: number;
  unlockedModules: string[]; // Added for module locking feature
  isVerified?: boolean; // Added to track verification status
  avatar?: string; // Added to store user's Google profile image URL
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  intended: string | null;
  setIntended: (path: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<{message: string; needsVerification: boolean}>;
  verifyEmail: (token: string) => Promise<{message: string; verified: boolean}>;
  resendVerificationEmail: (email: string) => Promise<{message: string}>;
  logout: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
}

// Export the context directly so it can be imported elsewhere
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Set up axios with JWT interceptor
const setupAxiosAuth = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [intended, setIntended] = useState<string | null>(null);

  // Function to fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setUser(null);
        return;
      }

      setupAxiosAuth(token);
      const response = await axios.get(`${API_BASE_URL}/auth/profile`);
      console.log('User profile data from API:', response.data);
      console.log('Avatar URL from API:', response.data.avatar);
      setUser(response.data);
      return response.data; // Return data for additional processing if needed
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // If error occurs (e.g., invalid token), clear user and token
      localStorage.removeItem('auth_token');
      setUser(null);
      setupAxiosAuth(null);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { token, ...userData } = response.data;

      // Store token and set up axios
      localStorage.setItem('auth_token', token);
      setupAxiosAuth(token);

      // Set user data
      setUser(userData);
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);

      // Check if the error is because the email isn't verified
      if (error.response?.data?.needsVerification) {
        throw new Error('Please verify your email before logging in.');
      }

      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, { username, email, password });

      // Return the response data which includes message about verification
      return {
        message: response.data.message || 'Registration successful! Please check your email to verify your account.',
        needsVerification: true,
        ...response.data
      };
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  // Email verification function
  const verifyEmail = async (token: string) => {
    try {
      // Log the verification attempt for debugging
      console.log(`Attempting to verify email with token: ${token.substring(0, 10)}...`);

      // Make sure token is properly encoded for URLs
      const encodedToken = encodeURIComponent(token);

      const response = await axios.get(`${API_BASE_URL}/auth/verify/${encodedToken}`);
      console.log('Verification response:', response.data);

      return {
        message: response.data.message || 'Email verified successfully!',
        verified: true
      };
    } catch (error: any) {
      console.error('Email verification error:', error);
      console.error('Error details:', error.response?.data);

      // Check if error is "already verified" - this should be treated as success
      if (error.response?.status === 400 &&
          error.response?.data?.message?.toLowerCase().includes('already verified')) {
        return {
          message: 'Your email has already been verified. You can now log in to your account.',
          verified: true,
          alreadyVerified: true
        };
      }

      // Return a clear error object for other errors
      return {
        message: error.response?.data?.message || 'Email verification failed. Please try requesting a new verification link.',
        verified: false,
        error: true
      };
    }
  };

  // Resend verification email function
  const resendVerificationEmail = async (email: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/resend-verification`, { email });
      return response.data;
    } catch (error: any) {
      console.error('Resend verification email error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Resend verification email failed');
    }
  };

  // Logout function
  const logout = async () => {
    // Clear user data and token
    setUser(null);
    localStorage.removeItem('auth_token');
    setupAxiosAuth(null);
  };

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      await fetchUserProfile();
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const value = {
    user,
    loading,
    intended,
    setIntended,
    login,
    register,
    verifyEmail,
    resendVerificationEmail,
    logout,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Export a hook for easier context use
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
