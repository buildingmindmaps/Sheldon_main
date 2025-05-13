import React from 'react';
import { DeviceFrame } from './DeviceFrame';
import { LaptopFrame } from './LaptopFrame';
import { InterviewScreen } from './InterviewScreen';

export function AppScreens() {
  return (
    <div className="relative">
      {/* Main laptop */}
      <div className="relative z-20">
        <div className="pulse-animation absolute w-full h-full rounded-xl"></div>
        <LaptopFrame className="floating">
          <InterviewScreen />
        </LaptopFrame>
      </div>
      
      {/* Background phone - keep one phone as secondary device */}
      <DeviceFrame className="absolute -left-20 -bottom-20 opacity-50 z-10 scale-75">
        <div className="h-full bg-gray-50 flex flex-col">
          <div className="p-4 bg-white">
            <h3 className="text-lg font-bold">Your Performance</h3>
          </div>
          <div className="flex-1 p-4">
            <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
              <h4 className="font-medium mb-2">Case Breakdown</h4>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded-full w-full">
                  <div className="h-3 bg-brand-green rounded-full w-3/4"></div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full w-full">
                  <div className="h-3 bg-brand-green rounded-full w-1/2"></div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full w-full">
                  <div className="h-3 bg-brand-green rounded-full w-4/5"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-3">
              <h4 className="font-medium mb-2">Key Insights</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 rounded-full mr-2"></div>
                  <span>Strong market analysis</span>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-100 rounded-full mr-2"></div>
                  <span>Improve financial modeling</span>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 rounded-full mr-2"></div>
                  <span>Clear communication</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </DeviceFrame>
    </div>
  );
}
