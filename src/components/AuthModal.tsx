import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useSearchParams } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isCompulsory?: boolean;
  redirectPath?: string;
}

export function AuthModal({ isOpen, onClose, isCompulsory = false, redirectPath }: AuthModalProps) {
  const { login, register, resendVerificationEmail, verifyEmail } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [searchParams] = useSearchParams();

  // Check for verification token in URL
  useEffect(() => {
    if (!isOpen) return;

    const token = searchParams.get('token');
    if (token) {
      handleVerifyEmail(token);
    }
  }, [isOpen, searchParams]);

  // Function to handle email verification from token
  const handleVerifyEmail = async (token: string) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await verifyEmail(token);

      if (result?.verified) {
        setSuccess(result.message || 'Email verified successfully! You can now log in.');
        // Reset verification flag since email is now verified
        setNeedsVerification(false);
        // Switch to login tab since user can now log in
        setIsLogin(true);
      } else {
        setError('Failed to verify email. The verification link may have expired.');
      }
    } catch (err: any) {
      console.error('Email verification error:', err);
      setError(err.message || 'Failed to verify email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    setNeedsVerification(false);

    try {
      if (isLogin) {
        try {
          await login(email, password);

          // If login is successful (no error thrown), close modal
          onClose();
          // Redirect if needed
          if (redirectPath) {
            window.location.href = redirectPath;
          }
        } catch (err: any) {
          const errorMessage = err.message || 'Login failed';
          console.log("Auth error:", errorMessage); // For debugging

          // Check if this is an email verification issue
          if (errorMessage.includes('verify') || errorMessage.includes('verification') ||
              errorMessage.includes('not verified') || err.needsVerification) {
            setNeedsVerification(true);
            setError('Please verify your email before logging in.');
          } else if (errorMessage.includes('not found') || errorMessage.includes('not registered')) {
            // Custom friendly message for new users
            setError('This email is not registered. Please sign up first.');
            // Automatically switch to sign up mode
            setIsLogin(false);
          } else if (errorMessage.includes('password') || errorMessage.includes('credential')) {
            setError('Incorrect password. Please try again.');
          } else if (errorMessage.includes('invalid')) {
            setError('Invalid email or password. If you don\'t have an account yet, please sign up.');
          } else {
            setError('Login failed. Please check your credentials and try again.');
            console.error("Unhandled auth error:", errorMessage);
          }
        }
      } else {
        // Sign up process
        try {
          if (!username.trim()) {
            setError('Please enter your name.');
            setLoading(false);
            return;
          }

          await register(username, email, password);
          setSuccess('Account created! Please check your email to verify your account before logging in.');

          // Don't switch to login mode automatically
          // Instead, show verification needed message
          setNeedsVerification(true);
        } catch (err: any) {
          const errorMessage = err.message || 'Registration failed';

          if (errorMessage.includes('already exists') || errorMessage.includes('already in use')) {
            setError('An account with this email already exists. Please sign in instead.');
            // Automatically switch to sign in mode
            setIsLogin(true);
          } else if (errorMessage.includes('password') && errorMessage.includes('weak')) {
            setError('Password is too weak. Please use at least 6 characters.');
          } else if (errorMessage.includes('email') && errorMessage.includes('invalid')) {
            setError('Please enter a valid email address.');
          } else {
            setError('Sign up failed. Please try again.');
            console.error("Unhandled auth error:", errorMessage);
          }
        }
      }
    } catch (err: any) {
      // This should only catch errors not handled in the nested try-catch blocks
      const errorMessage = err.message || 'Authentication error';
      setError(`Authentication error: ${errorMessage}`);
      console.error("Unhandled outer auth error:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await resendVerificationEmail(email);
      setSuccess('Verification email has been resent. Please check your inbox.');
    } catch (err: any) {
      setError('Failed to resend verification email. Please try again.');
      console.error("Error resending verification:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Call the forgot-password endpoint
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess('If an account with that email exists, a password reset link has been sent.');
        // Clear the email field after successful submission
        setEmail('');
      } else {
        const data = await response.json();
        setError(data.message || 'An error occurred while processing your request.');
      }
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError('Failed to send password reset email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Redirect to your backend's Google OAuth endpoint
    window.location.href = 'http://localhost:5001/api/auth/google';
  };

  // Reset Password View
  if (showResetPassword) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
          <form onSubmit={handleResetPassword}>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                id="reset-email"
                className="w-full p-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => setShowResetPassword(false)}
              >
                Back to Login
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Reset Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Main Auth Modal (Login/Register)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{isLogin ? 'Sign In' : 'Sign Up'}</h2>
          {!isCompulsory && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          )}
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

        <form onSubmit={handleEmailAuth}>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                id="name"
                className="w-full p-2 border rounded"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full p-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col mb-6">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-2"
              disabled={loading}
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 border border-gray-400 rounded shadow flex items-center justify-center"
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign {isLogin ? 'In' : 'Up'} with Google
            </button>
          </div>

          <div className="flex items-center justify-between">
            {isLogin && (
              <button
                type="button"
                className="text-blue-500 hover:underline"
                onClick={() => {
                  onClose(); // Close the modal
                  window.location.href = '/auth/forgot-password'; // Redirect to the dedicated forgot password page
                }}
              >
                Forgot Password?
              </button>
            )}
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
            >
              {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
            </button>
          </div>
        </form>

        {needsVerification && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {`A verification email has been sent to ${email}. Please check your inbox and verify your email to complete the registration.`}
            </p>
            <button
              onClick={handleResendVerification}
              className="mt-2 text-blue-500 hover:underline"
              disabled={loading}
            >
              {loading ? 'Resending...' : 'Resend Verification Email'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
