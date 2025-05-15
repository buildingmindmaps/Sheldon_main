import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Circle, SquareStack, Sparkles, Brain, Rocket, Users, Target, Lightbulb, Trophy, Zap, PuzzlePiece, Logic } from "lucide-react";
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

// Interactive elements for each sentence
const interactiveElements = [
  // 1. Questions & Answers (Circle)
  {
    elements: Array(5).fill(0).map((_, i) => ({
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      size: 6 + Math.random() * 10,
      delay: i * 0.1,
      color: i % 2 === 0 ? "rgba(132, 255, 1, 0.5)" : "rgba(255, 255, 255, 0.3)",
    })),
  },
  // 2. Drive & Rockets (Rocket)
  {
    elements: Array(10).fill(0).map((_, i) => ({
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      size: 2 + Math.random() * 4,
      delay: i * 0.1,
      color: "rgba(255, 255, 255, 0.4)",
    })),
  },
  // 3. Daily Habit (Sparkles)
  {
    elements: Array(6).fill(0).map((_, i) => ({
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      size: 12 + Math.random() * 14,
      delay: i * 0.15,
      color: i % 3 === 0 ? "rgba(132, 255, 1, 0.4)" : "rgba(255, 255, 255, 0.2)",
    })),
  },
  // 4. Ideas & Future (Lightbulb)
  {
    elements: Array(4).fill(0).map((_, i) => ({
      x: Math.random() * 80 - 40,
      y: Math.random() * 80 - 40,
      size: 15 + Math.random() * 20,
      delay: i * 0.2,
      color: i % 2 === 0 ? "rgba(132, 255, 1, 0.3)" : "rgba(255, 255, 255, 0.2)",
    })),
  },
  // 5. Rivals & Competition (Users)
  {
    elements: Array(8).fill(0).map((_, i) => ({
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      size: 8 + Math.random() * 12,
      delay: i * 0.1,
      color: i % 3 === 0 ? "rgba(132, 255, 1, 0.35)" : "rgba(255, 255, 255, 0.25)",
    })),
  },
  // 6. Workshop & Skills (Brain)
  {
    elements: Array(12).fill(0).map((_, i) => ({
      x: Math.random() * 120 - 60,
      y: Math.random() * 120 - 60,
      size: 4 + Math.random() * 8,
      delay: i * 0.08,
      color: i % 4 === 0 ? "rgba(132, 255, 1, 0.4)" : "rgba(255, 255, 255, 0.2)",
    })),
  },
  // 7. Purpose & Problems (Target)
  {
    elements: Array(3).fill(0).map((_, i) => ({
      x: Math.random() * 60 - 30,
      y: Math.random() * 60 - 30,
      size: 20 + Math.random() * 30,
      delay: i * 0.3,
      color: "rgba(132, 255, 1, 0.25)",
    })),
  },
  // 8. Crew & Thinkers (SquareStack)
  {
    elements: Array(15).fill(0).map((_, i) => ({
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      size: 5 + Math.random() * 10,
      delay: i * 0.07,
      color: i % 5 === 0 ? "rgba(132, 255, 1, 0.3)" : "rgba(255, 255, 255, 0.15)",
    })),
  },
  // 9. Training & Power (Zap)
  {
    elements: Array(7).fill(0).map((_, i) => ({
      x: Math.random() * 80 - 40,
      y: Math.random() * 80 - 40,
      size: 10 + Math.random() * 15,
      delay: i * 0.12,
      color: i % 2 === 0 ? "rgba(132, 255, 1, 0.45)" : "rgba(255, 255, 255, 0.2)",
    })),
  },
];

// Puzzle pieces configuration for the interactive puzzle
const puzzlePieces = [
  { id: 1, color: "#33C3F0", initialX: 10, initialY: 0, size: 40, shape: "circle" },
  { id: 2, color: "#9b87f5", initialX: 80, initialY: 0, size: 50, shape: "square" },
  { id: 3, color: "#7E69AB", initialX: 160, initialY: 0, size: 45, shape: "triangle" },
  { id: 4, color: "#F97316", initialX: 240, initialY: 0, size: 42, shape: "diamond" },
  { id: 5, color: "#84FF01", initialX: 320, initialY: 0, size: 48, shape: "hexagon" },
];

export function JourneySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const controlsRef = useRef(null);
  const animationControls = useAnimation();
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [draggingPiece, setDraggingPiece] = useState<number | null>(null);
  const [puzzleState, setPuzzleState] = useState(puzzlePieces);

  // Handle auto-cycling through the sentences - Changed to 6 seconds
  useEffect(() => {
    if (isAutoPlay) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          // Loop back to the beginning when reaching the end
          return (prev + 1) % journeySentences.length;
        });
      }, 6000); // Changed from 3000 to 6000 (6 seconds)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex, isAutoPlay]);

  // Track mouse position for interactive elements
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    
    setMousePosition({ x, y });
    setCursorPosition({
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height
    });
    
    animationControls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 0.5 }
    });
    
    // Update puzzle pieces position when hovering but not dragging
    if (isHovering && draggingPiece === null) {
      setPuzzleState(prev => prev.map(piece => ({
        ...piece,
        hoverX: Math.sin((cursorPosition.x * Math.PI * 2) + piece.id * 0.5) * 15,
        hoverY: Math.cos((cursorPosition.y * Math.PI * 2) + piece.id * 0.7) * 10,
      })));
    }
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    // Reset hover effects when mouse leaves
    setPuzzleState(prev => prev.map(piece => ({
      ...piece,
      hoverX: 0,
      hoverY: 0,
    })));
  };

  // Puzzle piece drag handlers
  const startDragging = (id: number) => {
    setDraggingPiece(id);
  };
  
  const stopDragging = () => {
    setDraggingPiece(null);
    // Apply gravity to bring pieces back to ground level
    setPuzzleState(prev => prev.map(piece => ({
      ...piece,
      y: 0, // Reset to ground level
      hoverX: 0,
      hoverY: 0,
    })));
  };
  
  const handleDrag = (id: number, x: number, y: number) => {
    setPuzzleState(prev => 
      prev.map(piece => 
        piece.id === id 
          ? { ...piece, x, y } 
          : piece
      )
    );
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

  // Render shapes for puzzle pieces
  const renderPuzzlePiece = (piece: typeof puzzleState[0]) => {
    const x = piece.initialX + (piece.x || 0) + (piece.hoverX || 0);
    const y = piece.y || 0 + (piece.hoverY || 0);
    
    const commonProps = {
      initial: { x: piece.initialX, y: 0 },
      animate: { 
        x,
        y: -y, // Negative because we want to move up from the ground line
        rotate: draggingPiece === piece.id ? 0 : [0, piece.id % 2 === 0 ? 5 : -5, 0],
        scale: draggingPiece === piece.id ? 1.1 : 1
      },
      transition: { 
        rotate: { repeat: Infinity, duration: 3 + piece.id * 0.5, ease: "easeInOut" },
        scale: { duration: 0.2 }
      },
      style: { 
        backgroundColor: piece.color,
        cursor: 'grab',
        position: 'absolute',
        bottom: 0,
        borderRadius: piece.shape === 'circle' ? '50%' : piece.shape === 'square' ? '4px' : '0',
        width: piece.size,
        height: piece.size,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: `0 ${draggingPiece === piece.id ? '8px' : '4px'} 12px rgba(0,0,0,0.1)`,
        zIndex: draggingPiece === piece.id ? 10 : 1
      },
      onMouseDown: () => startDragging(piece.id),
      onMouseUp: stopDragging,
      drag: draggingPiece === piece.id,
      dragConstraints: { left: 0, right: 400, top: -150, bottom: 0 },
      onDrag: (_: any, info: { point: { x: number; y: number } }) => {
        if (draggingPiece === piece.id) {
          // Calculate position relative to the puzzle ground
          const groundRect = document.getElementById('puzzle-ground')?.getBoundingClientRect();
          if (groundRect) {
            const relativeX = info.point.x - groundRect.left;
            const relativeY = groundRect.bottom - info.point.y; // Calculate how high above the ground
            handleDrag(piece.id, relativeX - piece.size/2, Math.max(0, relativeY));
          }
        }
      }
    };
    
    // Logic for different shapes
    switch(piece.shape) {
      case 'circle':
        return (
          <motion.div 
            key={`puzzle-${piece.id}`}
            {...commonProps}
            style={{...commonProps.style, borderRadius: '50%'}}
          >
            {piece.id % 2 === 0 && <PuzzlePiece size={piece.size/2} stroke="rgba(255,255,255,0.5)" />}
          </motion.div>
        );
      case 'square':
        return (
          <motion.div
            key={`puzzle-${piece.id}`}
            {...commonProps}
            style={{...commonProps.style, borderRadius: '4px'}}
          >
            {piece.id % 2 === 1 && <Logic size={piece.size/2} stroke="rgba(255,255,255,0.5)" />}
          </motion.div>
        );
      case 'triangle':
        return (
          <motion.div
            key={`puzzle-${piece.id}`}
            {...commonProps}
            style={{
              ...commonProps.style,
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderLeft: `${piece.size/2}px solid transparent`,
              borderRight: `${piece.size/2}px solid transparent`,
              borderBottom: `${piece.size}px solid ${piece.color}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              paddingBottom: '5px'
            }}
          >
            {piece.id % 2 === 0 && <Brain size={piece.size/3} stroke="rgba(255,255,255,0.5)" />}
          </motion.div>
        );
      case 'diamond':
        return (
          <motion.div
            key={`puzzle-${piece.id}`}
            {...commonProps}
            style={{
              ...commonProps.style,
              transform: 'rotate(45deg)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div style={{transform: 'rotate(-45deg)'}}>
              {piece.id % 2 === 1 && <PuzzlePiece size={piece.size/2} stroke="rgba(255,255,255,0.5)" />}
            </div>
          </motion.div>
        );
      case 'hexagon':
        return (
          <motion.div
            key={`puzzle-${piece.id}`}
            {...commonProps}
            style={{
              ...commonProps.style,
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
            }}
          >
            {piece.id % 2 === 0 && <Logic size={piece.size/2} stroke="rgba(255,255,255,0.5)" />}
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Get current icon component
  const CurrentIcon = journeyIcons[currentIndex];
  
  // Get current interactive elements
  const currentInteractiveElements = interactiveElements[currentIndex]?.elements || [];

  // Dynamic wave effect based on cursor position
  const waveEffect = {
    y: isHovering ? Math.sin(cursorPosition.x * Math.PI * 4) * 10 : 0,
    opacity: isHovering ? 0.6 + Math.sin(cursorPosition.x * Math.PI) * 0.4 : 0.3,
    scale: isHovering ? 1 + Math.sin(cursorPosition.y * Math.PI) * 0.1 : 1,
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-screen py-24"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >      
      {/* Dynamic background particles based on cursor position */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => {
          const size = 2 + Math.random() * 8;
          const initialX = Math.random() * 100;
          const initialY = Math.random() * 100;
          const speed = 0.5 + Math.random() * 2;
          
          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              initial={{ 
                left: `${initialX}%`, 
                top: `${initialY}%`, 
                width: size, 
                height: size,
                opacity: 0.3 + Math.random() * 0.4,
                backgroundColor: i % 3 === 0 
                  ? 'hsl(var(--brand-green))' 
                  : 'rgba(255, 255, 255, 0.8)'
              }}
              animate={{
                left: `${initialX + (isHovering ? cursorPosition.x * 20 - 10 : 0)}%`,
                top: `${initialY + (isHovering ? cursorPosition.y * 20 - 10 : 0)}%`,
                opacity: isHovering 
                  ? 0.3 + Math.random() * 0.7 
                  : 0.1 + Math.random() * 0.3,
                scale: isHovering 
                  ? [1, 1.1 + (Math.sin(Date.now() / (1000 * speed)) * 0.2), 1] 
                  : 1
              }}
              transition={{
                left: { duration: 1, ease: "easeOut" },
                top: { duration: 1, ease: "easeOut" },
                opacity: { duration: 0.8 },
                scale: { 
                  repeat: Infinity, 
                  duration: 3 * speed, 
                  ease: "easeInOut" 
                }
              }}
            />
          );
        })}
      </div>

      {/* Light beam effect */}
      {isHovering && (
        <motion.div 
          className="absolute pointer-events-none"
          style={{
            left: `${cursorPosition.x * 100}%`,
            top: `${cursorPosition.y * 100}%`,
            width: '300px',
            height: '300px',
            marginLeft: '-150px',
            marginTop: '-150px',
            background: 'radial-gradient(circle, rgba(132,255,1,0.15) 0%, rgba(132,255,1,0.05) 40%, rgba(0,0,0,0) 70%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-5xl mx-auto flex flex-col">
          {/* Title with refined styling */}
          <div className="text-center py-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">The Evolution</h2>
          </div>
          
          {/* Interactive floating elements that respond to mouse position */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {currentInteractiveElements.map((element, index) => (
              <motion.div
                key={`element-${currentIndex}-${index}`}
                className="absolute rounded-full"
                initial={{ 
                  x: `calc(50% + ${element.x}px)`, 
                  y: `calc(50% + ${element.y}px)`,
                  opacity: 0 
                }}
                animate={{ 
                  x: `calc(50% + ${element.x + (mousePosition.x * 30)}px)`, 
                  y: `calc(50% + ${element.y + (mousePosition.y * 30)}px)`,
                  opacity: 0.8,
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  x: { duration: 0.8 + element.delay, ease: "easeOut" },
                  y: { duration: 0.8 + element.delay, ease: "easeOut" },
                  opacity: { duration: 0.5, delay: element.delay },
                  scale: { repeat: Infinity, duration: 3 + element.delay, ease: "easeInOut" }
                }}
                style={{
                  width: element.size,
                  height: element.size,
                  backgroundColor: element.color,
                }}
              />
            ))}
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
                          whileHover={{ 
                            scale: 1.2, 
                            rotate: [0, 10, -10, 0],
                            transition: { duration: 0.6 } 
                          }}
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
                          whileHover={{ 
                            scale: 1.2, 
                            rotate: [0, 10, -10, 0],
                            transition: { duration: 0.6 } 
                          }}
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
          
          {/* Puzzle interactive area above the controls */}
          <div className="w-full max-w-3xl mx-auto relative bottom-0 mb-20">
            {/* Ground line for puzzle pieces */}
            <div 
              id="puzzle-ground"
              className="w-full h-1 bg-[#33C3F0] rounded-full mb-2 relative overflow-visible"
              style={{boxShadow: '0 0 10px rgba(51, 195, 240, 0.5)'}}
            >
              {/* Puzzle pieces that can be dragged */}
              {puzzleState.map(piece => renderPuzzlePiece(piece))}
            </div>
            
            {/* Puzzle instruction */}
            <div className="text-center text-sm text-gray-500 mb-4 italic">
              Drag the shapes to interact with the puzzle
            </div>
          </div>
          
          {/* Navigation and toggle control - positioned at the bottom of the section */}
          <div 
            ref={controlsRef}
            className="w-full max-w-3xl mx-auto flex flex-col items-center gap-4 mb-8"
          >
            <div className="flex items-center gap-6 mb-2 bg-white/10 backdrop-blur-sm py-3 px-6 rounded-full shadow-lg">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full hover:bg-brand-green/20 hover:border-brand-green/40 transition-colors"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-5 w-5 text-gray-800" />
              </Button>
              
              <div className="flex gap-2">
                {journeySentences.map((_, i) => (
                  <motion.div 
                    key={i} 
                    className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                      currentIndex === i 
                        ? 'bg-brand-green scale-125 shadow-[0_0_15px_rgba(132,255,1,0.6)]' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    whileHover={{ scale: 1.3 }}
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
                className="rounded-full hover:bg-brand-green/20 hover:border-brand-green/40 transition-colors"
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
