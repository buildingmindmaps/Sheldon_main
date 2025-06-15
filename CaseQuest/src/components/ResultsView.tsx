
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SolvedCaseTab } from './SolvedCaseTab';
import { ReviewTab } from './ReviewTab';
import { FrameworkTab } from './FrameworkTab';
import { Timer } from './Timer';
import { CaseStatement } from './CaseStatement';
import type { CaseData } from './CaseInterview';

interface ResultsViewProps {
  caseData: CaseData;
  caseStatement: string;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ caseData, caseStatement }) => {
  const [timeElapsed, setTimeElapsed] = useState(caseData.timeElapsed);

  const caseInstructions = [
    "Analyze the provided data packs thoroughly.",
    "Formulate clarifying questions to gather more information.",
    "Structure your approach logically (e.g., profitability framework, market sizing).",
    "Develop actionable recommendations based on your findings.",
    "Be prepared to present your analysis and recommendations clearly.",
    "Time management is key. Allocate your time wisely across different phases of the case."
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        {/* Results Tabs - Full height on mobile with transparent header */}
        <div className="h-screen">
          <Tabs defaultValue="framework" className="w-full h-full flex flex-col">
            <div className="px-4 pt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger 
                  value="solved-case"
                  className="text-slate-600 hover:bg-slate-200 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                >
                  Solved Case
                </TabsTrigger>
                <TabsTrigger 
                  value="review"
                  className="text-slate-600 hover:bg-slate-200 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                >
                  Review
                </TabsTrigger>
                <TabsTrigger 
                  value="framework"
                  className="text-slate-600 hover:bg-slate-200 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                >
                  Framework
                </TabsTrigger>
              </TabsList>
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
                conversation={caseData.conversation} // Pass conversation data here
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen justify-center">
        {/* Centered Content with max-width */}
        <div className="w-full max-w-4xl bg-white flex flex-col">
          <Tabs defaultValue="framework" className="w-full h-full flex flex-col">
            <div className="border-b border-gray-200 px-6 pt-6 flex justify-center">
              <TabsList className="grid grid-cols-3 max-w-2xl w-full">
                <TabsTrigger 
                  value="solved-case"
                  className="text-slate-600 hover:bg-slate-200 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                >
                  Solved Case
                </TabsTrigger>
                <TabsTrigger 
                  value="review"
                  className="text-slate-600 hover:bg-slate-200 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                >
                  Review
                </TabsTrigger>
                <TabsTrigger 
                  value="framework"
                  className="text-slate-600 hover:bg-slate-200 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                >
                  Framework
                </TabsTrigger>
              </TabsList>
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
                    conversation={caseData.conversation} // Pass conversation data here
                  />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
