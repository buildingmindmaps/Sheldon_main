
import React from 'react';
import type { Question } from './CaseInterview';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SolvedCaseTabProps {
  questions: Question[];
  caseStatement: string;
}

export const SolvedCaseTab: React.FC<SolvedCaseTabProps> = ({ questions, caseStatement }) => {
  const getFeedbackDisplay = (feedback: Question['feedback']) => {
    switch (feedback) {
      case 'excellent':
        return { label: 'Excellent', className: 'bg-green-100 text-green-700' };
      case 'satisfactory':
        return { label: 'Satisfactory', className: 'bg-blue-100 text-blue-700' };
      case 'needs-improvement':
        return { label: 'Needs Improvement', className: 'bg-yellow-100 text-yellow-700' };
      case 'critical':
        return { label: 'Critical', className: 'bg-red-100 text-red-700' };
      default:
        return null;
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Case Statement</h3>
          <p className="text-gray-600 leading-relaxed">{caseStatement}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Questions and Answers</h3>
          
          {questions.map((question, index) => {
            const feedbackDisplay = getFeedbackDisplay(question.feedback);
            
            return (
              <div key={question.id} className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Question {index + 1}:</span>
                    {feedbackDisplay && (
                      <>
                        {question.evaluation ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <span className={`text-xs px-2 py-1 rounded-full cursor-pointer hover:ring-2 hover:ring-offset-1 ${feedbackDisplay.className}`}>
                                {feedbackDisplay.label}
                              </span>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="grid gap-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium leading-none">Detailed Feedback</h4>
                                </div>
                                <div className="grid gap-2 text-sm">
                                  <p><span className="font-semibold">Relevance:</span> {question.evaluation.relevance}</p>
                                  <p><span className="font-semibold">Depth:</span> {question.evaluation.depth}</p>
                                  <div>
                                    <p className="font-semibold">Constructive Feedback:</p>
                                    <p className="text-muted-foreground">{question.evaluation.constructiveFeedback}</p>
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <span className={`text-xs px-2 py-1 rounded-full ${feedbackDisplay.className}`}>
                            {feedbackDisplay.label}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <p className="text-gray-800">{question.text}</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 ml-4 border-l-4 border-blue-200">
                  <span className="text-sm font-medium text-blue-700 block mb-2">Answer:</span>
                  <p className="text-gray-800">{question.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
