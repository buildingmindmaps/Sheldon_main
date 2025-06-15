
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CaseStatementProps {
  statement: string;
  instructions: string[];
}

export const CaseStatement: React.FC<CaseStatementProps> = ({ statement, instructions }) => {
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Case Statement */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Case Statement</h3>
        <p className="text-gray-600 leading-relaxed text-sm">{statement}</p>
      </div>

      {/* Case Instructions */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <button
          onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900">Case Instructions</h3>
          {isInstructionsOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {isInstructionsOpen && (
          <div className="mt-3 space-y-2">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-gray-400 text-sm mt-1">•</span>
                <p className="text-gray-600 text-sm leading-relaxed">{instruction}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
