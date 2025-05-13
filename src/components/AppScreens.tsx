
import React from 'react';
import { DeviceFrame } from './DeviceFrame';

export function AppScreens() {
  return (
    <div className="relative">
      {/* Main phone */}
      <DeviceFrame className="z-20 floating">
        <div className="bg-gray-50 h-full flex flex-col">
          <div className="bg-black text-white p-4 text-center">
            <h3 className="font-bold text-lg">AI Interviewer</h3>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg p-3 shadow-sm mb-3">
              <p className="font-medium mb-1">Case: Market Entry Strategy</p>
              <div className="bg-gray-100 p-2 rounded text-sm mb-2">
                <p>Your client is considering entering the EV market. What factors should they consider?</p>
              </div>
              <div className="flex justify-between">
                <span className="text-xs bg-brand-green/20 text-green-800 px-2 py-1 rounded-full">Difficulty: Medium</span>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">25 min</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
              <div className="flex items-start mb-2">
                <div className="bg-gray-200 rounded-full p-2 mr-2">
                  <div className="w-6 h-6"></div>
                </div>
                <div className="bg-gray-100 p-2 rounded-lg">
                  <p className="text-sm">Let's start by considering the market size and growth potential for EVs.</p>
                </div>
              </div>
              
              <div className="flex items-start justify-end">
                <div className="bg-black text-white p-2 rounded-lg">
                  <p className="text-sm">I would begin with market analysis, looking at current penetration and projections...</p>
                </div>
                <div className="bg-gray-200 rounded-full p-2 ml-2">
                  <div className="w-6 h-6"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-3">
              <div className="flex items-start">
                <div className="bg-gray-200 rounded-full p-2 mr-2">
                  <div className="w-6 h-6"></div>
                </div>
                <div className="bg-gray-100 p-2 rounded-lg">
                  <p className="text-sm">Good start. What about competitive landscape?</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="relative">
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-full px-4 py-2 pr-10 text-sm" 
                placeholder="Type your response..."
              />
              <div className="absolute right-3 top-2 w-6 h-6 bg-brand-green rounded-full"></div>
            </div>
          </div>
        </div>
      </DeviceFrame>
      
      {/* Background phone */}
      <DeviceFrame className="absolute -left-20 -bottom-10 opacity-50 z-10 scale-90">
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
      
      {/* Top-right decorative phone */}
      <DeviceFrame className="absolute -right-10 -top-20 opacity-30 z-0 scale-75">
        <div className="h-full bg-gray-50">
          <div className="h-full flex items-center justify-center">
            <div className="p-4 text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </DeviceFrame>
    </div>
  );
}
