
import React from 'react';
import { Button } from "@/components/ui/button";
import { BookText, BarChart3, Users, Briefcase, ArrowRight } from "lucide-react";
import { WaitlistForm } from "@/components/WaitlistForm";
import { FloatingElements } from "@/components/FloatingElements";
import { AppScreens } from "@/components/AppScreens";
import { InteractiveFeaturesWithProfiles } from "@/components/InteractiveFeaturesWithProfiles";
import { TestimonialSection } from "@/components/TestimonialSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { FaqSection } from "@/components/FaqSection";
import { Link } from "react-router-dom";
import { useIsMobile } from '@/hooks/use-mobile';
import { JourneySection } from '@/components/JourneySection';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';

// Add custom border width style
const customStyles = `
  .border-3 {
    border-width: 3px;
  }
`;

const Index = () => {
  const isMobile = useIsMobile();

  // Function to scroll to top when clicking "Back to Top" button
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Custom styles for the site */}
      <style>{customStyles}</style>
      
      <FloatingElements />
      
      {/* Navbar - replaced with the new NavBar component */}
      <NavBar />
      
      {/* Hero Section - with spacing for fixed navbar */}
      <section className="relative z-10 pt-24 md:pt-36 pb-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Text content - 50% width */}
          <div className="lg:w-1/2 lg:pr-8">
            <div className="inline-block mb-4 px-3 py-1 bg-brand-gray rounded-full text-sm font-medium text-gray-700">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-green mr-2"></span>
              Coming Soon
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Think Different,<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-green-400">Think in Systems</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              They prepare you for tests, we prepare you for challenges no one solved yet!
            </p>
            
            <div className="mb-12">
              <WaitlistForm />
            </div>
          </div>
          
          {/* Image mockup - 50% width */}
          <div className="lg:w-1/2 w-full">
            <div className="w-full max-w-[95%] mx-auto">
              <AppScreens />
            </div>
          </div>
        </div>
      </section>
      
      {/* Journey Section */}
      <JourneySection />
      
      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Your Path to Smarter Thinking</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock the tools, mindsets, and habits that set real problem-solvers apart.
          </p>
        </div>
        
        <InteractiveFeaturesWithProfiles />
      </section>
      
      {/* How It Works Section */}
      <HowItWorksSection />
      
      {/* Testimonial Section */}
      <TestimonialSection />
      
      {/* FAQ Section */}
      <FaqSection />
      
      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="bg-gray-50 rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-brand-green opacity-10 rounded-full -mr-20 -mb-20"></div>
          <div className="relative z-10 max-w-md">
            <h2 className="text-3xl font-bold mb-4">Be the First to Know</h2>
            <p className="text-gray-600 mb-6">
              Join our waitlist and get early access when we launch. Plus, receive exclusive tips to prepare for your case interviews.
            </p>
            <div className="mb-6">
              <WaitlistForm />
            </div>
            <div className="mt-8">
              <Link to="/playbook" className="inline-flex items-center text-brand-green font-medium hover:underline">
                Check out our Playbook <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>;
};

export default Index;
