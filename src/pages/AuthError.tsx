import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthError = () => {
  const [errorMessage, setErrorMessage] = useState('An unknown error occurred');
  const navigate = useNavigate();

  useEffect(() => {
    // Get the error message from URL query parameters
    const params = new URLSearchParams(window.location.search);
    const message = params.get('message');

    if (message) {
      setErrorMessage(message);
    }
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h2 className="mt-4 text-center text-xl font-bold text-gray-900">Authentication Failed</h2>
        <p className="mt-2 text-center text-gray-600">{errorMessage}</p>
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate('/login')}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthError;
