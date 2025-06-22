import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import axios from 'axios';

const OAuthCallbackHandler = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { fetchUserProfile, intended, user } = useAuth();

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Get token from URL query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
          setStatus('error');
          setErrorMessage('No authentication token found in the callback URL.');
          return;
        }

        // Store token and set up axios
        localStorage.setItem('auth_token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Fetch user data with the new token
        await fetchUserProfile();

        // Debug: Log the user object after fetching profile
        console.log('User data received after OAuth login:', user);

        setStatus('success');

        // Redirect to intended page or dashboard after a short delay
        setTimeout(() => {
          navigate(intended || '/dashboard', { replace: true });
        }, 1500);
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setErrorMessage('Failed to process authentication. Please try again.');
      }
    };

    processOAuthCallback();
  }, [fetchUserProfile, navigate, intended, user]);

  // Show appropriate UI based on status
  if (status === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Processing Login</h2>
        <p className="text-gray-600">Please wait while we complete your authentication...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-100 p-4 rounded-lg mb-4">
          <svg className="h-6 w-6 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2 text-center">Authentication Failed</h2>
          <p className="text-gray-700 text-center">{errorMessage || 'An unknown error occurred'}</p>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-green-100 p-4 rounded-lg mb-4">
        <svg className="h-6 w-6 text-green-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h2 className="text-xl font-semibold mb-2 text-center">Login Successful!</h2>
        <p className="text-gray-700 text-center">Redirecting you to your dashboard...</p>
      </div>
    </div>
  );
};

export default OAuthCallbackHandler;
