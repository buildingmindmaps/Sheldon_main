
import React from 'react';
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface LaptopFrameProps {
  children?: React.ReactNode;
  className?: string;
}

export function LaptopFrame({ className }: LaptopFrameProps) {
  return (
    <div className={cn("relative w-full", className)}>
      {/* Aspect ratio container to maintain mockup proportions */}
      <AspectRatio ratio={16/10} className="w-full overflow-hidden">
        <div className="w-full h-full relative">
          {/* Frame border */}
          <div className="absolute inset-0 border-4 rounded-xl border-gray-800 pointer-events-none z-10"></div>
          
          {/* The mockup image */}
          <img 
            src="/lovable-uploads/fd7b8e0b-ae7c-46f9-acc4-9900c5c24048.png" 
            alt="Case Interview Mockup" 
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
      </AspectRatio>
    </div>
  );
}
