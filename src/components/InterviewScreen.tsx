
import React from 'react';

export function InterviewScreen() {
  return (
    <div className="h-full w-full flex items-center justify-center py-8">
      <div className="relative">
        {/* Image with floating animation */}
        <div className="relative">
          {/* Pulsing border that follows the visible image */}
          <div className="absolute inset-0 rounded-lg border-2 border-[#F2FCE2] pulse-animation"></div>
          
          <img 
            src="/lovable-uploads/09819adb-ddca-4db0-b7da-5748cb25fa96.png" 
            alt="Case Interview Interface" 
            className="relative z-10 w-full h-auto object-contain rounded-lg floating"
          />
        </div>
      </div>
    </div>
  );
}
