import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Circle, SquareStack, Sparkles, Brain, Rocket, Users, Target, Lightbulb, Trophy, Zap } from "lucide-react";
import { WaitlistForm } from "@/components/WaitlistForm";

// The journey sentences that will be displayed with animations
const journeySentences = ["It starts with a small itch—the moment you sense <strong>classroom answers</strong> can't handle tomorrow's <strong className='text-[hsl(var(--brand-green))]'>questions</strong>.", "That itch becomes a <strong className='text-[hsl(var(--brand-green))]'>drive</strong>, pushing you to pull problems apart the way <strong className='text-[hsl(var(--brand-green))]'>Musk</strong> takes a rocket down to its bolts.", "Drive turns into a <strong className='text-[hsl(var(--brand-green))]'>daily habit</strong>; each morning you sharpen questions like <strong className='text-[hsl(var(--brand-green))]'>Jobs</strong> polishing every product reveal.", "Habit sparks fresh <strong className='text-[hsl(var(--brand-green))]'>ideas</strong>, and you map the future the way <strong className='text-[hsl(var(--brand-green))]'>APJ Abdul Kalam</strong> sketched his rockets—big, clear, and bold.", "Ideas draw <strong className='text-[hsl(var(--brand-green))]'>rivals</strong>; soon you're testing yourself against the best, not to show off but to see how far you can really go.", "<strong className='text-[hsl(var(--brand-green))]'>Rivalry</strong> shapes your skills; your mind becomes a workshop, your will the head builder, and laziness gets no entry pass.", "Skill hardens into <strong className='text-[hsl(var(--brand-green))]'>purpose</strong>; grades blur, titles fade, yet the thrill of cracking problems no textbook dares to ask burns brighter.", "Purpose finds its <strong className='text-[hsl(var(--brand-green))]'>crew</strong> right here—thinkers who hate easy answers and builders who turn bright thoughts into real change.", "Step into this training ground where raw curiosity turns into real power—<strong className='text-[hsl(var(--brand-green))]'>train with us</strong>, master the mental models, and start claiming your edge."];

// Icons to represent each step in the journey
const journeyIcons = [Circle, Rocket, Sparkles, Lightbulb, Users, Brain, Target, SquareStack, Zap];

// Interactive elements for each sentence
const interactiveElements = [
// 1. Questions & Answers (Circle)
{
  elements: Array(5).fill(0).map((_, i) => ({
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    size: 6 + Math.random() * 10,
    delay: i * 0.1,
    color: i % 2 === 0 ? "rgba(132, 255, 1, 0.5)" : "rgba(255, 255, 255, 0.3)"
  }))
},
// 2. Drive & Rockets (Rocket)
{
  elements: Array(10).fill(0).map((_, i) => ({
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    size: 2 + Math.random() * 4,
    delay: i * 0.1,
    color: "rgba(255, 255, 255, 0.4)"
  }))
},
// 3. Daily Habit (Sparkles)
{
  elements: Array(6).fill(0).map((_, i) => ({
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    size: 12 + Math.random() * 14,
    delay: i * 0.15,
    color: i % 3 === 0 ? "rgba(132, 255, 1, 0.4)" : "rgba(255, 255, 255, 0.2)"
  }))
},
// 4. Ideas & Future (Lightbulb)
{
  elements: Array(4).fill(0).map((_, i) => ({
    x: Math.random() * 80 - 40,
    y: Math.random() * 80 - 40,
    size: 15 + Math.random() * 20,
    delay: i * 0.2,
    color: i % 2 === 0 ? "rgba(132, 255, 1, 0.3)" : "rgba(255, 255, 255, 0.2)"
  }))
},
// 5. Rivals & Competition (Users)
{
  elements: Array(8).fill(0).map((_, i) => ({
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    size: 8 + Math.random() * 12,
    delay: i * 0.1,
    color: i % 3 === 0 ? "rgba(132, 255, 1, 0.35)" : "rgba(255, 255, 255, 0.25)"
  }))
},
// 6. Workshop & Skills (Brain)
{
  elements: Array(12).fill(0).map((_, i) => ({
    x: Math.random() * 120 - 60,
    y: Math.random() * 120 - 60,
    size: 4 + Math.random() * 8,
    delay: i * 0.08,
    color: i % 4 === 0 ? "rgba(132, 255, 1, 0.4)" : "rgba(255, 255, 255, 0.2)"
  }))
},
// 7. Purpose & Problems (Target)
{
  elements: Array(3).fill(0).map((_, i) => ({
    x: Math.random() * 60 - 30,
    y: Math.random() * 60 - 30,
    size: 20 + Math.random() * 30,
    delay: i * 0.3,
    color: "rgba(132, 255, 1, 0.25)"
  }))
},
// 8. Crew & Thinkers (SquareStack)
{
  elements: Array(15).fill(0).map((_, i) => ({
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    size: 5 + Math.random() * 10,
    delay: i * 0.07,
    color: i % 5 === 0 ? "rgba(132, 255, 1, 0.3)" : "rgba(255, 255, 255, 0.15)"
  }))
},
// 9. Training & Power (Zap)
{
  elements: Array(7).fill(0).map((_, i) => ({
    x: Math.random() * 80 - 40,
    y: Math.random() * 80 - 40,
    size: 10 + Math.random() * 15,
    delay: i * 0.12,
    color: i % 2 === 0 ? "rgba(132, 255, 1, 0.45)" : "rgba(255, 255, 255, 0.2)"
  }))
}];
export function JourneySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  const controlsRef = useRef(null);
  const animationControls = useAnimation();
  const [cursorPosition, setCursorPosition] = useState({
    x: 0,
    y: 0
  });
  const [isHovering, setIsHovering] = useState(false);
  const [timeProgress, setTimeProgress] = useState(100);

  // Get the current icon component based on the current index
  const CurrentIcon = journeyIcons[currentIndex];

  // Get the current interactive elements based on the current index
  const currentInteractiveElements = interactiveElements[currentIndex]?.elements || [];

  // Handle auto-cycling through the sentences - Changed to 5 seconds
  useEffect(() => {
    if (isAutoPlay) {
      // Reset progress to 100% when changing slides
      setTimeProgress(100);

      // Start decreasing progress
      const progressInterval = setInterval(() => {
        setTimeProgress(prev => Math.max(prev - 2, 0));
      }, 100);
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          // Loop back to the beginning when reaching the end
          return (prev + 1) % journeySentences.length;
        });
      }, 5000); // Changed to 5 seconds

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        clearInterval(progressInterval);
      };
    } else {
      // If not in autoplay, reset progress
      setTimeProgress(0);
    }
  }, [currentIndex, isAutoPlay]);

  // Track mouse position for interactive elements
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * 2 - 1;
    const y = (event.clientY - rect.top) / rect.height * 2 - 1;
    setMousePosition({
      x,
      y
    });
    setCursorPosition({
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height
    });
    animationControls.start({
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.5
      }
    });
  };
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
  };

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
    if (!isAutoPlay) {
      setTimeProgress(100);
    }
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
    }
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
    }
  };

  // Dynamic wave effect based on cursor position
  const waveEffect = {
    y: isHovering ? Math.sin(cursorPosition.x * Math.PI * 4) * 10 : 0,
    opacity: isHovering ? 0.6 + Math.sin(cursorPosition.x * Math.PI) * 0.4 : 0.3,
    scale: isHovering ? 1 + Math.sin(cursorPosition.y * Math.PI) * 0.1 : 1
  };
  
  return <section ref={sectionRef} onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{
    background: "#FAFAFA"
  }} className="relative min-h-screen py-24">      
      {/* Dynamic background particles based on cursor position */}
      <motion.div className="absolute inset-0 overflow-hidden pointer-events-none z-0" animate={{
      backgroundPosition: isHovering ? `${cursorPosition.x * 10}% ${cursorPosition.y * 10}%` : '50% 50%'
    }} transition={{
      duration: 1.5,
      ease: "easeOut"
    }} style={{
      background: "radial-gradient(circle at 50% 50%, rgba(210, 255, 210, 0.8) 0%, rgba(230, 255, 230, 0.4) 50%, rgba(240, 255, 240, 0.2) 100%)",
      backgroundSize: "120% 120%"
    }}>
        {Array.from({
        length: 20
      }).map((_, i) => {
        const size = 2 + Math.random() * 8;
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;
        const speed = 0.5 + Math.random() * 2;
        return <motion.div key={`particle-${i}`} className="absolute rounded-full" initial={{
          left: `${initialX}%`,
          top: `${initialY}%`,
          width: size,
          height: size,
          opacity: 0.3 + Math.random() * 0.4,
          backgroundColor: i % 3 === 0 ? 'hsl(var(--brand-green))' : 'rgba(255, 255, 255, 0.8)'
        }} animate={{
          left: `${initialX + (isHovering ? cursorPosition.x * 20 - 10 : 0)}%`,
          top: `${initialY + (isHovering ? cursorPosition.y * 20 - 10 : 0)}%`,
          opacity: isHovering ? 0.3 + Math.random() * 0.7 : 0.1 + Math.random() * 0.3,
          scale: isHovering ? [1, 1.1 + Math.sin(Date.now() / (1000 * speed)) * 0.2, 1] : 1
        }} transition={{
          left: {
            duration: 1,
            ease: "easeOut"
          },
          top: {
            duration: 1,
            ease: "easeOut"
          },
          opacity: {
            duration: 0.8
          },
          scale: {
            repeat: Infinity,
            duration: 3 * speed,
            ease: "easeInOut"
          }
        }} />;
      })}
      </motion.div>

      {/* Light beam effect */}
      {isHovering && <motion.div className="absolute pointer-events-none" style={{
      left: `${cursorPosition.x * 100}%`,
      top: `${cursorPosition.y * 100}%`,
      width: '300px',
      height: '300px',
      marginLeft: '-150px',
      marginTop: '-150px',
      background: 'radial-gradient(circle, rgba(132,255,1,0.15) 0%, rgba(132,255,1,0.05) 40%, rgba(0,0,0,0) 70%)'
    }} initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.3
    }} />}
      
      <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-5xl mx-auto flex flex-col bg-transparent">
          {/* Title with refined styling */}
          <div className="text-center py-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">The Evolution</h2>
          </div>
          
          {/* Main content area with transparent background */}
          <div className="flex-1 flex items-center justify-center px-4 mb-16">
            <div className="w-full max-w-3xl mx-auto relative">
              <div className="p-8 rounded-3xl">
                <AnimatePresence mode="wait">
                  {currentIndex === journeySentences.length - 1 ?
                // Final sentence with waitlist form
                <div className="space-y-6">
                      <div className="flex justify-center mb-4">
                        <motion.div className="text-[hsl(var(--brand-green))] flex items-center justify-center h-12 w-12" variants={iconVariants} initial="hidden" animate="visible" exit="exit" whileHover={{
                      scale: 1.2,
                      rotate: [0, 10, -10, 0],
                      transition: {
                        duration: 0.6
                      }
                    }}>
                          <CurrentIcon size={36} strokeWidth={1.5} />
                        </motion.div>
                      </div>
                      
                      <motion.p className="text-lg md:text-xl text-gray-800 leading-relaxed text-center" dangerouslySetInnerHTML={{
                    __html: journeySentences[currentIndex]
                  }} variants={containerVariants} initial="hidden" animate="visible" exit="exit" />
                      
                      <motion.div initial={{
                    opacity: 0,
                    y: 30
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} transition={{
                    delay: 0.6,
                    duration: 0.5
                  }}>
                        <WaitlistForm />
                      </motion.div>
                    </div> :
                // Regular sentence display with enhanced animations and icon
                <div className="space-y-6">
                      <div className="flex justify-center mb-4">
                        <motion.div className="text-[hsl(var(--brand-green))] flex items-center justify-center h-12 w-12" variants={iconVariants} initial="hidden" animate="visible" exit="exit" key={`icon-${currentIndex}`} whileHover={{
                      scale: 1.2,
                      rotate: [0, 10, -10, 0],
                      transition: {
                        duration: 0.6
                      }
                    }}>
                          <CurrentIcon size={36} strokeWidth={1.5} />
                        </motion.div>
                      </div>
                      
                      <motion.p className="text-lg md:text-xl text-gray-800 leading-relaxed text-center" dangerouslySetInnerHTML={{
                    __html: journeySentences[currentIndex]
                  }} variants={containerVariants} initial="hidden" animate="visible" exit="exit" key={`text-${currentIndex}`} />
                    </div>}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          {/* Navigation and toggle control - positioned at the bottom of the section with REDUCED SIZE */}
          <div ref={controlsRef} className="w-full max-w-2xl mx-auto flex flex-col items-center gap-3 mb-6">
            {/* Timeline progress bar */}
            <div className="w-full max-w-xs bg-white/20 h-[3px] rounded-full overflow-hidden mb-3">
              {isAutoPlay && <motion.div className="h-full bg-brand-green" initial={{
              width: '100%'
            }} animate={{
              width: `${timeProgress}%`
            }} transition={{
              duration: 0.1,
              ease: "linear"
            }} />}
            </div>
            
            <div className="flex items-center gap-4 mb-1 bg-white/10 backdrop-blur-sm shadow-lg rounded-full py-[5px] px-[15px]">
              <Button variant="outline" size="icon" className="h-7 w-7 rounded-full hover:bg-brand-green/20 hover:border-brand-green/40 transition-colors" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4 text-gray-800" />
              </Button>
              
              <div className="flex gap-1">
                {journeySentences.map((_, i) => <motion.div key={i} className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${currentIndex === i ? 'bg-brand-green scale-125 shadow-[0_0_15px_rgba(132,255,1,0.6)]' : 'bg-gray-300 hover:bg-gray-400'}`} whileHover={{
                scale: 1.3
              }} onClick={() => {
                setIsAutoPlay(false);
                setCurrentIndex(i);
              }} />)}
              </div>
              
              <Button variant="outline" size="icon" className="h-7 w-7 rounded-full hover:bg-brand-green/20 hover:border-brand-green/40 transition-colors" onClick={handleNext}>
                <ChevronRight className="h-4 w-4 text-gray-800" />
              </Button>
            </div>
            
            {/* Auto-play toggle button - MADE SMALLER */}
            <Button variant="outline" size="sm" onClick={toggleAutoPlay} className={`h-6 mt-0 px-3 py-0.5 text-xs transition-all duration-300 rounded-full 
                ${isAutoPlay ? 'bg-brand-green/20 text-gray-800 border-brand-green/50 hover:bg-brand-green/30' : 'bg-transparent text-gray-600 hover:bg-white/40 border-white/40'}`}>
              {isAutoPlay ? "Pause" : "Auto-Play"}
            </Button>
          </div>
        </div>
      </div>
    </section>;
}
