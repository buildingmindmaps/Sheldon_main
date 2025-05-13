
import React from 'react';

export const StandardDeviationCurve = () => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3">Adaptive Difficulty</h3>
      
      <div className="relative h-36 w-full">
        {/* Bell curve SVG */}
        <svg className="w-full h-full" viewBox="0 0 240 100" fill="none">
          {/* Bell curve path */}
          <path
            d="M10,90 Q60,90 80,60 Q100,30 120,10 Q140,30 160,60 Q180,90 230,90"
            stroke="gray"
            strokeWidth="1.5"
            fill="transparent"
          />
          
          {/* Shaded area for 80% */}
          <path
            d="M160,60 Q180,90 230,90 L230,95 L10,95 L10,90 Q60,90 80,60 Q100,30 120,10 Q140,30 160,60"
            fill="rgba(132, 255, 1, 0.2)"
          />
          
          {/* Percentile line */}
          <line x1="160" y1="0" x2="160" y2="95" stroke="rgba(132, 255, 1, 0.8)" strokeWidth="2" strokeDasharray="4" />
        </svg>
        
        {/* Percentile indicator */}
        <div className="absolute bottom-0 right-16 transform translate-x-1/2">
          <div className="bg-brand-green text-black text-xs px-2 py-1 rounded">
            80th percentile
          </div>
        </div>
      </div>
      
      <p className="text-sm mt-2 font-medium">You are better than 80% of practitioners</p>
    </div>
  );
};
