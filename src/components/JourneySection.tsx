
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
      }, 5000); // Change sentence every 5 seconds
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

  // Random moving gradients for the background
  const gradientVariants = {
    animate: {
      backgroundPosition: ['0% 0%', '100% 100%'],
      transition: {
        duration: 15,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Glass background with animated gradient */}
      <motion.div
        className="absolute inset-0 -z-10"
        variants={gradientVariants}
        animate="animate"
        style={{
          background: 'linear-gradient(135deg, rgba(132, 255, 1, 0.05) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(132, 255, 1, 0.05) 100%)',
          backgroundSize: '400% 400%',
          filter: 'blur(40px)'
        }}
      />
      
      <div className="backdrop-blur-lg bg-white/20 h-screen w-full flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-5xl mx-auto h-full flex flex-col">
          {/* Heading */}
          <div className="text-center py-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800">The Journey</h2>
          </div>
          
          {/* Main content area */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-3xl mx-auto relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20, rotateX: 45 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -20, rotateX: -45 }}
                  transition={{ duration: 0.7 }}
                  className="p-8 backdrop-blur-sm bg-white/30 border border-white/30 rounded-2xl shadow-xl"
                >
                  {currentIndex === journeySentences.length - 1 ? (
                    // Final sentence with waitlist form
                    <div className="space-y-6">
                      <motion.p 
                        className="text-xl md:text-2xl text-gray-800 leading-relaxed text-center"
                        dangerouslySetInnerHTML={{ __html: journeySentences[currentIndex] }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                      >
                        <WaitlistForm />
                      </motion.div>
                    </div>
                  ) : (
                    // Regular sentence display with animations
                    <motion.p 
                      className="text-xl md:text-2xl text-gray-800 leading-relaxed text-center"
                      dangerouslySetInnerHTML={{ __html: journeySentences[currentIndex] }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="py-12 flex justify-center items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full backdrop-blur-md bg-white/30 hover:bg-white/50 border border-white/30"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-5 w-5 text-gray-800" />
            </Button>
            
            <div className="flex gap-1">
              {journeySentences.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full ${currentIndex === i ? 'bg-brand-green' : 'bg-gray-300'}`}
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
              className="rounded-full backdrop-blur-md bg-white/30 hover:bg-white/50 border border-white/30"
              onClick={handleNext}
              disabled={currentIndex === journeySentences.length - 1}
            >
              <ChevronRight className="h-5 w-5 text-gray-800" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
