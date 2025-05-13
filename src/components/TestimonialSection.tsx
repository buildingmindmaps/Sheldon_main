
import React from "react";
import { motion } from "framer-motion";

export function TestimonialSection() {
  const testimonials = [
    {
      quote: "CaseAI helped me secure offers from BCG and McKinsey. The structured approach and instant feedback were game-changers.",
      author: "Alex K.",
      role: "MBA Graduate, Harvard Business School",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote: "After a month of daily practice on CaseAI, I noticed a dramatic improvement in my problem-solving skills. Now I think in frameworks naturally.",
      author: "Sarah L.",
      role: "Consultant, Strategy&",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      quote: "The Icon Playbooks are pure gold. Getting inside the minds of top executives has transformed my approach to business problems.",
      author: "Michael T.",
      role: "Product Manager, Google",
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
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Voices of Success</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Hear from professionals who have transformed their case interview skills with CaseAI
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div 
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)" }}
          >
            <div className="text-5xl text-brand-green opacity-20 font-serif absolute top-4 left-4">"</div>
            <div className="pt-6 pb-4 relative z-10">
              <p className="text-gray-700">{testimonial.quote}</p>
            </div>
            <div className="flex items-center gap-3">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.author} 
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="font-medium text-gray-900">{testimonial.author}</h4>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
