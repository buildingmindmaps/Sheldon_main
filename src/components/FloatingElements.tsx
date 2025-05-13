
import React from 'react';
import { cn } from "@/lib/utils";

export function FloatingElements({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none z-0", className)}>
      {/* Green orb */}
      <div className="absolute top-20 right-[20%] w-64 h-64 bg-brand-green opacity-20 rounded-full blur-3xl floating-slow"></div>
      
      {/* Purple orb */}
      <div className="absolute bottom-40 left-[15%] w-72 h-72 bg-purple-400 opacity-10 rounded-full blur-3xl floating"></div>
      
      {/* Small elements */}
      <div className="absolute top-[30%] left-[10%] w-6 h-6 bg-brand-green opacity-70 rounded-full floating-fast"></div>
      <div className="absolute top-[60%] right-[20%] w-8 h-8 bg-yellow-400 opacity-40 rounded-full floating"></div>
      <div className="absolute bottom-[20%] left-[30%] w-4 h-4 bg-blue-500 opacity-30 rounded-full floating-slow"></div>
      
      {/* More abstract shapes */}
      <div className="absolute top-[50%] right-[5%] w-20 h-20 border-4 border-brand-green opacity-20 rounded-lg rotate-12 floating"></div>
      <div className="absolute bottom-[10%] right-[40%] w-16 h-16 border-4 border-pink-400 opacity-10 rounded-full floating-slow"></div>
    </div>
  );
}
