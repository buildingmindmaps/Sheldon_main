
import React from 'react';
import { Mic } from 'lucide-react';

interface VoiceVisualizerProps {
  volume: number;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ volume }) => {
  // Scale from 1 to 1.5 based on volume
  const scale = 1 + Math.min(volume, 1) * 0.5;

  const pulsatingCircleStyle: React.CSSProperties = {
    transform: `scale(${scale})`,
    transition: 'transform 0.1s ease-out',
  };

  return (
    <div className="relative flex items-center justify-center h-10 w-10">
      {/* Outer pulsating grey circle */}
      <div
        className="absolute h-10 w-10 bg-gray-200 rounded-full"
        style={pulsatingCircleStyle}
      />
      {/* Inner red circle with mic icon */}
      <div className="relative h-8 w-8 bg-red-600 rounded-full flex items-center justify-center">
        <Mic className="h-5 w-5 text-white" />
      </div>
    </div>
  );
};
