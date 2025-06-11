import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { AuthModal } from './AuthModal';
import { isEmailVerified, resendVerificationEmail } from '../lib/firebase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, loading, setIntended } = useAuth();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        // Store the intended path for redirect after login
        setIntended(location.pathname);
        setShowAuthModal(true);
      }
      // Check if email is verified
      else if (currentUser.email && !isEmailVerified(currentUser)) {
        setVerificationRequired(true);
      }
    }
  }, [currentUser, loading, location.pathname, setIntended]);

  // Handle cooldown timer for resend button
  useEffect(() => {
    let timer: number | undefined;
    if (resendCooldown > 0) {
      timer = window.setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (!currentUser || resendCooldown > 0) return;

    setResendStatus('sending');
    try {
      await resendVerificationEmail(currentUser);
      setResendStatus('success');
      // Set a 60-second cooldown before allowing another resend
      setResendCooldown(60);
    } catch (error) {
      console.error("Error resending verification email:", error);
      setResendStatus('error');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // No user logged in - show login modal
  if (!currentUser) {
    return (
      <>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => {}} // Empty function as this is a compulsory modal
          isCompulsory={true}
          redirectPath={location.pathname}
        />
        <div className="flex items-center justify-center h-screen">
          Please sign in to access this page
        </div>
      </>
    );
  }

  // User logged in but email not verified
  if (verificationRequired) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-screen p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Email Verification Required</h2>
            <p className="mb-4">
              Please verify your email address before accessing this content.
              We've sent a verification link to <strong>{currentUser.email}</strong>.
            </p>
            <p className="mb-6 text-sm text-gray-600">
              Check your inbox and click the verification link, then refresh this page.
            </p>

            {/* Verification Status Messages */}
            {resendStatus === 'success' && (
              <div className="mb-4 p-2 bg-green-50 text-green-700 rounded-md">
                Verification email sent successfully! Please check your inbox.
              </div>
            )}

            {resendStatus === 'error' && (
              <div className="mb-4 p-2 bg-red-50 text-red-700 rounded-md">
                Failed to send verification email. Please try again.
              </div>
            )}

            <div className="flex flex-col space-y-3">
              {/* "I've Verified" Button */}
              <button
                onClick={async () => {
                  try {
                    // Force refresh the user to check verification status
                    await currentUser.reload();
                    if (isEmailVerified(currentUser)) {
                      setVerificationRequired(false);
                    } else {
                      alert('Your email is still not verified. Please check your inbox.');
                    }
                  } catch (error) {
                    console.error("Error refreshing user:", error);
                  }
                }}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 w-full"
              >
                I've Verified My Email
              </button>

              {/* Resend Verification Email Button */}
              <button
                onClick={handleResendVerification}
                disabled={resendStatus === 'sending' || resendCooldown > 0}
                className="bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendStatus === 'sending' ? 'Sending...' :
                 resendCooldown > 0 ? `Resend Email (${resendCooldown}s)` :
                 'Resend Verification Email'}
              </button>

              {/* Sign Out Option */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    import('../lib/firebase').then(({ logOut }) => {
                      logOut();
                    });
                  }}
                  className="text-sm text-red-600 hover:underline"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // User logged in and email verified
  return <>{children}</>;
}
