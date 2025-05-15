
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WaitlistForm } from "@/components/WaitlistForm";

// The journey sentences that will be displayed with animations
const journeySentences = [
  "It starts with a small itch—the moment you sense <strong>classroom answers</strong> can't handle tomorrow's questions.",
  "That itch becomes a <strong className='text-[hsl(var(--brand-green))]'>drive</strong>, pushing you to pull problems apart the way <strong className='text-[hsl(var(--brand-green))]'>Musk</strong> takes a rocket down to its bolts.",
  "Drive turns into a <strong className='text-[hsl(var(--brand-green))]'>daily habit</strong>; each morning you sharpen questions like <strong className='text-[hsl(var(--brand-green))]'>Jobs</strong> polishing every product reveal.",
  "Habit sparks fresh <strong className='text-[hsl(var(--brand-green))]'>ideas</strong>, and you map the future the way <strong className='text-[hsl(var(--brand-green))]'>APJ Abdul Kalam</strong> sketched his rockets—big, clear, and bold.",
  "Ideas draw <strong className='text-[hsl(var(--brand-green))]'>rivals</strong>; soon you're testing yourself against the best, not to show off but to see how far you can really go.",
  "<strong className='text-[hsl(var(--brand-green))]'>Rivalry</strong> shapes your skills; your mind becomes a workshop, your will the head builder, and laziness gets no entry pass.",
  "Skill hardens into <strong className='text-[hsl(var(--brand-green))]'>purpose</strong>; grades blur, titles fade, yet the thrill of cracking problems no textbook dares to ask burns brighter.",
  "Purpose finds its <strong className='text-[hsl(var(--brand-green))]'>crew</strong> right here—thinkers who hate easy answers and builders who turn bright thoughts into real change.",
  "Step into this training ground where raw curiosity turns into real power—<strong className='text-[hsl(var(--brand-green))]'>train with us</strong>, master the mental models, and start claiming your edge."
];

export function JourneySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle auto-cycling through the sentences
  useEffect(() => {
    if (isAutoPlay && currentIndex < journeySentences.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          // Stop at the last sentence
          if (prev === journeySentences.length - 1) {
            clearInterval(intervalRef.current!);
            setIsAutoPlay(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000); // Changed to 3 seconds as requested
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
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    setIsAutoPlay(false);
    if (currentIndex < journeySentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
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

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Main background - subtle gradient */}
      <div className="absolute inset-0 -z-40 bg-gradient-to-br from-white via-brand-gray to-white" />
      
      {/* Animated gradient overlay */}
      <motion.div 
        className="absolute inset-0 -z-30"
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'] 
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        style={{
          background: 'linear-gradient(135deg, rgba(132, 255, 1, 0.2) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(132, 255, 1, 0.2) 100%)',
          backgroundSize: '400% 400%'
        }}
      />
      
      {/* Enhanced true glassmorphism effect */}
      <div className="absolute inset-0 -z-20 backdrop-blur-2xl bg-white/20 border-y border-white/40 shadow-[0_10px_50px_rgba(0,0,0,0.15)]"></div>
      
      <div className="relative z-10 h-screen w-full flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl mx-auto h-full flex flex-col">
          {/* Title with refined styling */}
          <div className="text-center py-12 mt-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 drop-shadow-sm">The Evolution</h2>
          </div>
          
          {/* Main content area with glass card */}
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="w-full max-w-3xl mx-auto relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  className="p-10 rounded-3xl backdrop-blur-xl bg-white/40 border border-white/70 shadow-[0_15px_35px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-300"
                >
                  {currentIndex === journeySentences.length - 1 ? (
                    // Final sentence with waitlist form
                    <div className="space-y-8">
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
                    // Regular sentence display with enhanced animations
                    <motion.p 
                      className="text-xl md:text-2xl text-gray-800 leading-relaxed text-center"
                      dangerouslySetInnerHTML={{ __html: journeySentences[currentIndex] }}
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          {/* Navigation and toggle control */}
          <div className="py-12 flex flex-col items-center gap-4">
            <div className="flex items-center gap-6">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full backdrop-blur-xl bg-white/50 hover:bg-white/70 border border-white/60 shadow-md"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
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
                className="rounded-full backdrop-blur-xl bg-white/50 hover:bg-white/70 border border-white/60 shadow-md"
                onClick={handleNext}
                disabled={currentIndex === journeySentences.length - 1}
              >
                <ChevronRight className="h-5 w-5 text-gray-800" />
              </Button>
            </div>
            
            {/* Auto-play toggle button */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAutoPlay}
              className={`mt-2 px-4 py-1 text-sm transition-all duration-300 rounded-full 
                ${isAutoPlay 
                  ? 'bg-brand-green/20 text-gray-800 border-brand-green/50 hover:bg-brand-green/30' 
                  : 'bg-white/40 text-gray-600 hover:bg-white/60'
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
