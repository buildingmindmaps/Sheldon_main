
import React from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Linkedin, Mail, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WaitlistForm } from '@/components/WaitlistForm';
import { motion } from 'framer-motion';
import { 
  HoverCard, 
  HoverCardTrigger, 
  HoverCardContent 
} from '@/components/ui/hover-card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const Contact = () => {
  // Team members information
  const teamMembers = [
    {
      name: "Darshit Patel",
      position: "Founder & CEO",
      photo: "/lovable-uploads/22ec87d2-9ea8-4d5d-8596-c9a96ad6da9e.png",
      linkedin: "https://www.linkedin.com/in/darshitjpatel/",
      bio: "Leading SheldonAI's vision to transform professional problem-solving skills through AI"
    },
    {
      name: "Sushant Raj Gupta",
      position: "Product Manager",
      photo: "/lovable-uploads/bc7bc379-94ed-42a3-b7c8-9a4c99988a10.png",
      linkedin: "https://www.linkedin.com/in/sushantrajgupta/",
      bio: "Building exceptional user experiences and shaping our product roadmap"
    },
    {
      name: "Srishti Kumari",
      position: "Co-Founder – Growth & Partnerships",
      photo: "/lovable-uploads/2fa784fb-4d95-4df9-8426-5d946cd71672.png", 
      linkedin: "https://www.linkedin.com/in/srishti-kumari-/",
      bio: "Driving growth initiatives and building strategic partnerships for SheldonAI"
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
                we'd love to hear from you at <a href="mailto:connect@sheldonai.in" className="text-brand-green hover:underline font-medium">connect@sheldonai.in</a>
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
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Card className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md border-gray-100 hover:border-brand-green">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={member.photo} 
                            alt={member.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                          <a 
                            href={member.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-white hover:text-brand-green bg-black/70 px-3 py-1.5 rounded-full text-sm"
                          >
                            <Linkedin className="h-3.5 w-3.5" />
                            Connect
                          </a>
                        </div>
                      </div>
                      <CardContent className="p-4 text-center">
                        <h3 className="font-bold text-lg">{member.name}</h3>
                        <p className="text-sm text-gray-500">{member.position}</p>
                      </CardContent>
                    </Card>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-72 p-4 bg-white text-gray-700 shadow-lg rounded-xl border border-gray-100">
                    <div className="flex justify-between items-start">
                      <Avatar className="w-12 h-12 border-2 border-brand-green">
                        <AvatarImage src={member.photo} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <a 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-brand-green hover:text-green-700"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </div>
                    <div className="mt-3">
                      <h4 className="font-bold">{member.name}</h4>
                      <p className="text-sm text-gray-500 mb-2">{member.position}</p>
                      <p className="text-sm">{member.bio}</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
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
                Have questions about SheldonAI? The best way to reach us is through our general email:
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
            Join our waitlist to receive updates on our launch and exclusive tips for case interview preparation.
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
