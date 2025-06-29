import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { axiosInstance } from '../services/axiosSetup';

// Define user type based on your application's user model
interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  experiencePoints: number;
  modulesCompleted: any[];
  unlockedModules: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  currentUser: User | null; // Added for compatibility with existing code
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');

        if (token) {
          // Set the auth token for requests
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Get current user data
          const response = await axiosInstance.get('/api/auth/profile');
          console.log('User profile data from API:', response.data);
          console.log('Unlocked Modules:', response.data.unlockedModules); // Add this line to specifically log unlockedModules
          console.log('Avatar URL from API:', response.data.avatar);
          setUser(response.data);
        }
      } catch (err) {
        console.error('Authentication error:', err);
        // Clear token if it's invalid
        localStorage.removeItem('authToken');
        setError('Authentication session expired. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;

      // Save token and set user
      localStorage.setItem('authToken', token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.post('/api/auth/register', {
        username,
        email,
        password
      });

      const { token, user } = response.data;

      // Save token and set user
      localStorage.setItem('authToken', token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Always clear local state regardless of API success
      localStorage.removeItem('authToken');
      delete axiosInstance.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    currentUser: user // Added for compatibility with your existing code
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
