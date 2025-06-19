
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from './AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        setShowAuthModal(true);
      }
    }
  }, [user, loading, location.pathname]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // No user logged in - show login modal
  if (!user) {
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

  // User logged in
  return <>{children}</>;
}
