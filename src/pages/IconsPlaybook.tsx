import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, BookText, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { NavBar } from '@/components/NavBar';

const IconsPlaybook = () => {
  const featuredPost = {
    title: "Think Like Elon Musk: First Principles Thinking",
    excerpt: "Explore how Elon Musk breaks down complex problems to their fundamental truths and builds up from there, with practical examples and exercises.",
    date: "May 10, 2025",
    author: "CaseAI Team",
    category: "Mental Models",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1470&auto=format&fit=crop"
  };

  const recentPosts = [
    {
      title: "Steve Jobs' Product Intuition Framework",
      excerpt: "Learn how Jobs developed his legendary product sense and how to apply his thinking to your case solutions.",
      date: "May 5, 2025",
      category: "Product Strategy",
      image: "https://images.unsplash.com/photo-1533073526757-2c8ca1df9f1c?q=80&w=1470&auto=format&fit=crop"
    },
    {
      title: "Satya Nadella's Transformation Playbook",
      excerpt: "Examine how Nadella led Microsoft's massive transformation and apply his leadership principles to organizational cases.",
      date: "April 28, 2025",
      category: "Leadership",
      image: "https://images.unsplash.com/photo-1553484771-689577e70e26?q=80&w=1470&auto=format&fit=crop"
    },
    {
      title: "Jeff Bezos and the Working Backwards Method",
      excerpt: "Master Bezos' unique approach to innovation and learn how to incorporate it into your case frameworks.",
      date: "April 21, 2025",
      category: "Innovation",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1470&auto=format&fit=crop"
    }
  ];

  const categories = [
    "Mental Models", "Leadership", "Innovation", 
    "Market Entry", "Pricing Strategy", "Digital Transformation",
    "M&A", "Product Strategy", "Supply Chain"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar - replaced with the new NavBar component */}
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
      
      {/* Rest of the page content - unchanged */}
      {/* Featured Post */}
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
                
                <Button className="bg-white text-black hover:bg-gray-200">
                  Read More <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Recent Posts */}
      <section className="py-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Recent Playbooks</h2>
          <Button variant="outline" className="border-gray-300">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-brand-green">{post.category}</span>
                    <span className="text-xs text-gray-500">{post.date}</span>
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto pt-4">
                  <Button variant="outline" className="w-full">Read Playbook</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">Browse by Category</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((category, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <Button 
                variant="outline" 
                className="rounded-full border-gray-200 hover:border-brand-green hover:bg-brand-gray"
              >
                {category}
              </Button>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="bg-brand-gray rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-brand-green opacity-10 rounded-full -mr-20 -mb-20"></div>
          <div className="relative z-10 max-w-lg">
            <BookText className="w-10 h-10 text-brand-green mb-4" />
            <h2 className="text-3xl font-bold mb-4">Get weekly playbooks in your inbox</h2>
            <p className="text-gray-600 mb-6">
              Subscribe to receive our Playbook directly to your email every week, plus exclusive tips on structured problem-solving.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
              />
              <Button className="bg-black hover:bg-gray-800 text-white whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="font-bold text-xl">CaseAI</Link>
            <p className="text-gray-600 text-sm mt-1">© 2025 CaseAI. All rights reserved.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            <a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Terms of Service</a>
            <Link to="/careers" className="text-gray-600 hover:text-gray-900">Careers</Link>
            <Button variant="outline" size="sm" className="mt-4 md:mt-0" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IconsPlaybook;
