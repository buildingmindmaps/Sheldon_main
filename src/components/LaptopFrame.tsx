
import React from 'react';
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface LaptopFrameProps {
  children: React.ReactNode;
  className?: string;
}

export function LaptopFrame({ children, className }: LaptopFrameProps) {
  return (
    <div className={cn("relative w-full", className)}>
      {/* Aspect ratio container to maintain laptop proportions */}
      <AspectRatio ratio={16/10} className="w-full">
        <div className="w-full h-full">
          {/* Laptop body */}
          <div className="relative w-full h-[90%] bg-gray-800 rounded-t-xl p-[1%] shadow-xl">
            {/* Laptop screen bezel */}
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-900 rounded-t-xl p-[0.5%]">
              {/* Camera */}
              <div className="absolute left-1/2 top-[1%] transform -translate-x-1/2 w-[0.8%] h-[1.5%] min-w-1 min-h-1 rounded-full bg-gray-700 flex items-center justify-center">
                <div className="w-[50%] h-[50%] rounded-full bg-gray-600"></div>
              </div>
              
              {/* Screen */}
              <div className="relative h-full w-full bg-white rounded-md overflow-hidden">
                {children}
              </div>
            </div>
          </div>

          {/* Laptop base */}
          <div className="w-[115%] h-[6%] mx-auto -ml-[7.5%] bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-lg"></div>
        </div>
      </AspectRatio>
    </div>
  );
}
