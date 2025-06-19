
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function useAuthPopup(delay: number = 5000) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Skip popup if user is already logged in
    if (user) return;

    // Check if popup has been shown before in this session
    const popupShown = sessionStorage.getItem('auth_popup_shown');

    if (!popupShown) {
      const timer = setTimeout(() => {
        setShowAuthModal(true);
        // Mark popup as shown for this session
        sessionStorage.setItem('auth_popup_shown', 'true');
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [user, delay]);

  return {
    showAuthModal,
    setShowAuthModal
  };
}
