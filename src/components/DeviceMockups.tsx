
import React from 'react';
import { AppScreens } from './AppScreens';

export const DeviceMockups = () => {
  return (
    <div className="relative">
      {/* Pulsing animation behind devices */}
      <div className="pulse-animation absolute w-full h-full rounded-full"></div>
      
      <div className="flex items-center justify-center">
        {/* Laptop mockup */}
        <div className="relative mr-[-80px] z-10 hidden md:block">
          <div className="bg-gray-900 rounded-t-xl overflow-hidden w-[320px] h-[200px] border-[8px] border-gray-800">
            <div className="bg-gray-800 absolute top-0 left-0 right-0 h-5"></div>
            <div className="h-full w-full overflow-hidden bg-white">
              <div className="h-full w-full transform scale-[0.7] origin-top-left mt-5">
                <AppScreens />
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-b-xl h-[15px] w-[320px]"></div>
          <div className="bg-gray-700 h-[10px] w-[220px] mx-auto rounded-b-lg"></div>
        </div>
        
        {/* Phone mockup (reusing existing but positioned differently) */}
        <div className="relative z-20 scale-90 md:scale-100 mt-0 md:mt-8">
          <div className="bg-black rounded-[40px] overflow-hidden w-[220px] h-[440px] border-[12px] border-black shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-6 flex justify-center z-10">
              <div className="w-20 h-5 bg-black rounded-b-xl"></div>
            </div>
            <div className="h-full w-full overflow-hidden bg-white">
              <AppScreens />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
