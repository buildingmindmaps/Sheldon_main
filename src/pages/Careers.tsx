
import React from 'react';
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/NavBar";
import { Calendar, MapPin, Briefcase, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Careers = () => {
  const jobListings = [
    {
      title: "AI Research Engineer",
      location: "Remote (US/EU)",
      type: "Full-time",
      department: "Engineering",
      postedDate: "May 10, 2025",
      description: "We're looking for an experienced AI Research Engineer to help us build the next generation of case interview preparation tools. You'll work on developing and improving our AI models for analyzing responses and providing feedback.",
      requirements: [
        "5+ years of experience in machine learning or AI",
        "Strong background in natural language processing",
        "Experience with large language models",
        "Proficiency in Python and ML frameworks",
        "MS or PhD in Computer Science, AI, or related field"
      ]
    },
    {
      title: "Product Marketing Manager",
      location: "San Francisco, CA",
      type: "Full-time",
      department: "Marketing",
      postedDate: "May 8, 2025",
      description: "Join our team as a Product Marketing Manager to help us reach more business school students and professionals preparing for case interviews. You'll develop and execute marketing strategies to drive growth and engagement.",
      requirements: [
        "3+ years of experience in product marketing",
        "Experience marketing to MBA students or professionals",
        "Strong analytical and communication skills",
        "Background in SaaS product marketing preferred",
        "MBA or related degree a plus"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      {/* Header with spacing for fixed navbar */}
      <header className="pt-24 pb-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Join Our Team
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Help us transform how professionals prepare for case interviews and develop their problem-solving skills
          </motion.p>
        </div>
      </header>
      
      {/* Job Listings */}
      <section className="py-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Open Positions</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {jobListings.map((job, index) => (
            <motion.div 
              key={index}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <span className="inline-block px-3 py-1 bg-brand-gray rounded-full text-sm font-medium text-gray-700 mb-4">
                {job.department}
              </span>
              <h3 className="text-2xl font-bold mb-2">{job.title}</h3>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {job.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="h-4 w-4 mr-1" />
                  {job.type}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  Posted {job.postedDate}
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">{job.description}</p>
              
              <h4 className="font-semibold mb-2">Requirements:</h4>
              <ul className="list-disc pl-5 mb-6 space-y-1 text-gray-600">
                {job.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
              
              <Button className="w-full">
                Apply Now <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="bg-brand-gray rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-brand-green opacity-10 rounded-full -mr-20 -mb-20"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Don't see the right role?</h2>
            <p className="text-gray-600 mb-8">
              We're always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <Button size="lg" className="bg-black hover:bg-gray-800 text-white">
              Send us your resume
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-xl">CaseAI</span>
            <p className="text-gray-600 text-sm mt-1">© 2025 CaseAI. All rights reserved.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            <a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Terms of Service</a>
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

export default Careers;
