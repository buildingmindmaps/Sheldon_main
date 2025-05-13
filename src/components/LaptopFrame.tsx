
import React from 'react';
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface LaptopFrameProps {
  children: React.ReactNode;
  className?: string;
}

export function LaptopFrame({ children, className }: LaptopFrameProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Laptop body */}
      <div className="relative mx-auto bg-gray-800 rounded-t-xl w-[700px] h-[450px] p-4 shadow-xl">
        {/* Laptop screen bezel */}
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-900 rounded-t-xl p-2">
          {/* Camera */}
          <div className="absolute left-1/2 top-2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-gray-700 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-gray-600"></div>
          </div>
          
          {/* Screen */}
          <div className="relative h-full w-full bg-white rounded-md overflow-hidden">
            {children}
          </div>
        </div>
      </div>

      {/* Laptop base */}
      <div className="mx-auto w-[800px] h-[30px] bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-lg"></div>
    </div>
  );
}
