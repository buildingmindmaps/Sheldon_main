
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface FooterLinkGroupProps {
  title: string;
  links: {
    label: string;
    href: string;
    isHashLink?: boolean;
  }[];
}

const FooterLinkGroup = ({ title, links }: FooterLinkGroupProps) => {
  const location = useLocation();
  
  // Handle navigation with scroll to top for non-hash links
  // or scrolling to specific section for hash links
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isHashLink?: boolean) => {
    // If it's a hash link and we're on the homepage
    if (isHashLink && location.pathname === '/') {
      // Let default hash navigation work, but don't need to prevent default
      return;
    }
    // If it's a hash link but we're not on homepage
    else if (isHashLink && location.pathname !== '/') {
      e.preventDefault();
      // First navigate to homepage, then scroll to section
      // We'll use window.location directly to ensure full navigation followed by hash scrolling
      window.location.href = `/${href}`;
    } 
    // Regular navigation, just scroll to top
    else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex flex-col">
      <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link 
              to={link.href} 
              className="text-gray-600 hover:text-brand-green transition-colors"
              onClick={(e) => handleNavigation(e, link.href, link.isHashLink)}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export function Footer() {
  const location = useLocation();
  
  // Function to scroll to top when clicking "Back to Top" button
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="relative z-10 bg-gray-50 border-t border-gray-100">
      <div className="py-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Company info */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4" onClick={scrollToTop}>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/lovable-uploads/365f4f40-afd0-40d0-8588-0b97fe4b4699.png" alt="SheldonAI Logo" />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <span className="font-bold text-xl">SheldonAI</span>
            </Link>
            <p className="text-gray-600 mb-6">
              Schools prepare you for tests, we prepare you for challenges no one solved yet!
            </p>
          </div>

          {/* Quick Links */}
          <FooterLinkGroup 
            title="Navigation"
            links={[
              { label: "Home", href: "/" },
              { label: "Playbook", href: "/playbook" },
              { label: "Careers", href: "/careers" },
              { label: "Contact Us", href: "/contact" },
            ]} 
          />

          {/* Resources */}
          <FooterLinkGroup 
            title="Resources"
            links={[
              { label: "Playbook", href: "/playbook" },
              { label: "FAQs", href: "/#faqs", isHashLink: true },
              { label: "How It Works", href: "/#how-it-works", isHashLink: true },
            ]} 
          />

          {/* Legal */}
          <FooterLinkGroup 
            title="Legal"
            links={[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms of Service", href: "/terms-of-service" },
            ]} 
          />
        </div>
        
        {/* Copyright and bottom links */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">© 2025 SheldonAI. All rights reserved.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={scrollToTop} className="text-gray-600 hover:text-gray-900">
              <ArrowUp className="h-4 w-4 mr-2" />
              Back to Top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
