
import React from "react";
import { motion } from "framer-motion";
import { BookText, BarChart3, Users } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: <BookText className="w-6 h-6 text-white" />,
      title: "Select a Case",
      description: "Choose from our library of industry-specific cases or get a randomized challenge that matches your experience level.",
      color: "bg-gradient-to-r from-green-400 to-brand-green",
      visual: (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-20 h-28 bg-white rounded-lg shadow-md border border-gray-200 transform rotate-[-5deg] absolute z-10">
            <div className="w-full h-1/3 bg-brand-green rounded-t-lg"></div>
            <div className="p-2">
              <div className="h-2 w-12 bg-gray-200 rounded mb-2"></div>
              <div className="h-2 w-14 bg-gray-200 rounded mb-2"></div>
              <div className="h-2 w-10 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="w-20 h-28 bg-white rounded-lg shadow-md border border-gray-200 transform rotate-[5deg] absolute">
            <div className="w-full h-1/3 bg-blue-500 rounded-t-lg"></div>
            <div className="p-2">
              <div className="h-2 w-12 bg-gray-200 rounded mb-2"></div>
              <div className="h-2 w-14 bg-gray-200 rounded mb-2"></div>
              <div className="h-2 w-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      title: "Practice with AI",
      description: "Engage in a realistic interview with our AI interviewer that adapts to your responses and pushes your thinking.",
      color: "bg-gradient-to-r from-blue-500 to-indigo-500",
      visual: (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
              <motion.div 
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z" stroke="#4F46E5" strokeWidth="2"/>
                  <path d="M15 12L10 15.4641V8.5359L15 12Z" fill="#4F46E5"/>
                </svg>
              </motion.div>
            </div>
          </div>
          <motion.div 
            className="absolute w-full h-full"
            animate={{
              background: [
                "radial-gradient(circle at center, rgba(79,70,229,0.1) 0%, transparent 50%)",
                "radial-gradient(circle at center, rgba(79,70,229,0.2) 0%, transparent 70%)",
                "radial-gradient(circle at center, rgba(79,70,229,0.1) 0%, transparent 50%)"
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      )
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: "Get Feedback",
      description: "Receive immediate, detailed feedback on your approach, structuring, and analytical skills with actionable insights.",
      color: "bg-gradient-to-r from-amber-400 to-orange-500",
      visual: (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-28 h-28 bg-white rounded-lg shadow-md border border-gray-200 p-3">
            <div className="h-3 w-12 bg-amber-500 rounded-full mb-3"></div>
            <div className="h-2 w-full bg-gray-100 rounded mb-2"></div>
            <div className="h-2 w-full bg-gray-100 rounded mb-2"></div>
            <div className="h-2 w-3/4 bg-gray-100 rounded mb-3"></div>
            <div className="flex justify-between">
              <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13L9 17L19 7" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="h-6 w-10 bg-amber-100 rounded-full"></div>
            </div>
          </div>
          <motion.div 
            className="absolute top-1 right-3"
            animate={{
              y: [0, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="text-amber-500 text-xl font-bold">+10</div>
          </motion.div>
        </div>
      )
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
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative z-10 overflow-hidden hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                borderColor: "rgba(132, 255, 1, 0.5)"
              }}
            >
              <div className="h-32 mb-8 relative">
                {step.visual}
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6 mx-auto" style={{ background: step.color }}>
                {step.icon}
              </div>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-700">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">{step.title}</h3>
              <p className="text-gray-600 text-center">{step.description}</p>
              <motion.div 
                className="absolute bottom-0 right-0 w-40 h-40 rounded-full"
                initial={{ opacity: 0.05 }}
                whileHover={{ opacity: 0.1, scale: 1.2 }}
                style={{ 
                  background: step.color,
                  translateX: '40%', 
                  translateY: '40%'
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
      
      <motion.div 
        className="mt-16 text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
        whileHover={{ 
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)"
        }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-green via-blue-500 to-amber-500"></div>
        <p className="text-brand-green font-medium">Ready to elevate your case interview skills?</p>
        <h3 className="text-2xl font-bold mt-2 mb-6">Join our waitlist today and be among the first to experience CaseAI</h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
          <div className="flex-1 w-full">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
            />
          </div>
          <button className="px-6 py-2 bg-brand-green text-gray-900 font-medium rounded-lg hover:bg-opacity-90 transition-all">
            Join Waitlist
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Be the first to know when we launch. Limited spots available.
        </div>
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-brand-green opacity-5 rounded-full"></div>
      </motion.div>
    </section>
  );
}
