
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Linkedin, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FooterLinkGroupProps {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}

const FooterLinkGroup = ({ title, links }: FooterLinkGroupProps) => (
  <div className="flex flex-col">
    <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.label}>
          <Link 
            to={link.href} 
            className="text-gray-600 hover:text-brand-green transition-colors"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export function Footer() {
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
            <Link to="/" className="font-bold text-xl mb-4 block">CaseAI</Link>
            <p className="text-gray-600 mb-6">
              Master business problem-solving with our structured AI practice platform. Get instant feedback and improve with every session.
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
              { label: "FAQs", href: "/#faqs" },
              { label: "How It Works", href: "/#how-it-works" },
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
            <p className="text-gray-600 text-sm">© 2025 CaseAI. All rights reserved.</p>
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
