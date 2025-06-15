
import React, { useEffect, useRef } from 'react';

interface TimerProps {
  timeElapsed: number;
  onTimeUpdate: (time: number) => void;
  isCompleted: boolean;
  isMobile?: boolean;
}

export const Timer: React.FC<TimerProps> = ({ timeElapsed, onTimeUpdate, isCompleted, isMobile = false }) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isCompleted) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      onTimeUpdate(timeElapsed + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeElapsed, onTimeUpdate, isCompleted]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isMobile) {
    return (
      <div className="flex items-center">
        <p className="text-sm text-gray-500">
          Time Elapsed: <span className="text-red-500 font-mono">{formatTime(timeElapsed)}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-1">TIME ELAPSED</p>
        <p className="text-2xl font-mono text-red-500">{formatTime(timeElapsed)}</p>
      </div>
    </div>
  );
};
