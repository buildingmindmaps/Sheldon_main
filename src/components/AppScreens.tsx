
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
        <div className="pulse-animation absolute w-full h-full rounded-xl"></div>
        <LaptopFrame className={`floating ${isMobile ? 'scale-90' : ''}`}>
          <InterviewScreen />
        </LaptopFrame>
      </div>
    </div>
  );
}
