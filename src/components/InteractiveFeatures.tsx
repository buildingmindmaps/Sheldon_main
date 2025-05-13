
import React from 'react';
import { FeatureCard } from './FeatureCard';
import { BookText, BarChart3, Users } from "lucide-react";
import { BattleFeature } from './BattleFeature';
import { StandardDeviationCurve } from './StandardDeviationCurve';
import { ImprovementMetrics } from './ImprovementMetrics';

export const InteractiveFeatures = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <FeatureCard
          icon={<BookText />}
          title="Personalized Feedback"
          description="Receive detailed, actionable insights on your performance to improve with every session."
        />
      </div>
      
      <div>
        <BattleFeature />
      </div>
      
      <div className="space-y-4">
        <StandardDeviationCurve />
        <ImprovementMetrics />
      </div>
    </div>
  );
};
