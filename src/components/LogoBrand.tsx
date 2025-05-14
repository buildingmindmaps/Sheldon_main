
import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const logos = [
  { name: "Bain", src: "/lovable-uploads/bain-logo.png", alt: "Bain logo", className: "w-20 h-12 object-contain" },
  { name: "McKinsey", src: "/lovable-uploads/mckinsey-logo.png", alt: "McKinsey logo", className: "w-20 h-12 object-contain" },
  { name: "BCG", src: "/lovable-uploads/bcg-logo.png", alt: "BCG logo", className: "w-16 h-12 object-contain" },
  { name: "Deloitte", src: "/lovable-uploads/deloitte-logo.png", alt: "Deloitte logo", className: "w-24 h-12 object-contain" },
  { name: "Accenture", src: "/lovable-uploads/accenture-logo.png", alt: "Accenture logo", className: "w-24 h-12 object-contain" },
  { name: "Kearney", src: "/lovable-uploads/kearney-logo.png", alt: "Kearney logo", className: "w-24 h-12 object-contain" }
];

export function LogoBrand({ className }: { className?: string }) {
  return (
    <section className={cn("py-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto bg-white", className)}>
      <motion.div 
        className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {logos.map((logo) => (
          <div 
            key={logo.name} 
            className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
          >
            {/* For now we'll use placeholder blocks since we don't have the actual logo images */}
            <div className={cn("bg-gray-200 rounded flex items-center justify-center", logo.className)}>
              <span className="text-gray-500 font-medium text-xs">{logo.name}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
