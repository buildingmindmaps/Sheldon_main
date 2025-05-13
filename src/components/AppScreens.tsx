
import React from 'react';
import { LaptopFrame } from './LaptopFrame';
import { InterviewScreen } from './InterviewScreen';
import { useIsMobile } from '@/hooks/use-mobile';

export function AppScreens() {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative w-full max-w-full mx-auto">
      {/* Main laptop with interview interface */}
      <div className="relative z-20">
        {/* Laptop frame with custom pulse animation that follows laptop border */}
        <div className="laptop-outline-pulse absolute w-[690px] h-[440px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl"></div>
        <LaptopFrame className={`floating ${isMobile ? 'scale-[0.8]' : ''} z-30 relative`}>
          <InterviewScreen />
        </LaptopFrame>
      </div>
    </div>
  );
}
