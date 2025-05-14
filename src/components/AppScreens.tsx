
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { InterviewScreen } from './InterviewScreen';

export function AppScreens() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <InterviewScreen />
    </div>
  );
}
