
import React, { useState, useEffect } from 'react';
import { BookText, BarChart3, Users, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export function InteractiveFeatures() {
  const [activeFeature, setActiveFeature] = useState<string>("case-gym");
  
  const features: Feature[] = [
    {
      id: "case-gym",
      title: "Case Gym Reps",
      description: "Practice with written & video cases across industries, with timer, instant scoring, and highlighted insights.",
      icon: <BookText className="w-6 h-6" />,
      color: "from-green-400 to-emerald-500"
    },
    {
      id: "adaptive",
      title: "Adaptive Difficulty",
      description: "Our MECE Engine ramps complexity as you improve, preventing plateaus and keeping stretch consistent.",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "from-blue-400 to-cyan-500"
    },
    {
      id: "battles",
      title: "Live 1-v-1 Battles",
      description: "Schedule head-to-head matches vs. peers with real-time scoring, public leaderboard, and post-match debrief.",
      icon: <Users className="w-6 h-6" />,
      color: "from-purple-400 to-indigo-500"
    },
    {
      id: "playbooks",
      title: "Icon Playbooks",
      description: "Weekly 'Think Like Elon/Jobs/Nadella' cases with step-by-step solution walkthroughs & mental-model breakdowns.",
      icon: <Briefcase className="w-6 h-6" />,
      color: "from-amber-400 to-orange-500"
    }
  ];

  // Auto-rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = features.findIndex(feature => feature.id === activeFeature);
      const nextIndex = (currentIndex + 1) % features.length;
      setActiveFeature(features[nextIndex].id);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [activeFeature, features]);

  return (
    <div className="relative">
      {/* Interactive Background Element */}
      <div className="absolute inset-0 bg-gray-50 rounded-3xl -z-10 overflow-hidden">
        <div className="absolute w-64 h-64 bg-gradient-to-r from-green-200 to-brand-green opacity-20 rounded-full -top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-64 h-64 bg-gradient-to-r from-blue-200 to-blue-400 opacity-20 rounded-full -bottom-20 -right-20 animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>
      
      {/* Feature Visualization Preview - Moved to the top */}
      <motion.div 
        className="mb-12 h-80 border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative h-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {activeFeature === "case-gym" && (
              <motion.div 
                key="case-gym"
                className="flex flex-col md:flex-row items-center justify-center w-full h-full p-4 gap-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex-1 h-full flex flex-col justify-center">
                  <div className="text-lg font-bold mb-4 text-center text-gray-800">Case Progress Tracker</div>
                  <div className="w-full h-4 bg-gray-200 rounded-full mb-2">
                    <div className="h-4 bg-gradient-to-r from-green-400 to-brand-green rounded-full" style={{ width: '70%' }}>
                      <div className="h-full w-full bg-white/20 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-full flex justify-between text-sm text-gray-500">
                    <span>00:00</span>
                    <span className="font-medium">7:30 elapsed</span>
                    <span>15:00</span>
                  </div>
                </div>
                <div className="flex-1 h-full flex flex-col items-center justify-center">
                  <div className="text-lg font-bold mb-2 text-center text-gray-800">Live Analysis</div>
                  <div className="border border-gray-200 rounded-lg p-4 w-full bg-gray-50 shadow-inner">
                    <div className="flex gap-3 items-center mb-3">
                      <div className="h-10 w-10 bg-brand-green rounded-full flex items-center justify-center text-white">
                        <BookText className="w-5 h-5" />
                      </div>
                      <div className="font-medium">Market sizing analysis</div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded-full w-5/6 mb-4"></div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-20 bg-green-100 text-green-700 rounded-full text-xs flex items-center justify-center font-medium">Structured</div>
                      <div className="h-6 w-16 bg-amber-100 text-amber-700 rounded-full text-xs flex items-center justify-center font-medium">MECE</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeFeature === "adaptive" && (
              <motion.div 
                key="adaptive"
                className="w-full h-full flex flex-col items-center justify-center p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-lg font-bold mb-4 text-center text-gray-800">Your Problem-Solving Growth</div>
                <div className="relative w-full h-48">
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#84ff01" />
                        <stop offset="100%" stopColor="#94ff33" />
                      </linearGradient>
                    </defs>
                    <path d="M 40 160 L 80 120 L 120 140 L 160 100 L 200 80 L 240 60 L 280 40 L 320 20 L 360 40" 
                          stroke="url(#gradient)" strokeWidth="4" fill="none" />
                    <path d="M 40 160 L 80 150 L 120 155 L 160 140 L 200 130 L 240 120 L 280 110 L 320 100 L 360 95" 
                          stroke="#999" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                    <circle cx="200" cy="80" r="8" fill="#84ff01">
                      <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <text x="210" y="75" fontSize="14" fill="#333" fontWeight="bold">You are here</text>
                    <text x="40" y="180" fontSize="12" fill="#666">Beginner</text>
                    <text x="320" y="180" fontSize="12" fill="#666">Expert</text>
                    <text x="100" y="40" fontSize="12" fill="#666">Industry Average</text>
                    <text x="250" y="20" fontSize="12" fill="#666">Your trajectory</text>
                  </svg>
                </div>
                <div className="mt-2 flex justify-between w-full px-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-green">87%</div>
                    <div className="text-sm text-gray-600">Growth rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">12</div>
                    <div className="text-sm text-gray-600">Cases solved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-500">4.5x</div>
                    <div className="text-sm text-gray-600">Improvement</div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeFeature === "battles" && (
              <motion.div 
                key="battles"
                className="w-full h-full flex flex-col items-center justify-center p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-lg font-bold mb-6 text-center text-gray-800">Live Case Battle Simulation</div>
                <div className="flex w-full justify-between items-center">
                  <motion.div 
                    className="text-center"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl">YOU</div>
                    <div className="text-xl font-bold">85 pts</div>
                    <div className="text-sm text-gray-500 font-medium">Problem framing</div>
                    <div className="mt-2 w-32 h-3 bg-gray-200 rounded-full">
                      <div className="h-full w-4/5 bg-blue-500 rounded-full"></div>
                    </div>
                  </motion.div>
                  
                  <div className="py-3 px-6 bg-gray-100 rounded-full font-bold text-xl text-gray-800 border-2 border-dashed border-gray-300">VS</div>
                  
                  <motion.div 
                    className="text-center"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl">PEER</div>
                    <div className="text-xl font-bold">78 pts</div>
                    <div className="text-sm text-gray-500 font-medium">Solution quality</div>
                    <div className="mt-2 w-32 h-3 bg-gray-200 rounded-full">
                      <div className="h-full w-3/4 bg-orange-500 rounded-full"></div>
                    </div>
                  </motion.div>
                </div>
                <div className="mt-8 w-full px-8">
                  <div className="text-sm font-medium text-center mb-2">Time Remaining</div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                      initial={{ width: "80%" }}
                      animate={{ width: "30%" }}
                      transition={{ duration: 15, repeat: Infinity }}
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeFeature === "playbooks" && (
              <motion.div 
                key="playbooks"
                className="w-full h-full flex flex-col items-center justify-center p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-lg font-bold mb-4 text-center text-gray-800">Business Icons Thought Process</div>
                <div className="grid grid-cols-3 gap-6 w-full max-w-2xl">
                  <motion.div 
                    className="aspect-square bg-gradient-to-b from-amber-50 to-amber-100 rounded-xl flex flex-col items-center justify-center p-4 relative overflow-hidden border border-amber-200 shadow-sm"
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 mb-3 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 4V20M6 4V20M3 8H7M17 8H21M3 12H21M3 16H7M17 16H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="text-base font-bold text-gray-900">Elon Musk</div>
                    <div className="text-xs text-gray-600 mt-1">First Principles</div>
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-amber-300 opacity-10 rounded-full -mr-10 -mb-10"></div>
                  </motion.div>
                  <motion.div 
                    className="aspect-square bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl flex flex-col items-center justify-center p-4 relative overflow-hidden border border-gray-200 shadow-sm"
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 mb-3 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M12 3L4 7V17L12 21L20 17V7L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="text-base font-bold text-gray-900">Steve Jobs</div>
                    <div className="text-xs text-gray-600 mt-1">Customer Experience</div>
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-gray-300 opacity-10 rounded-full -mr-10 -mb-10"></div>
                  </motion.div>
                  <motion.div 
                    className="aspect-square bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl flex flex-col items-center justify-center p-4 relative overflow-hidden border border-blue-200 shadow-sm"
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 mb-3 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 5L18 2M18 2L21 5M18 2V8M12 12L9.17 14.83M9.17 14.83L6 18M9.17 14.83H14.83M14.83 14.83L18 18M14.83 14.83L12 12M6 6L9 9M9 9L12 12M3 3L6 6M6 18H12M12 18L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="text-base font-bold text-gray-900">Satya Nadella</div>
                    <div className="text-xs text-gray-600 mt-1">Growth Mindset</div>
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-300 opacity-10 rounded-full -mr-10 -mb-10"></div>
                  </motion.div>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-sm text-brand-green font-medium">New icon playbooks added weekly</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {features.map((feature) => (
              <button
                key={feature.id}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  activeFeature === feature.id ? "w-8 bg-brand-green" : "bg-gray-300"
                )}
                onClick={() => setActiveFeature(feature.id)}
              />
            ))}
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            className={cn(
              "relative p-6 rounded-xl border bg-white shadow-sm transition-all duration-300",
              "hover:shadow-lg hover:scale-105 cursor-pointer",
              activeFeature === feature.id ? "ring-2 ring-offset-2 ring-brand-green" : "border-gray-100"
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: features.indexOf(feature) * 0.1 }}
            onClick={() => setActiveFeature(feature.id)}
          >
            <div className={cn(
              "mb-4 p-3 rounded-lg bg-gradient-to-r w-fit",
              feature.color,
              "transition-all duration-300",
              activeFeature === feature.id ? "scale-110" : ""
            )}>
              <div className="text-white">
                {feature.icon}
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
            
            {/* Feature-specific interactive element that appears on hover */}
            <motion.div 
              className={cn(
                "absolute -bottom-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center text-white",
                "bg-gradient-to-r",
                feature.id === "case-gym" ? "from-green-400 to-emerald-500" :
                feature.id === "adaptive" ? "from-blue-400 to-cyan-500" :
                feature.id === "battles" ? "from-purple-400 to-indigo-500" :
                "from-amber-400 to-orange-500"
              )}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: activeFeature === feature.id ? 1 : 0, 
                opacity: activeFeature === feature.id ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
