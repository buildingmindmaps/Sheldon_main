import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Corrected import paths: Assuming ResultsView.tsx is in the SAME directory
// as SolvedCaseTab.tsx, ReviewTab.tsx, FrameworkTab.tsx, and FeedbackModal.tsx
import { SolvedCaseTab } from './SolvedCaseTab';
import { ReviewTab } from './ReviewTab';
import { FrameworkTab } from './FrameworkTab';
import { FeedbackModal } from './FeedbackModal'; 
// Corrected import path for CaseData, Question, ConversationMessage
// It's crucial that this 'types/case' file accurately defines the CaseData interface
import type { Question, ConversationMessage, CaseData } from './CaseInterview'; // Assuming types are one level up in 'types' directory
import { useNavigate } from 'react-router-dom';

// Note: The CaseData interface itself is now directly imported from '../types/case'.
// No local re-definition is needed here as that file should be the single source of truth.

interface ResultsViewProps {
  caseData: CaseData; 
  caseStatement: string; 
  onComplete?: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ 
  caseData, 
  caseStatement, 
  onComplete 
}) => {
  const [timeElapsed, setTimeElapsed] = useState(caseData.timeElapsed);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const navigate = useNavigate();

  const caseInstructions = [
    "Analyze the provided data packs thoroughly.",
    "Formulate clarifying questions to gather more information.",
    "Structure your approach logically (e.g., profitability framework, market sizing).",
    "Develop actionable recommendations based on your findings.",
    "Be prepared to present your analysis and recommendations clearly.",
    "Time management is key. Allocate your time wisely across different phases of the case."
  ];

  const handleCompleteCase = async () => {
    if (onComplete) {
      setIsCompleting(true);
      try {
        await onComplete(); // Call the backend completion
        setShowFeedbackModal(true);
      } catch (error) {
        console.error('Failed to complete case:', error);
        // Handle error appropriately
      } finally {
        setIsCompleting(false);
      }
    } else {
      setShowFeedbackModal(true);
    }
  };

  const handleFeedbackClose = () => {
    setShowFeedbackModal(false);
    
    const completedCaseId = caseData.id;

    // Read existing data from localStorage
    const storedCases = localStorage.getItem('caseStudiesData');
    if (storedCases) {
      let cases = JSON.parse(storedCases);

      // Find current case index
      const completedCaseIndex = cases.findIndex((c: any) => c.id === completedCaseId);

      if (completedCaseIndex > -1) {
        // Unlock the current case (just in case)
        cases[completedCaseIndex].isLocked = false;

        // Unlock the next case if available
        if (completedCaseIndex < cases.length - 1) {
          cases[completedCaseIndex + 1].isLocked = false;
        }

        // Save back to localStorage
        localStorage.setItem('caseStudiesData', JSON.stringify(cases));
      }
    }

    // Navigate back
    navigate('/all-courses/case-practice');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading overlay during case completion */}
      {isCompleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-xl">Completing case...</div>
        </div>
      )}

      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="h-screen">
          <Tabs defaultValue="framework" className="w-full h-full flex flex-col">
            <div className="px-4 pt-4 flex flex-col items-center">
              <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 gap-1">
                <TabsTrigger
                  value="solved-case"
                  className="text-slate-600 hover:bg-gray-100 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm rounded-lg"
                >
                  Solved Case
                </TabsTrigger>
                <TabsTrigger
                  value="review"
                  className="text-slate-600 hover:bg-gray-100 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm rounded-lg"
                >
                  Review
                </TabsTrigger>
                <TabsTrigger
                  value="framework"
                  className="text-slate-600 hover:bg-gray-100 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm rounded-lg"
                >
                  Framework
                </TabsTrigger>
              </TabsList>
              <div className="mt-4 w-full">
                <button
                  onClick={handleCompleteCase}
                  disabled={isCompleting}
                  className="w-full px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isCompleting ? 'Completing...' : 'Complete Case'}
                </button>
              </div>
            </div>

            <TabsContent value="solved-case" className="mt-0 flex-1 overflow-y-auto">
              <SolvedCaseTab questions={caseData.questions} caseStatement={caseStatement} />
            </TabsContent>

            <TabsContent value="review" className="mt-0 flex-1 overflow-y-auto">
              <ReviewTab caseData={caseData} />
            </TabsContent>

            <TabsContent value="framework" className="mt-0 flex-1 overflow-y-auto">
              <FrameworkTab
                frameworkText={caseData.frameworkText}
                questions={caseData.questions}
                caseStatement={caseStatement}
                conversation={caseData.conversation}
                caseFacts={caseData.caseFacts}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen justify-center">
        <div className="w-full max-w-4xl bg-white flex flex-col">
          <Tabs defaultValue="framework" className="w-full h-full flex flex-col">
            <div className="border-b border-gray-200 px-6 pt-6 flex justify-between items-center">
              <TabsList className="grid grid-cols-3 max-w-2xl w-full bg-transparent p-0 gap-1">
                <TabsTrigger
                  value="solved-case"
                  className="text-slate-600 hover:bg-gray-100 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm rounded-lg"
                >
                  Solved Case
                </TabsTrigger>
                <TabsTrigger
                  value="review"
                  className="text-slate-600 hover:bg-gray-100 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm rounded-lg"
                >
                  Review
                </TabsTrigger>
                <TabsTrigger
                  value="framework"
                  className="text-slate-600 hover:bg-gray-100 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm rounded-lg"
                >
                  Framework
                </TabsTrigger>
              </TabsList>
              <button
                onClick={handleCompleteCase}
                disabled={isCompleting}
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isCompleting ? 'Completing...' : 'Complete Case'}
              </button>
            </div>

            <div className="flex-1 flex justify-center overflow-y-auto">
              <div className="w-full max-w-3xl">
                <TabsContent value="solved-case" className="mt-0 h-full">
                  <SolvedCaseTab questions={caseData.questions} caseStatement={caseStatement} />
                </TabsContent>

                <TabsContent value="review" className="mt-0 h-full">
                  <ReviewTab caseData={caseData} />
                </TabsContent>

                <TabsContent value="framework" className="mt-0 h-full">
                  <FrameworkTab
                    frameworkText={caseData.frameworkText}
                    questions={caseData.questions}
                    caseStatement={caseStatement}
                    conversation={caseData.conversation}
                    caseFacts={caseData.caseFacts}
                  />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>

      <FeedbackModal 
        isOpen={showFeedbackModal} 
        onClose={handleFeedbackClose} 
      />
    </div>
  );
};
