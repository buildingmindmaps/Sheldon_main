import React, { useState } from 'react';
import {
  signInWithGoogle,
  signInWithFacebook,
  signInWithEmail,
  signUpWithEmail,
  isEmailVerified,
  resendVerificationEmail,
  resetPassword,
  updateUserProfile,
  User
} from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isCompulsory?: boolean;
  redirectPath?: string;
}

export function AuthModal({ isOpen, onClose, isCompulsory = false, redirectPath }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        try {
          const result = await signInWithEmail(email, password);
          setCurrentUser(result.user);

          // Check if email is verified
          if (!isEmailVerified(result.user)) {
            setNeedsVerification(true);
            setError('Please verify your email before proceeding.');
            return;
          }

          // User is verified, proceed with login
          onClose();
          // Redirect if needed
          if (redirectPath) {
            window.location.href = redirectPath;
          }
        } catch (err) {
          const errorMessage = (err as Error).message;
          console.log("Auth error:", errorMessage); // For debugging

          // Check for specific Firebase error codes
          if (errorMessage.includes('auth/user-not-found') ||
              errorMessage.includes('firebase: Error (auth/user-not-found)') ||
              errorMessage.includes('user-not-found')) {
            // Custom friendly message for new users
            setError('This email is not registered. Please sign up first.');
            // Automatically switch to sign up mode
            setIsLogin(false);
          } else if (errorMessage.includes('auth/wrong-password') ||
                    errorMessage.includes('firebase: Error (auth/wrong-password)') ||
                    errorMessage.includes('wrong-password')) {
            setError('Incorrect password. Please try again.');
          } else if (errorMessage.includes('auth/invalid-credential') ||
                    errorMessage.includes('firebase: Error (auth/invalid-credential)') ||
                    errorMessage.includes('invalid-credential')) {
            // Handle invalid credential error (wrong password or email not registered)
            setError('Invalid email or password. If you don\'t have an account yet, please sign up.');
            // We could optionally offer to switch to sign up here
          } else if (errorMessage.includes('auth/invalid-email') ||
                    errorMessage.includes('firebase: Error (auth/invalid-email)') ||
                    errorMessage.includes('invalid-email')) {
            setError('Please enter a valid email address.');
          } else if (errorMessage.includes('auth/too-many-requests') ||
                    errorMessage.includes('firebase: Error (auth/too-many-requests)') ||
                    errorMessage.includes('too-many-requests')) {
            setError('Too many failed login attempts. Please try again later or reset your password.');
          } else {
            setError('Login failed. Please check your credentials and try again.');
            console.error("Unhandled auth error:", errorMessage);
          }
        }
      } else {
        // Sign up process
        try {
          if (!name.trim()) {
            setError('Please enter your name.');
            setLoading(false);
            return;
          }

          const result = await signUpWithEmail(email, password);
          setCurrentUser(result.user);

          // Update the user profile with their name
          await updateUserProfile(result.user, name);

          setNeedsVerification(true);
          setSuccess('Account created! Please check your email to verify your account.');
        } catch (err) {
          const errorMessage = (err as Error).message;
          const errorCode = (err as any).code;

          // Check for our custom password validation error
          if (errorCode === 'auth/password-validation-failed') {
            setError(errorMessage); // Use the exact message from our validator
          }
          // Check for existing account
          else if (errorMessage.includes('auth/email-already-in-use') ||
              errorMessage.includes('firebase: Error (auth/email-already-in-use)') ||
              errorMessage.includes('email-already-in-use')) {
            setError('An account with this email already exists. Please sign in instead.');
            // Automatically switch to sign in mode
            setIsLogin(true);
          } else if (errorMessage.includes('auth/weak-password') ||
                     errorMessage.includes('firebase: Error (auth/weak-password)') ||
                     errorMessage.includes('weak-password')) {
            setError('Password is too weak. Please use at least 6 characters.');
          } else if (errorMessage.includes('auth/invalid-email') ||
                     errorMessage.includes('firebase: Error (auth/invalid-email)') ||
                     errorMessage.includes('invalid-email')) {
            setError('Please enter a valid email address.');
          } else {
            setError('Sign up failed. Please try again.');
            console.error("Unhandled auth error:", errorMessage);
          }
        }
      }
    } catch (err) {
      // This should only catch errors not handled in the nested try-catch blocks
      const errorMessage = (err as Error).message;
      setError(`Authentication error: ${errorMessage}`);
      console.error("Unhandled outer auth error:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (currentUser) {
        await resendVerificationEmail(currentUser);
        setSuccess('Verification email sent! Please check your inbox.');
      } else {
        setError('No user found. Please try signing in again.');
      }
    } catch (err) {
      setError((err as Error).message);
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
      await resetPassword(email);
      setSuccess('Password reset email sent! Please check your inbox.');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await signInWithGoogle();
      // Google accounts are pre-verified
      onClose();
      // Redirect if needed
      if (redirectPath) {
        window.location.href = redirectPath;
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Show verification required screen
  if (needsVerification) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Email Verification Required</h2>
            {!isCompulsory && (
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            )}
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}

          <div className="text-center p-4">
            <p className="mb-4">
              We've sent a verification email to <strong>{email}</strong>.
              Please check your inbox and click the verification link to continue.
            </p>

            <button
              onClick={handleResendVerification}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 mb-4"
            >
              {loading ? 'Sending...' : 'Resend Verification Email'}
            </button>

            <p className="text-sm text-gray-600">
              If you've already verified your email, please sign in again.
            </p>

            <button
              onClick={() => {
                setNeedsVerification(false);
                setIsLogin(true);
              }}
              className="mt-4 text-blue-600 hover:underline"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show password reset screen
  if (showResetPassword) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Reset Password</h2>
            {!isCompulsory && (
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            )}
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="reset-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <button
            onClick={() => setShowResetPassword(false)}
            className="mt-4 text-blue-600 hover:underline w-full text-center"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  // Default login/signup form
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#FCFCFC] rounded-lg p-8 max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#49dd80] to-[#11ba81] bg-clip-text text-transparent">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h2>
          {!isCompulsory && (
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          )}
        </div>

        {error && (
          <p className="text-red-500 mb-4 bg-[#fef3c7] p-3 rounded-md border border-red-200">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-700 mb-4 bg-[#ebf3ff] p-3 rounded-md border border-green-200">
            {success}
          </p>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-[#f9fafb] focus:ring-[#b5ff4c] focus:border-[#b5ff4c] focus:outline-none"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-[#f9fafb] focus:ring-[#b5ff4c] focus:border-[#b5ff4c] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-[#f9fafb] focus:ring-[#b5ff4c] focus:border-[#b5ff4c] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A6.978 6.978 0 0012 19.5c-3.866 0-7-3.134-7-7s3.134-7 7-7c1.125 0 2.175.263 3.125.725M16.5 12c0 1.125-.263 2.175-.725 3.125M12 15.75l3.75 3.75m0-3.75L12 18.75" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A6.978 6.978 0 0012 19.5c-3.866 0-7-3.134-7-7s3.134-7 7-7c1.125 0 2.175.263 3.125.725M16.5 12c0 1.125-.263 2.175-.725 3.125M12 15.75l3.75 3.75m0-3.75L12 18.75" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6feb62] text-[#000000] py-2 px-4 rounded-md hover:bg-[#000000] hover:text-[#FFFFFF] transition-colors duration-200 disabled:opacity-50 font-semibold"
          >
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>

          {isLogin && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowResetPassword(true)}
                className="text-sm text-[#49dd80] hover:text-[#11ba81] hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}
        </form>

        <div className="mt-6 relative flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-3 text-gray-500 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="mt-4 flex flex-col space-y-2">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full border border-gray-300 bg-white py-2 px-4 rounded-md hover:bg-[#f1f2f3] flex items-center justify-center font-medium transition-colors"
          >
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#49dd80] hover:text-[#11ba81] hover:underline font-medium"
          >
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
          </button>
        </div>

        {!isCompulsory && (
          <div className="mt-4 text-center">
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800 hover:underline text-sm">
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
