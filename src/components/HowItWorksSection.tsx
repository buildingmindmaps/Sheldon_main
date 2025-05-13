
import React from "react";
import { motion } from "framer-motion";
import { BookText, BarChart3, Users } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: <BookText className="w-6 h-6 text-white" />,
      title: "Select a Case",
      description: "Choose from our library of industry-specific cases or get a randomized challenge that matches your experience level.",
      color: "bg-gradient-to-r from-green-400 to-brand-green"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      title: "Practice with AI",
      description: "Engage in a realistic interview with our AI interviewer that adapts to your responses and pushes your thinking.",
      color: "bg-gradient-to-r from-blue-500 to-indigo-500"
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: "Get Feedback",
      description: "Receive immediate, detailed feedback on your approach, structuring, and analytical skills with actionable insights.",
      color: "bg-gradient-to-r from-amber-400 to-orange-500"
    }
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto bg-gray-50 rounded-3xl overflow-hidden">
      <motion.div 
        className="absolute w-64 h-64 bg-gradient-to-r from-brand-green to-green-200 rounded-full blur-3xl opacity-20 -z-10"
        animate={{ 
          x: [0, 50, 0], 
          y: [0, 30, 0],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{ top: "20%", left: "10%" }}
      />
      
      <motion.div 
        className="absolute w-80 h-80 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full blur-3xl opacity-20 -z-10"
        animate={{ 
          x: [0, -70, 0], 
          y: [0, 50, 0],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{ bottom: "10%", right: "5%" }}
      />
      
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Master case interviews in three simple steps with our AI-powered platform
        </p>
      </div>
      
      <div className="relative z-10">
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent -translate-y-1/2"></div>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6 mx-auto" style={{ background: step.color }}>
                {step.icon}
              </div>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-700">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">{step.title}</h3>
              <p className="text-gray-600 text-center">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      <motion.div 
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-brand-green font-medium">Ready to get started?</p>
        <h3 className="text-2xl font-bold mt-2 mb-6">Join our waitlist today and be among the first to experience CaseAI</h3>
      </motion.div>
    </section>
  );
}
