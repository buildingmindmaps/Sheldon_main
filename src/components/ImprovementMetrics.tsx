
import React from 'react';
import { ArrowUp } from 'lucide-react';

export const ImprovementMetrics = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium">Speed</h4>
          <div className="flex items-center text-green-600">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span className="font-bold">20%</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">Faster problem-solving with structured approaches</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium">Accuracy</h4>
          <div className="flex items-center text-green-600">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span className="font-bold">30%</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">More precise insights and recommendations</p>
      </div>
    </div>
  );
};
