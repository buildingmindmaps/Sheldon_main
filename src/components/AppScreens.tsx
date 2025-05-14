
import React from 'react';
import { LaptopFrame } from './LaptopFrame';
import { InterviewScreen } from './InterviewScreen';
import { useIsMobile } from '@/hooks/use-mobile';

export function AppScreens() {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Main laptop with interview interface */}
      <div className="relative z-20 w-full h-full">
        {/* Pulse animation that follows laptop border */}
        <div className="laptop-pulse-animation absolute w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl"></div>
        <LaptopFrame className="floating z-30 relative w-full h-full">
          <InterviewScreen />
        </LaptopFrame>
      </div>
    </div>
  );
}
