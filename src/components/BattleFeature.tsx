
import React from 'react';
import { Users } from 'lucide-react';

export const BattleFeature = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-center mb-4">
        <Users className="h-8 w-8 text-brand-green" />
      </div>
      
      <h3 className="text-xl font-semibold text-center mb-4">Live 1-v-1 Battles</h3>
      
      <div className="relative bg-gray-50 rounded-lg p-4 mt-6">
        <div className="flex justify-between mb-8 relative">
          {/* Battle participants */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-brand-gray rounded-full flex items-center justify-center border-2 border-brand-green">
              <span className="font-bold">You</span>
            </div>
            <span className="text-sm mt-1 font-medium">4.5★</span>
          </div>
          
          {/* VS indicator */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-green text-black font-bold rounded-full w-8 h-8 flex items-center justify-center">
            VS
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="font-bold">Peer</span>
            </div>
            <span className="text-sm mt-1 font-medium">4.7★</span>
          </div>
        </div>
        
        {/* Battle metrics */}
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="bg-white p-2 rounded shadow-sm">
            <p className="font-semibold">Problem</p>
            <p className="text-gray-600">Market Entry</p>
          </div>
          <div className="bg-white p-2 rounded shadow-sm">
            <p className="font-semibold">Time</p>
            <p className="text-gray-600">25:00</p>
          </div>
          <div className="bg-white p-2 rounded shadow-sm">
            <p className="font-semibold">Judges</p>
            <p className="text-gray-600">3</p>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">Challenge peers and improve together through competitive practice</p>
      </div>
    </div>
  );
};
