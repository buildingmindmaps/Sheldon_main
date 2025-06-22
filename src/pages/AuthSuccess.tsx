import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the token from URL query parameters
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setError('Authentication failed: No token received');
      setLoading(false);
      return;
    }

    try {
      // Store the token in localStorage
      localStorage.setItem('auth_token', token);

      // You might want to fetch user data here or update authentication context

      // Redirect to the dashboard or home page after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError('Failed to process authentication');
      console.error('Auth success error:', err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <h2 className="mt-4 text-xl font-semibold">Completing sign-in...</h2>
          <p className="mt-2 text-gray-600">Please wait while we set up your session.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold">Authentication Failed</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-semibold">Sign-In Successful!</h2>
        <p className="mt-2 text-gray-600">Redirecting you to your dashboard...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
