
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookText, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { WaitlistForm } from '@/components/WaitlistForm';

const IconsPlaybook = () => {
  const featuredPost = {
    title: "Think Like Elon Musk: First Principles Thinking",
    excerpt: "Explore how Elon Musk breaks down complex problems to their fundamental truths and builds up from there, with practical examples and exercises.",
    date: "May 10, 2025",
    author: "SheldonAI Team",
    category: "Mental Models",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1470&auto=format&fit=crop"
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      {/* Header - with spacing for fixed navbar */}
      <header className="pt-24 pb-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Playbook
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Weekly case studies and mental models from the world's most innovative business leaders
          </motion.p>
        </div>
      </header>
      
      {/* Featured Post - with Link to Full Article */}
      <section className="py-8 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <motion.div 
          className="relative rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="relative h-96 md:h-[500px]">
            <img 
              src={featuredPost.image} 
              alt={featuredPost.title} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
              <span className="inline-block px-3 py-1 bg-brand-green/80 rounded-full text-sm font-medium mb-4">
                {featuredPost.category}
              </span>
              <h2 className="text-2xl md:text-4xl font-bold mb-4">{featuredPost.title}</h2>
              <p className="text-lg mb-6 text-gray-200 max-w-3xl">{featuredPost.excerpt}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{featuredPost.date}</span>
                  <span className="mx-2">•</span>
                  <span className="text-sm">{featuredPost.author}</span>
                </div>
                
                <Link to="/article">
                  <Button className="bg-white text-black hover:bg-gray-200">
                    Read Playbook <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Newsletter/Waitlist CTA - matching the home page style */}
      <section className="py-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="bg-brand-gray rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-brand-green opacity-10 rounded-full -mr-20 -mb-20"></div>
          <div className="relative z-10 max-w-lg">
            <BookText className="w-10 h-10 text-brand-green mb-4" />
            <h2 className="text-3xl font-bold mb-4">Want to stay updated?</h2>
            <p className="text-gray-600 mb-6">
              Join our waitlist to receive updates on our launch and exclusive tips for case interview preparation.
            </p>
            <div className="max-w-md">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>
      
      {/* Using global Footer component */}
      <Footer />
    </div>
  );
};

export default IconsPlaybook;
