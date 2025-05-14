
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export function AppScreens() {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Main mockup with interview screen */}
      <div className="relative z-20 w-full h-full">
        {/* Pulse animation that follows mockup border */}
        <div className="laptop-pulse-animation absolute w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl"></div>
        
        {/* The mockup image without frame */}
        <img 
          src="/lovable-uploads/9a188d87-3e53-4529-ae53-669f373bf9b3.png" 
          alt="Case Interview Mockup" 
          className="relative z-30 w-full h-full object-contain rounded-lg floating"
        />
      </div>
    </div>
  );
}
