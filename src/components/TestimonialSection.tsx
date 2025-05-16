
import React from "react";
import { motion } from "framer-motion";

export function TestimonialSection() {
  const testimonials = [
    {
      quote: "The mental challenges in SheldonAI's were just what I needed. This is a new way to grow your thinking.",
      author: "Nirmit",
      role: "Center Point, Nagpur",
      avatar: "/lovable-uploads/f55d6022-d436-4d21-8025-971332e892b9.png" // New photo 1
    },
    {
      quote: "After a week with SheldonAI, my thinking got clearer and more organized. The feedback is just what I needed.",
      author: "Harshita",
      role: "IEEE RGIPT",
      avatar: "/lovable-uploads/44f417aa-6871-4078-9ec3-14f0f45a9809.png" // New photo 2
    },
    {
      quote: "Getting early access to Icon Playbooks showed me new ways to think like a leader. I'm excited for the full launch.",
      author: "Moksh Agrawal",
      role: "SRM University",
      avatar: "/lovable-uploads/aa79b967-a988-4fc9-bbb7-e8be07f6abbb.png" // New photo 3
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
          What our beta testers are saying about SheldonAI's unique approach of playground
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
