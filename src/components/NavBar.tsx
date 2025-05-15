
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from "framer-motion";

export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

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

  return (
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
        <div className="font-bold text-xl">
          <Link to="/" onClick={scrollToTop}>CaseAI</Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Button variant="ghost" asChild>
            <Link to="/playbook" onClick={scrollToTop}>Playbook</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/careers" onClick={scrollToTop}>Careers</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/contact" onClick={scrollToTop}>Contact Us</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
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
                  <Link to="/careers">Careers</Link>
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <Button variant="ghost" asChild className="w-full justify-start text-lg py-3" onClick={() => {setMobileMenuOpen(false); scrollToTop();}}>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
