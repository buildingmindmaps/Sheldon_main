import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { auth } from '@/lib/firebase';
import { AuthModal } from './AuthModal';
import { logOut } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const isMobile = useIsMobile();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Save user's email
        if (user.email) {
          setUserEmail(user.email);
        }

        // Get user's name from Firebase
        if (user.displayName) {
          setDisplayName(user.displayName);
        } else if (user.email) {
          // Use email as fallback and extract first part before @
          const emailName = user.email.split('@')[0];
          setDisplayName(emailName);
        }
      } else {
        setDisplayName('');
        setUserEmail('');
      }
    });
    return unsubscribe;
  }, []);

  // Handle click outside of dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle scroll events for hiding/showing navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      // Update background opacity based on scroll position
      if (currentScrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (!isMobile && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, mobileMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (mobileMenuOpen && !target.closest('nav')) {
        setMobileMenuOpen(false);
      }
    };
    
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Function to ensure page scrolls to top when clicking links
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logOut();
      setUserDropdownOpen(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Get user's initial for avatar
  const getUserInitial = () => {
    if (displayName) {
      return displayName.charAt(0).toUpperCase();
    }
    return "U"; // Default fallback
  };

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled 
            ? 'backdrop-blur-md bg-white/70 shadow-sm border-b border-gray-100/50' 
            : 'backdrop-blur-sm bg-white/20'
        }`}
      >
        <nav className="relative py-4 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto flex justify-between items-center">
          <div className="font-bold text-xl flex items-center gap-2">
            <Link to="/" onClick={scrollToTop} className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/lovable-uploads/365f4f40-afd0-40d0-8588-0b97fe4b4699.png" alt="SheldonAI Logo" />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <span>SheldonAI</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center">
            <Button variant="ghost" asChild>
              <Link to="/playbook" onClick={scrollToTop}>Playbook</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/all-courses" onClick={scrollToTop}>All Courses</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/careers" onClick={scrollToTop}>Careers</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/contact" onClick={scrollToTop}>Contact Us</Link>
            </Button>

            {/* Authentication Button or User Avatar */}
            {!currentUser ? (
              <Button
                className="bg-[#6feb62] text-[#000000] hover:bg-[#000000] hover:text-white ml-2"
                onClick={() => setShowAuthModal(true)}
              >
                Log In
              </Button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <Avatar
                  className="h-10 w-10 cursor-pointer bg-gradient-to-r from-[#49dd80] to-[#11ba81] text-white border-2 border-white"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <AvatarFallback>{getUserInitial()}</AvatarFallback>
                </Avatar>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="text-sm font-medium truncate">{displayName}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{userEmail}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Authentication Button for Mobile */}
            {!currentUser ? (
              <Button
                className="bg-[#6feb62] text-[#000000] hover:bg-[#000000] hover:text-white mr-2 py-1 px-3 text-sm"
                onClick={() => setShowAuthModal(true)}
              >
                Sign In
              </Button>
            ) : (
              <Avatar
                className="h-8 w-8 cursor-pointer bg-gradient-to-r from-[#49dd80] to-[#11ba81] text-white border-2 border-white mr-2"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <AvatarFallback>{getUserInitial()}</AvatarFallback>
              </Avatar>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="relative z-50 transition-all duration-300"
            >
              <div className="relative w-6 h-6">
                <motion.span
                  className="absolute h-0.5 bg-current rounded w-6 transform transition-all"
                  animate={{
                    top: mobileMenuOpen ? "50%" : "30%",
                    rotate: mobileMenuOpen ? "45deg" : "0deg"
                  }}
                  style={{ transformOrigin: "center" }}
                />
                <motion.span
                  className="absolute h-0.5 bg-current rounded w-6 top-1/2 transform transition-all"
                  animate={{
                    opacity: mobileMenuOpen ? 0 : 1,
                    width: mobileMenuOpen ? 0 : "100%"
                  }}
                />
                <motion.span
                  className="absolute h-0.5 bg-current rounded w-6 transform transition-all"
                  animate={{
                    top: mobileMenuOpen ? "50%" : "70%",
                    rotate: mobileMenuOpen ? "-45deg" : "0deg"
                  }}
                  style={{ transformOrigin: "center" }}
                />
              </div>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden fixed inset-0 top-[72px] backdrop-blur-lg bg-white/90 z-40 border-t shadow-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "100vh" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div
                className="flex flex-col p-6 space-y-5 h-full"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, staggerChildren: 0.1 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button variant="ghost" asChild className="w-full justify-start text-lg py-3" onClick={() => {setMobileMenuOpen(false); scrollToTop();}}>
                    <Link to="/playbook">Playbook</Link>
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <Button variant="ghost" asChild className="w-full justify-start text-lg py-3" onClick={() => {setMobileMenuOpen(false); scrollToTop();}}>
                    <Link to="/all-courses">All Courses</Link>
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.2 }}
                >
                  <Button variant="ghost" asChild className="w-full justify-start text-lg py-3" onClick={() => {setMobileMenuOpen(false); scrollToTop();}}>
                    <Link to="/careers">Careers</Link>
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.3 }}
                >
                  <Button variant="ghost" asChild className="w-full justify-start text-lg py-3" onClick={() => {setMobileMenuOpen(false); scrollToTop();}}>
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </motion.div>

                {/* User Authentication in Mobile Menu */}
                {currentUser && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.4 }}
                    className="pt-2 mt-2 border-t border-gray-200"
                  >
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Signed in as <span className="font-medium text-gray-900">{displayName}</span>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-lg py-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User dropdown for mobile (outside the hamburger menu) */}
        {currentUser && userDropdownOpen && (
          <div className="md:hidden absolute right-4 top-16 w-60 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-gray-500 truncate mt-0.5">{userEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        isCompulsory={false}
      />
    </>
  );
}
