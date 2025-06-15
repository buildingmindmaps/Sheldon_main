
import React, { useState, useEffect } from 'react';
import { Info, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { Timer } from './Timer';
import { Button } from '@/components/ui/button';

interface MobileCaseHeaderProps {
  statement: string;
  instructions: string[];
  timeElapsed: number;
  onTimeUpdate: (time: number) => void;
  isCompleted: boolean;
  questionCount?: number;
  onBack: () => void;
}

export const MobileCaseHeader: React.FC<MobileCaseHeaderProps> = ({
  statement,
  instructions,
  timeElapsed,
  onTimeUpdate,
  isCompleted,
  questionCount = 0,
  onBack,
}) => {
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isCaseStatementOpen, setIsCaseStatementOpen] = useState(true); // Open by default

  // Close case statement dropdown when second question is entered
  useEffect(() => {
    if (questionCount >= 2) {
      setIsCaseStatementOpen(false);
    }
  }, [questionCount]);

  // Close instructions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isInstructionsOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.instructions-popup') && !target.closest('.info-button')) {
          setIsInstructionsOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isInstructionsOpen]);

  return (
    <div className="bg-white border-b border-gray-200 relative">
      <div className="p-3">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 -ml-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <span className="text-base font-bold text-gray-700">Time:</span>
            <span className="text-base font-bold text-red-500 font-mono">
              {Math.floor(timeElapsed / 60).toString().padStart(2, '0')}:{(timeElapsed % 60).toString().padStart(2, '0')}
            </span>
            
            <button
              onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
              className="info-button w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:bg-yellow-500 transition-colors"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Case Statement Dropdown */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <button
            onClick={() => setIsCaseStatementOpen(!isCaseStatementOpen)}
            className="flex items-center justify-between w-full py-1.5 px-3 text-left"
          >
            <h3 className="text-sm font-semibold text-gray-900">Case Statement</h3>
            {isCaseStatementOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {isCaseStatementOpen && (
            <div className="px-3 pb-2">
              <p className="text-gray-600 leading-relaxed text-xs">{statement}</p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions Popup Overlay */}
      {isInstructionsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="instructions-popup bg-white rounded-xl border border-gray-200 shadow-lg max-w-sm w-full max-h-96 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Case Instructions</h3>
                <button
                  onClick={() => setIsInstructionsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2">
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-gray-400 text-sm mt-1">•</span>
                    <p className="text-gray-600 text-sm leading-relaxed">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
