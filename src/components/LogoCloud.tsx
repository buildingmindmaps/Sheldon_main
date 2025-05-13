
import React from 'react';
import { cn } from "@/lib/utils";

const logos = [
  { name: "Bain", className: "w-20 opacity-70" },
  { name: "McKinsey", className: "w-24 opacity-70" },
  { name: "BCG", className: "w-18 opacity-70" },
  { name: "Deloitte", className: "w-24 opacity-70" },
  { name: "Accenture", className: "w-24 opacity-70" },
  { name: "Kearney", className: "w-24 opacity-70" }
];

export function LogoCloud({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap justify-center items-center gap-8 py-8", className)}>
      {logos.map((logo) => (
        <div 
          key={logo.name} 
          className={cn("bg-brand-gray rounded-md px-6 py-3 flex items-center justify-center", logo.className)}
        >
          <span className="text-gray-500 font-semibold">{logo.name}</span>
        </div>
      ))}
    </div>
  );
}
