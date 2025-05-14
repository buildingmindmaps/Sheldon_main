
import React from 'react';

export function InterviewScreen() {
  return (
    <div className="h-full w-full overflow-hidden flex items-center justify-center">
      <div className="relative">
        {/* Blinking border animation */}
        <div className="absolute inset-0 rounded-lg border border-[#F2FCE2] animate-pulse"></div>
        
        {/* Image with floating animation */}
        <img 
          src="/lovable-uploads/6c539c76-8de0-4c4c-95c4-7af17365ad69.png" 
          alt="Case Interview Interface" 
          className="relative z-10 w-full h-full object-contain rounded-lg floating"
        />
      </div>
    </div>
  );
}
