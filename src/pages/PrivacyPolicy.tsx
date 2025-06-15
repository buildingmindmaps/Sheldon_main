
import React from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />
      
      <div className="flex-grow pt-24 md:pt-32 pb-16 px-4 sm:px-6 lg:px-12 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">Last Updated: May 15, 2025</p>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to SheldonAI ("we," "our," or "us"). We are committed to protecting your privacy and handling your data with transparency. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our AI case interview practice services.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
            <h3 className="text-lg font-medium mb-2">2.1 Personal Information</h3>
            <p className="mb-4">We may collect personal information that you voluntarily provide to us when you:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Register for an account</li>
              <li>Join our waitlist</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact our support team</li>
              <li>Participate in user surveys</li>
            </ul>
            <p>This information may include your name, email address, educational background, and professional information.</p>
            
            <h3 className="text-lg font-medium mb-2 mt-6">2.2 Usage Data</h3>
            <p>
              When you use our services, we may collect data about your interactions with our case interview practice platform, including your responses, performance metrics, practice frequency, and areas of improvement.
            </p>
            
            <h3 className="text-lg font-medium mb-2 mt-6">2.3 Technical Data</h3>
            <p>
              Our servers automatically log information about your visit including IP address, browser type, operating system, referring pages, pages visited, clickstream data, and the date and time of your visit.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>To provide and maintain our services</li>
              <li>To personalize and improve your learning experience</li>
              <li>To analyze usage patterns and optimize our platform</li>
              <li>To communicate with you about updates, offers, and relevant content</li>
              <li>To provide customer support</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
            <p className="mb-4">We may share your information with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Service providers and partners who help us deliver our services</li>
              <li>Analytics providers who help us understand how our services are used</li>
              <li>Legal authorities when required by law</li>
            </ul>
            <p>
              We do not sell your personal information to third parties for marketing purposes.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Your Data Rights</h2>
            <p className="mb-4">Depending on your location, you may have rights to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access the personal information we hold about you</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your personal information</li>
              <li>Restrict or object to certain processing of your data</li>
              <li>Request a copy of your data in a portable format</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the details provided in the "Contact Us" section.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Cookies and Similar Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to collect information about your browsing activities. You can manage your cookie preferences through your browser settings.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under 16 years of age. We do not knowingly collect personal information from children. If we learn that we have collected personal information from a child, we will take steps to delete that information promptly.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Contact Us</h2>
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us through our <a href="/contact" className="text-brand-green hover:underline">Contact Page</a>.
            </p>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
