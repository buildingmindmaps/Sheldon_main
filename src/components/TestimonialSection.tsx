
import React from "react";
import { motion } from "framer-motion";

export function TestimonialSection() {
  const testimonials = [
    {
      quote: "The beta version of CaseAI impressed me with its realistic interview scenarios. I can already tell this will be a game-changer for case preparation.",
      author: "Alex K.",
      role: "Beta Tester, MBA Candidate",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote: "After just a week of testing CaseAI, I noticed a significant improvement in how I structure my thoughts. The instant feedback is exactly what I've been looking for.",
      author: "Sarah L.",
      role: "Beta Tester, Consulting Aspirant",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      quote: "The early access to the Icon Playbooks gave me invaluable insights into executive thinking. Can't wait for the full release of this powerful tool.",
      author: "Michael T.",
      role: "Beta Tester, Product Manager",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg"
    }
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-green opacity-10 rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gray-200 opacity-50 rounded-full"></div>
      </div>
      
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Early Feedback</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          What our beta testers are saying about CaseAI's unique approach to case interview preparation
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div 
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              y: -5, 
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
              borderColor: "rgba(132, 255, 1, 0.5)"
            }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-green to-green-300"></div>
            <div className="text-5xl text-brand-green opacity-20 font-serif absolute top-4 left-4">"</div>
            <div className="pt-6 pb-4 relative z-10">
              <p className="text-gray-700">{testimonial.quote}</p>
            </div>
            <div className="flex items-center gap-3">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.author} 
                className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
              />
              <div>
                <h4 className="font-medium text-gray-900">{testimonial.author}</h4>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-gradient-to-r from-green-50 to-green-100 rounded-full opacity-70"></div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="inline-block px-4 py-2 bg-green-50 rounded-full text-brand-green text-sm font-medium">
          <span className="flex items-center">
            <span className="w-2 h-2 bg-brand-green rounded-full mr-2"></span>
            Limited beta program in progress
          </span>
        </div>
      </motion.div>
    </section>
  );
}
