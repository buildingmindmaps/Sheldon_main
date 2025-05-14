
import React from 'react';
import { FeatureCard } from './FeatureCard';
import { BookText, BarChart3, Users, Briefcase } from "lucide-react";
import { LiveBattleFeature } from './LiveBattleFeature';

export function InteractiveFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <FeatureCard 
        title="AI-Powered Case Interviews" 
        description="Practice with our AI interviewer that adapts to your skill level and provides real-time feedback on your responses."
        icon={<BookText className="w-6 h-6" />}
      />
      
      <FeatureCard 
        title="Structured Frameworks" 
        description="Learn proven frameworks for approaching different types of business problems, from market sizing to profitability analysis."
        icon={<BarChart3 className="w-6 h-6" />}
      />
      
      <LiveBattleFeature />
      
      <FeatureCard 
        title="Industry-Specific Cases" 
        description="Practice with cases tailored to your target industry, from technology to healthcare to consumer goods."
        icon={<Briefcase className="w-6 h-6" />}
      />
    </div>
  );
}
