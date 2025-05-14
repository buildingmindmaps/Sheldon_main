
import React from 'react';
import { cn } from "@/lib/utils";

const logos = [
  { name: "Bain", className: "w-8 h-8 rounded-full bg-gray-300" },
  { name: "McKinsey", className: "w-8 h-8 rounded-full bg-gray-300" },
  { name: "BCG", className: "w-8 h-8 rounded-full bg-gray-300" },
  { name: "Deloitte", className: "w-8 h-8 rounded-full bg-gray-300" },
  { name: "Accenture", className: "w-8 h-8 rounded-full bg-gray-300" },
  { name: "Kearney", className: "w-8 h-8 rounded-full bg-gray-300" }
];

export function LogoCloud({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap justify-center items-center gap-6 py-8", className)}>
      <p className="text-gray-500 mr-4">Trusted by:</p>
      {logos.map((logo) => (
        <div 
          key={logo.name} 
          className={cn("flex items-center justify-center", logo.className)}
        >
          {/* Empty circles as placeholders for the actual logos */}
        </div>
      ))}
    </div>
  );
}
