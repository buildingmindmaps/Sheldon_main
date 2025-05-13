
import React from 'react';
import { LaptopFrame } from './LaptopFrame';
import { InterviewScreen } from './InterviewScreen';
import { useIsMobile } from '@/hooks/use-mobile';

export function AppScreens() {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative">
      {/* Main laptop with interview interface */}
      <div className="relative z-20">
        {/* Pulse animation that follows laptop border */}
        <div className="laptop-pulse-animation absolute w-[720px] h-[470px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl"></div>
        <LaptopFrame className={`floating ${isMobile ? 'scale-[0.8]' : ''} z-30 relative`}>
          <InterviewScreen />
        </LaptopFrame>
      </div>
    </div>
  );
}
