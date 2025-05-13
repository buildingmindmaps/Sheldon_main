
import React, { useState } from 'react';
import { BookText, BarChart3, Users, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export function InteractiveFeatures() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  
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

  return (
    <div className="relative">
      {/* Interactive Background Element */}
      <div className="absolute inset-0 bg-gray-50 rounded-3xl -z-10 overflow-hidden">
        <div className="absolute w-64 h-64 bg-gradient-to-r from-green-200 to-brand-green opacity-20 rounded-full -top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-64 h-64 bg-gradient-to-r from-blue-200 to-blue-400 opacity-20 rounded-full -bottom-20 -right-20 animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
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
            onMouseEnter={() => setActiveFeature(feature.id)}
            onMouseLeave={() => setActiveFeature(null)}
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
            {activeFeature === feature.id && (
              <motion.div 
                className="absolute -bottom-2 -right-2 w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-white"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Feature Visualization Preview */}
      <motion.div 
        className="mt-12 h-64 border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="relative h-full flex items-center justify-center">
          {!activeFeature && (
            <div className="text-center px-4">
              <p className="text-gray-500 text-lg font-medium">Hover over a feature to see it in action</p>
              <p className="text-gray-400 text-sm mt-2">Interactive visualization will appear here</p>
            </div>
          )}
          
          {activeFeature === "case-gym" && (
            <div className="flex flex-col md:flex-row items-center justify-center w-full h-full p-4 gap-4">
              <div className="flex-1 h-full flex flex-col justify-center">
                <div className="w-full h-4 bg-gray-200 rounded-full mb-2">
                  <div className="h-4 bg-green-500 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <div className="w-full flex justify-between text-sm text-gray-500">
                  <span>00:00</span>
                  <span>15:00</span>
                </div>
              </div>
              <div className="flex-1 h-full flex items-center">
                <div className="border border-gray-200 rounded-lg p-3 w-full">
                  <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded-full w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
                  <div className="mt-4 flex space-x-2">
                    <div className="h-8 w-8 bg-brand-green rounded-full"></div>
                    <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeFeature === "adaptive" && (
            <div className="w-full h-full flex items-center justify-center p-4">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                <path d="M 40 160 L 80 120 L 120 140 L 160 100 L 200 80 L 240 60 L 280 40 L 320 20 L 360 40" 
                      stroke="rgb(132, 255, 1)" strokeWidth="3" fill="none" />
                <path d="M 40 160 L 80 150 L 120 155 L 160 140 L 200 130 L 240 120 L 280 110 L 320 100 L 360 95" 
                      stroke="#999" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                <circle cx="200" cy="80" r="6" fill="rgb(132, 255, 1)" />
                <text x="210" y="75" fontSize="12" fill="#333">Your progress</text>
              </svg>
            </div>
          )}
          
          {activeFeature === "battles" && (
            <div className="w-full h-full flex items-center justify-center p-4">
              <div className="flex w-full justify-between items-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">YOU</div>
                  <div className="text-sm font-medium">85 pts</div>
                </div>
                
                <div className="text-xl font-bold text-gray-500">VS</div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">PEER</div>
                  <div className="text-sm font-medium">78 pts</div>
                </div>
              </div>
            </div>
          )}
          
          {activeFeature === "playbooks" && (
            <div className="w-full h-full flex items-center justify-center p-4">
              <div className="grid grid-cols-3 gap-3 w-full">
                <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center p-2">
                  <div className="w-12 h-12 rounded-full bg-amber-400 mb-2"></div>
                  <div className="text-xs font-medium">Elon Musk</div>
                </div>
                <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center p-2">
                  <div className="w-12 h-12 rounded-full bg-gray-800 mb-2"></div>
                  <div className="text-xs font-medium">Steve Jobs</div>
                </div>
                <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center p-2">
                  <div className="w-12 h-12 rounded-full bg-blue-500 mb-2"></div>
                  <div className="text-xs font-medium">Satya Nadella</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
