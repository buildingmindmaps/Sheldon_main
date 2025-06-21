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
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  intended: string | null;
  setIntended: (path: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
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
      setUser(response.data);
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
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, { username, email, password });
      // Note: You might want to auto-login or just return the response
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
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


