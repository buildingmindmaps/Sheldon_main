
import React from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />
      
      <div className="flex-grow pt-24 md:pt-32 pb-16 px-4 sm:px-6 lg:px-12 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Contact Us</h1>
        
        <div className="bg-gray-50 rounded-2xl p-8 sm:p-12 mb-10 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-brand-green opacity-10 rounded-full -mr-20 -mb-20"></div>
          
          <div className="relative z-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-4">
                Have questions about CaseAI? We'd love to hear from you! While we're building our product, the best way to reach us is directly through our founder.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400">
                  DP
                </div>
                
                <div>
                  <h3 className="text-xl font-bold">Darshit Patel</h3>
                  <p className="text-gray-600 mb-4">CEO & Founder</p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <a 
                      href="https://www.linkedin.com/in/darshitpatel4455/" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center text-gray-700 hover:text-brand-green transition-colors"
                    >
                      <Linkedin className="h-5 w-5 mr-2" />
                      LinkedIn Profile
                    </a>
                    
                    <span className="hidden sm:inline text-gray-300">|</span>
                    
                    <div className="inline-flex items-center text-gray-700">
                      <Mail className="h-5 w-5 mr-2" />
                      <span className="text-gray-400 italic">Email coming soon</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-medium mb-2">A note from Darshit:</h4>
                <p className="text-gray-600">
                  I'm excited about what we're building at CaseAI and always open to connect with fellow enthusiasts, potential users, and partners. Whether you have questions about our platform, suggestions for improvement, or just want to discuss the future of case interview preparation, feel free to reach out via LinkedIn. I personally respond to all messages and look forward to hearing from you!
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">What happens next?</h3>
              <p className="text-gray-600">
                After you reach out, you can expect a response typically within 1-2 business days. For general questions about our platform, you might also find answers in our <Link to="/#faqs" className="text-brand-green hover:underline">FAQs section</Link>.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Want to stay updated?</h3>
          <p className="text-gray-600 mb-4">
            Join our waitlist to receive updates on our launch and exclusive tips for case interview preparation.
          </p>
          <Link to="/" className="inline-flex items-center justify-center text-brand-green hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;
