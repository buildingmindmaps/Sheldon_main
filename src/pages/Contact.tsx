
import React from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Linkedin, Mail, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WaitlistForm } from '@/components/WaitlistForm';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';

const Contact = () => {
  // Team members information
  const teamMembers = [
    {
      name: "Darshit Patel",
      position: "Founder & CEO",
      photo: "/lovable-uploads/76f4be6a-81e8-4fbe-8887-b2ad23db2ef7.png",
      linkedin: "https://www.linkedin.com/in/darshitjpatel/",
      bio: "Leading SheldonAI's vision to transform professional problem-solving skills through AI"
    },
    {
      name: "Sushant Raj Gupta",
      position: "Product Manager (Initial founders)",
      photo: "/lovable-uploads/60b0993c-41fa-4263-85aa-bea3483ddf1c.png",
      linkedin: "https://www.linkedin.com/in/sushantrajgupta/",
      bio: "Building exceptional user experiences and shaping our product roadmap"
    },
    {
      name: "Srishti Kumari",
      position: "Growth & Partnerships (Initial founders",
      photo: "/lovable-uploads/414d0a97-7737-4e53-8dd2-1c146b3f3b02.png", 
      linkedin: "https://www.linkedin.com/in/srishti-kumari-/",
      bio: "Driving growth initiatives and building strategic partnerships for SheldonAI"
    },
    {
      name: "Harshita Sharma",
      position: "Engineer",
      photo: "/lovable-uploads/Harshita.jpeg", 
      linkedin: "https://www.linkedin.com/in/harshita-sharma-627446279/",
      bio: "Building robust systems and contributing to impactful tech development at SheldonAI."
    },
    {
      name: "Anshita Singh",
      position: "Engineer",
      photo: "/lovable-uploads/Anshita.jpeg", 
      linkedin: "https://www.linkedin.com/in/anshita-singh-089522283/",
      bio: "Creating strong system foundations while advancing impactful technology at SheldonAI."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />
      
      <div className="flex-grow pt-24 md:pt-32 pb-16 px-4 sm:px-6 lg:px-12 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Contact Us</h1>
        
        {/* Company note section */}
        <motion.div 
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 sm:p-12 mb-10 relative overflow-hidden shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-brand-green opacity-10 rounded-full -mr-20 -mb-20"></div>
          
          <div className="relative z-10">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
                <Users className="h-6 w-6 text-brand-green" />
                A Note From SheldonAI
              </h2>
              <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                At SheldonAI, we're on a mission to transform how professionals approach complex problem-solving. 
                Our team is passionate about combining cutting-edge AI with cognitive science to create learning 
                experiences that truly make a difference.
              </p>
              <p className="text-gray-600 max-w-2xl mx-auto">
                If you're excited about our vision and want to join us on this journey, 
                we'd love to hear from you!
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Team section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Meet Our Team</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                className="relative h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg border-gray-100 hover:border-brand-green">
                  <div className="relative">
                    {/* Using AspectRatio to maintain consistent image ratio */}
                    <AspectRatio ratio={3/4} className="bg-gray-100">
                      <img 
                        src={member.photo} 
                        alt={member.name} 
                        className="w-full h-full object-cover object-center"
                      />
                    </AspectRatio>
                    
                    {/* Dark overlay with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70"></div>
                    
                    {/* LinkedIn button - always visible */}
                    <div className="absolute bottom-3 right-3 z-20">
                      <a 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-white bg-brand-green/90 hover:bg-brand-green px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:shadow-md"
                      >
                        <Linkedin className="h-3.5 w-3.5" />
                        Connect
                      </a>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{member.position}</p>
                    <p className="text-sm text-gray-600">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
        
        <div className="bg-gray-50 rounded-2xl p-8 sm:p-12 mb-10 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-brand-green opacity-10 rounded-full -mr-20 -mb-20"></div>
          
          <div className="relative z-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-4">
                Have questions about SheldonAI? The best way to reach us is through our email:
              </p>
              
              <div className="flex items-center gap-2 text-lg font-medium text-brand-green">
                <Mail className="h-5 w-5" />
                <a href="mailto:connect@sheldonai.in" className="hover:underline">connect@sheldonai.in</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h3 className="text-xl font-semibold mb-4">Want to stay updated?</h3>
          <p className="text-gray-600 mb-6">
            Join our waitlist to receive updates on our launch and exclusive tips for case preparation.
          </p>
          <div className="max-w-md mx-auto">
            <WaitlistForm />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;
