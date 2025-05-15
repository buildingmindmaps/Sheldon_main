
import React, { useState, useEffect } from 'react';
import { BookText, BarChart3, Users, Briefcase, Timer, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

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
                <div className="text-lg font-bold mb-4 text-center text-gray-800">Your Problem-Solving Skills</div>
                
                {/* Simplified Standard Deviation Bell Curve */}
                <div className="relative w-full max-w-md h-32 mb-4">
                  {/* Bell Curve Path */}
                  <svg className="w-full h-full" viewBox="0 0 400 100">
                    {/* Background Line */}
                    <path 
                      d="M 50,80 C 50,80 100,80 150,80 C 200,80 250,80 300,80 C 350,80 350,80 350,80" 
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      fill="none"
                    />
                    
                    {/* Bell Curve Path */}
                    <path 
                      d="M 50,80 C 50,80 100,75 150,60 C 200,40 250,60 300,75 C 350,80 350,80 350,80" 
                      stroke="#e5e7eb"
                      strokeWidth="2"
                      fill="none"
                    />
                    
                    {/* Filled area under the curve */}
                    <path 
                      d="M 50,80 C 50,80 100,75 150,60 C 200,40 250,60 300,75 C 350,80 350,80 350,80 L 350,80 L 50,80 Z" 
                      fill="url(#bellGradient)"
                      opacity="0.2"
                    />

                    <defs>
                      <linearGradient id="bellGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#e0e7ff" />
                        <stop offset="86%" stopColor="#84ff01" stopOpacity="1" />
                        <stop offset="100%" stopColor="#84ff01" stopOpacity="0.5" />
                      </linearGradient>
                    </defs>
                    
                    {/* The marker point position (86% position) */}
                    <line
                      x1="300"
                      y1="30"
                      x2="300"
                      y2="80"
                      stroke="#84ff01"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                    />
                    
                    {/* You are here marker */}
                    <circle cx="300" cy="75" r="6" fill="#84ff01">
                      <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
                    </circle>
                    
                    {/* Labels for skill levels */}
                    <text x="50" y="95" fontSize="12" fill="#6b7280">Beginner</text>
                    <text x="200" y="95" fontSize="12" fill="#6b7280" textAnchor="middle">Average</text>
                    <text x="350" y="95" fontSize="12" fill="#6b7280" textAnchor="end">Expert</text>
                  </svg>
                </div>
                
                {/* Performance Stats Card */}
                <div className="w-full max-w-md bg-white rounded-xl p-5 border border-gray-200">
                  <div className="text-center text-lg font-bold text-gray-800 mb-1">
                    You're better than <span className="text-brand-green">86%</span> of peers
                  </div>
                  <p className="text-center text-sm text-gray-600 mb-4">
                    Your structured approach and analytical skills put you in the top performers bracket
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-brand-green">12</div>
                      <div className="text-xs text-gray-500">Cases solved</div>
                    </div>
                    
                    <div className="h-10 border-l border-gray-200"></div>
                    
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-500">4.5x</div>
                      <div className="text-xs text-gray-500">Improvement</div>
                    </div>
                    
                    <div className="h-10 border-l border-gray-200"></div>
                    
                    <div className="text-center">
                      <div className="text-xl font-bold text-amber-500">89%</div>
                      <div className="text-xs text-gray-500">Accuracy</div>
                    </div>
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
                <div className="text-lg font-bold mb-4 text-center text-gray-800">Live Case Battle</div>
                <div className="flex w-full justify-between items-center mb-6">
                  {/* Left Player */}
                  <div className="flex flex-col items-center">
                    <Avatar className="h-16 w-16 border-2 border-purple-200">
                      <AvatarImage src="/lovable-uploads/6c539c76-8de0-4c4c-95c4-7af17365ad69.png" alt="Alex" />
                      <AvatarFallback className="bg-purple-100 text-purple-800 font-semibold">A</AvatarFallback>
                    </Avatar>
                    <div className="font-medium mt-2">Alex</div>
                    <div className="text-xs text-gray-500">Harvard MBA</div>
                    <div className="mt-3 text-xl font-bold text-purple-500">78</div>
                  </div>
                  
                  {/* VS Badge */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="py-2 px-5 bg-gray-100 rounded-full font-bold text-gray-700">VS</div>
                    <div className="text-xs text-gray-500 font-medium">Live Match</div>
                  </div>
                  
                  {/* Right Player */}
                  <div className="flex flex-col items-center">
                    <Avatar className="h-16 w-16 border-2 border-cyan-200">
                      <AvatarImage src="/lovable-uploads/7f7ec580-d4a1-45d6-9221-b2785493fd3b.png" alt="Jamie" />
                      <AvatarFallback className="bg-cyan-100 text-cyan-800 font-semibold">J</AvatarFallback>
                    </Avatar>
                    <div className="font-medium mt-2">Jamie</div>
                    <div className="text-xs text-gray-500">Wharton MBA</div>
                    <div className="mt-3 text-xl font-bold text-cyan-500">72</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full space-y-3">
                  {/* Time Remaining */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Timer className="h-4 w-4" />
                      <span>Time Remaining</span>
                    </div>
                    <div className="font-medium">02:45</div>
                  </div>
                  
                  <Progress value={30} className="h-1.5 bg-gray-100" 
                    style={{ 
                      background: 'linear-gradient(to right, #e9d5ff, #ddd6fe, #c7d2fe, #bfdbfe)',
                    }} 
                  />
                  
                  {/* Challenge Container */}
                  <div className="mt-4 border border-gray-200 rounded-xl p-3 bg-white">
                    <div className="text-sm font-medium mb-1 flex items-center gap-1">
                      <Award className="h-4 w-4 text-brand-green" />
                      Current Challenge:
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-2">
                      How should Tesla approach the Indian electric vehicle market?
                    </p>
                    <div className="flex justify-between">
                      <div className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                        Strategy
                      </div>
                      <div className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-medium">
                        Market Entry
                      </div>
                    </div>
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
