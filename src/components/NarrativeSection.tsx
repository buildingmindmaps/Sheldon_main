
import React, { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const narrativeLines = [
  "It starts with a small itch—classroom answers feel too short for tomorrow.",
  "That itch becomes drive; you break problems apart like *Musk* tearing down a rocket.",
  "Drive turns daily; every dawn you sharpen questions like *Jobs* polishing a launch.",
  "Daily habit sparks bold ideas; you map futures like *APJ Abdul Kalam* sketching rockets.",
  "Ideas invite rivals; you test yourself against the best to see how far you'll go.",
  "Rivalry shapes skill; your mind becomes a workshop, laziness barred at the door.",
  "Skill hardens into purpose; grades fade, but solving untouched problems lights a fire.",
  "Purpose finds its crew here—thinkers who hate easy answers, builders who make change.",
];

export const NarrativeSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Dark narrative frames */}
      <div className="bg-neutral-900 text-white">
        {narrativeLines.map((text, i) => (
          <NarrativeFrame key={i} text={text} index={i} />
        ))}
      </div>
      
      {/* CTA frame with light background */}
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 text-neutral-900 px-4">
        <h2 className="mb-8 text-4xl md:text-6xl font-semibold text-center max-w-4xl">
          Train here. Master mental models. Claim your edge.
        </h2>
        <Link to="/playbook">
          <Button className="px-8 py-7 rounded-full text-lg font-medium bg-neutral-900 text-white hover:scale-105 transition">
            Start My First Rep →
          </Button>
        </Link>
      </div>
    </section>
  );
};

const NarrativeFrame = ({ text, index }: { text: string; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  
  // Format text to handle hero names with special styling
  const formattedText = text.split('*').map((part, i) => 
    i % 2 === 0 ? (
      <span key={i}>{part}</span>
    ) : (
      <span key={i} className="font-serif italic relative">
        {part}
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-400 opacity-70"></span>
      </span>
    )
  );
  
  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center px-4">
      <h2 
        className={`mx-auto max-w-4xl text-center text-3xl md:text-5xl font-light transition-all duration-700 ${
          isInView 
            ? "opacity-100 transform translate-y-0" 
            : "opacity-0 transform translate-y-10"
        } ${index > 4 ? "font-normal" : ""}`}
      >
        {formattedText}
      </h2>
    </div>
  );
};
