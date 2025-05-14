
import React from 'react';

export function InterviewScreen() {
  return (
    <div className="h-full w-full overflow-visible flex items-center justify-center">
      <div className="relative p-3">
        {/* Pulsing border animation */}
        <div className="absolute inset-0 rounded-lg border-2 border-[#F2FCE2] pulse-animation"></div>
        
        {/* Image with floating animation */}
        <img 
          src="/lovable-uploads/a41cf149-bf8e-4e39-bef3-307a6f741c13.png" 
          alt="Case Interview Interface" 
          className="relative z-10 w-full h-full object-contain rounded-lg floating"
        />
      </div>
    </div>
  );
}
