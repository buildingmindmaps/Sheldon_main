
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Circle, SquareStack, Sparkles, Brain, Rocket, Users, Target, Lightbulb, Trophy, Zap } from "lucide-react";
import { WaitlistForm } from "@/components/WaitlistForm";

// The journey sentences that will be displayed with animations
const journeySentences = [
  "It starts with a small itch—the moment you sense <strong>classroom answers</strong> can't handle tomorrow's <strong className='text-[hsl(var(--brand-green))]'>questions</strong>.",
  "That itch becomes a <strong className='text-[hsl(var(--brand-green))]'>drive</strong>, pushing you to pull problems apart the way <strong className='text-[hsl(var(--brand-green))]'>Musk</strong> takes a rocket down to its bolts.",
  "Drive turns into a <strong className='text-[hsl(var(--brand-green))]'>daily habit</strong>; each morning you sharpen questions like <strong className='text-[hsl(var(--brand-green))]'>Jobs</strong> polishing every product reveal.",
  "Habit sparks fresh <strong className='text-[hsl(var(--brand-green))]'>ideas</strong>, and you map the future the way <strong className='text-[hsl(var(--brand-green))]'>APJ Abdul Kalam</strong> sketched his rockets—big, clear, and bold.",
  "Ideas draw <strong className='text-[hsl(var(--brand-green))]'>rivals</strong>; soon you're testing yourself against the best, not to show off but to see how far you can really go.",
  "<strong className='text-[hsl(var(--brand-green))]'>Rivalry</strong> shapes your skills; your mind becomes a workshop, your will the head builder, and laziness gets no entry pass.",
  "Skill hardens into <strong className='text-[hsl(var(--brand-green))]'>purpose</strong>; grades blur, titles fade, yet the thrill of cracking problems no textbook dares to ask burns brighter.",
  "Purpose finds its <strong className='text-[hsl(var(--brand-green))]'>crew</strong> right here—thinkers who hate easy answers and builders who turn bright thoughts into real change.",
  "Step into this training ground where raw curiosity turns into real power—<strong className='text-[hsl(var(--brand-green))]'>train with us</strong>, master the mental models, and start claiming your edge."
];

// Icons to represent each step in the journey
const journeyIcons = [
  Circle,
  Rocket,
  Sparkles,
  Lightbulb,
  Users,
  Brain,
  Target,
  SquareStack,
  Zap
];

export function JourneySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Handle auto-cycling through the sentences
  useEffect(() => {
    if (isAutoPlay) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          // Loop back to the beginning when reaching the end
          return (prev + 1) % journeySentences.length;
        });
      }, 3000); // 3 seconds as requested
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex, isAutoPlay]);

  // Handle manual navigation
  const handlePrevious = () => {
    setIsAutoPlay(false);
    setCurrentIndex(prev => (prev - 1 + journeySentences.length) % journeySentences.length);
  };

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex(prev => (prev + 1) % journeySentences.length);
  };

  // Toggle auto-play
  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  // Animation variants for text
  const containerVariants = {
    hidden: { 
      y: -20,
      opacity: 0,
      filter: "blur(8px)"
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      y: 20,
      opacity: 0,
      filter: "blur(8px)",
      transition: { 
        duration: 0.4, 
        ease: "easeIn"
      }
    },
  };

  // Animation variants for icons
  const iconVariants = {
    hidden: { 
      scale: 0.5,
      opacity: 0,
      rotate: -45
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.2
      }
    },
    exit: { 
      scale: 0.5,
      opacity: 0,
      rotate: 45,
      transition: { 
        duration: 0.3, 
        ease: "easeIn"
      }
    },
  };

  // Get current icon component
  const CurrentIcon = journeyIcons[currentIndex];

  return (
    <section ref={sectionRef} className="relative min-h-screen py-24">      
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl mx-auto flex flex-col">
          {/* Title with refined styling */}
          <div className="text-center py-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">The Evolution</h2>
          </div>
          
          {/* Main content area with transparent background */}
          <div className="flex-1 flex items-center justify-center px-4 mb-16">
            <div className="w-full max-w-3xl mx-auto relative">
              <div className="p-10 rounded-3xl">
                <AnimatePresence mode="wait">
                  {currentIndex === journeySentences.length - 1 ? (
                    // Final sentence with waitlist form
                    <div className="space-y-8">
                      <div className="flex justify-center mb-6">
                        <motion.div
                          className="text-[hsl(var(--brand-green))] flex items-center justify-center h-16 w-16"
                          variants={iconVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <CurrentIcon size={48} strokeWidth={1.5} />
                        </motion.div>
                      </div>
                      
                      <motion.p 
                        className="text-xl md:text-2xl text-gray-800 leading-relaxed text-center"
                        dangerouslySetInnerHTML={{ __html: journeySentences[currentIndex] }}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                      >
                        <WaitlistForm />
                      </motion.div>
                    </div>
                  ) : (
                    // Regular sentence display with enhanced animations and icon
                    <div className="space-y-8">
                      <div className="flex justify-center mb-6">
                        <motion.div
                          className="text-[hsl(var(--brand-green))] flex items-center justify-center h-16 w-16"
                          variants={iconVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          key={`icon-${currentIndex}`}
                        >
                          <CurrentIcon size={48} strokeWidth={1.5} />
                        </motion.div>
                      </div>
                      
                      <motion.p 
                        className="text-xl md:text-2xl text-gray-800 leading-relaxed text-center"
                        dangerouslySetInnerHTML={{ __html: journeySentences[currentIndex] }}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        key={`text-${currentIndex}`}
                      />
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          {/* Navigation and toggle control - fixed position at bottom */}
          <div className="py-8 flex flex-col items-center gap-4 relative">
            <div className="flex items-center gap-6 mb-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-5 w-5 text-gray-800" />
              </Button>
              
              <div className="flex gap-2">
                {journeySentences.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                      currentIndex === i 
                        ? 'bg-brand-green scale-125 shadow-[0_0_15px_rgba(132,255,1,0.6)]' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    onClick={() => {
                      setIsAutoPlay(false);
                      setCurrentIndex(i);
                    }}
                  />
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full"
                onClick={handleNext}
              >
                <ChevronRight className="h-5 w-5 text-gray-800" />
              </Button>
            </div>
            
            {/* Auto-play toggle button */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAutoPlay}
              className={`mt-0 px-4 py-1 text-sm transition-all duration-300 rounded-full 
                ${isAutoPlay 
                  ? 'bg-brand-green/20 text-gray-800 border-brand-green/50 hover:bg-brand-green/30' 
                  : 'bg-transparent text-gray-600 hover:bg-white/40 border-white/40'
                }`}
            >
              {isAutoPlay ? "Pause" : "Auto-Play"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
