
import React from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />
      
      <div className="flex-grow pt-24 md:pt-32 pb-16 px-4 sm:px-6 lg:px-12 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">Last Updated: May 15, 2025</p>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing or using SheldonAI's website and services ("Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you should not access or use our Services.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Description of Services</h2>
            <p>
              SheldonAI provides an AI-powered platform for practicing case interviews and developing business problem-solving skills. Our Services include practice case scenarios, feedback on performance, and resources to improve your interview skills.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
            <p className="mb-4">
              To access certain features of our Services, you may need to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your account login information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. User Conduct</h2>
            <p className="mb-4">As a user of our Services, you agree not to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe the intellectual property rights of any third party</li>
              <li>Attempt to gain unauthorized access to our systems or user accounts</li>
              <li>Use our Services to distribute harmful code or conduct malicious activities</li>
              <li>Interfere with or disrupt the operation of our Services</li>
              <li>Harvest or collect user information without permission</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Intellectual Property</h2>
            <p className="mb-4">
              Our Services, including all content, features, and functionality, are owned by SheldonAI and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              We grant you a limited, non-exclusive, non-transferable, and revocable license to access and use our Services for your personal, non-commercial use, subject to these Terms.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. User Content</h2>
            <p className="mb-4">
              By submitting content to our Services (including responses to practice cases), you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and display such content in connection with providing and improving our Services.
            </p>
            <p>
              You represent and warrant that you own or have the necessary rights to the content you submit and that such content does not violate the rights of any third party.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Subscription and Payments</h2>
            <p className="mb-4">
              Some of our Services may require a subscription or payment. By subscribing to our paid Services, you agree to pay all fees in accordance with the pricing and payment terms presented to you at the time of purchase.
            </p>
            <p>
              Subscription fees are non-refundable except as may be expressly provided in our refund policy or as required by applicable law.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to our Services, with or without notice, for any reason, including if we believe you have violated these Terms.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
            <p>
              OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL SHELDONAI BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which SheldonAI is established, without regard to its conflict of law provisions.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">12. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time by posting the revised terms on our website. Your continued use of our Services after such changes constitutes your acceptance of the revised Terms.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">13. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us through our <a href="/contact" className="text-brand-green hover:underline">Contact Page</a>.
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
