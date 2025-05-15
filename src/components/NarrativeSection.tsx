
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Define the narrative lines with emphasis on the names
const narrativeLines = [
  "It starts with a small itch—classroom answers feel too short for tomorrow.",
  "That itch becomes drive; you break problems apart like <em>Musk</em> tearing down a rocket.",
  "Drive turns daily; every dawn you sharpen questions like <em>Jobs</em> polishing a launch.",
  "Daily habit sparks bold ideas; you map futures like <em>APJ Abdul Kalam</em> sketching rockets.",
  "Ideas invite rivals; you test yourself against the best to see how far you'll go.",
  "Rivalry shapes skill; your mind becomes a workshop, laziness barred at the door.",
  "Skill hardens into purpose; grades fade, but solving untouched problems lights a fire.",
  "Purpose finds its crew here—thinkers who hate easy answers, builders who make change."
];

export function NarrativeSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Dark canvas frames */}
      <div className="bg-brand-black text-white">
        {narrativeLines.map((line, index) => (
          <NarrativeFrame key={index} index={index}>
            <div dangerouslySetInnerHTML={{ __html: line }} />
          </NarrativeFrame>
        ))}
      </div>
      
      {/* CTA frame - light background */}
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-brand-black">
        <motion.div 
          className="max-w-4xl mx-auto px-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-8 text-4xl md:text-6xl font-semibold">
            Train here. Master mental models. Claim your edge.
          </h2>
          <Link to="/playbook">
            <Button 
              size="lg" 
              className="px-8 py-7 rounded-full text-lg font-medium bg-[hsl(var(--brand-green))] text-black hover:bg-brand-black hover:text-white transition-all hover:scale-105"
            >
              Start My First Rep <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Individual frame component with animation
function NarrativeFrame({ 
  children, 
  index 
}: { 
  children: React.ReactNode;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px -20% 0px" });
  
  const fontWeight = Math.min(300 + (index * 40), 600);
  
  return (
    <div 
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6"
    >
      <motion.h2 
        className={`mx-auto max-w-4xl text-center text-3xl md:text-4xl lg:text-5xl`}
        style={{ fontWeight }}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <span className="relative">
          {children}
          {/* Add subtle background graphics with very low opacity */}
          {index % 3 === 0 && (
            <motion.div 
              className="absolute -z-10 inset-0 opacity-5 bg-contain bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='100' cy='100' r='80' stroke='white' stroke-width='2'/%3E%3Cpath d='M140 100C140 70.6667 118.667 50 100 50' stroke='white' stroke-width='2'/%3E%3C/svg%3E")` 
              }}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          )}
        </span>
      </motion.h2>
    </div>
  );
}
