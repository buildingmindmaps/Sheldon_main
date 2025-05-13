
import React from 'react';
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  animationDelay?: string;
}

export function FeatureCard({ 
  title, 
  description, 
  icon, 
  className,
  animationDelay = "" 
}: FeatureCardProps) {
  return (
    <div 
      className={cn(
        "relative p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col",
        "opacity-0 animate-fade-in",
        animationDelay,
        className
      )}
    >
      <div className="mb-4 p-3 rounded-lg bg-brand-gray w-fit">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
