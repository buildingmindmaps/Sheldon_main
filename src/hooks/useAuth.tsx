import { useState, useEffect, createContext, useContext } from 'react';

// Define types for our authentication system
interface User {
  id: string;
  email: string;
}

interface Session {
  user: User;
  token: string;
  expires_at: number;
}

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  education: string | null;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { full_name: string; education: string; phone_number: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedSession = localStorage.getItem('sheldonai_session');
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession);
        // Check if session is expired
        if (parsedSession.expires_at > Date.now()) {
          setSession(parsedSession);
          setUser(parsedSession.user);
          // Fetch user profile
          fetchProfile(parsedSession.user.id);
        } else {
          // Session expired, clear it
          localStorage.removeItem('sheldonai_session');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error parsing stored session:', err);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Function to fetch user profile from MongoDB
  const fetchProfile = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session?.token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data.profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (
    email: string,
    password: string,
    userData: { full_name: string; education: string; phone_number: string }
  ) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          full_name: userData.full_name,
          education: userData.education,
          phone_number: userData.phone_number
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Registration failed' };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { error: error.message || 'An unknown error occurred' };
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Authentication failed' };
      }

      // Set session, user and expiry
      const newSession = {
        token: data.token,
        user: data.user,
        expires_at: Date.now() + (data.expiresIn || 86400) * 1000, // Default to 24 hours
      };

      localStorage.setItem('sheldonai_session', JSON.stringify(newSession));
      setSession(newSession);
      setUser(data.user);

      // Fetch user profile after successful login
      await fetchProfile(data.user.id);

      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error: error.message || 'An unknown error occurred' };
    }
  };

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    try {
      // Redirect to Google OAuth route
      window.location.href = `${API_URL}/auth/google`;
      return { error: null };
    } catch (error: any) {
      console.error('Google sign in error:', error);
      return { error: error.message };
    }
  };

  // Sign out
  const signOut = async () => {
    localStorage.removeItem('sheldonai_session');
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Password reset request failed' };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return { error: error.message || 'An unknown error occurred' };
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const response = await fetch(`${API_URL}/users/${user.id}/profile`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Failed to update profile' };
      }

      // Update local profile state
      setProfile(prev => prev ? { ...prev, ...updates } : null);

      return { error: null };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { error: error.message || 'An unknown error occurred' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
        updateProfile,
      }}
    >
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
