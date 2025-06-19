import React, { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Timer } from './Timer';
import { CaseStatement } from './CaseStatement';
import { QuestionPanel } from './QuestionPanel';
import { FrameworkModal } from './FrameworkModal';
import { ResultsView } from './ResultsView';
import { MobileCaseHeader } from './MobileCaseHeader';
import { Button } from '@/components/ui/button';
import { generateResponseWithGemini } from '../services/geminiService';

export interface Question {
  id: number;
  text: string;
  answer: string;
  evaluation?: {
    relevance: string;
    depth: string;
    constructiveFeedback: string;
  };
  feedback?: 'excellent' | 'satisfactory' | 'needs-improvement' | 'critical';
  isLoading?: boolean;
}

export interface ConversationMessage {
  sender: 'user' | 'model';
  message: string;
}

export interface CaseData {
  questions: Question[];
  timeElapsed: number;
  frameworkText: string;
  isCompleted: boolean;
  conversation: ConversationMessage[];
}

interface CaseInterviewProps {
  onBack: () => void;
}

export const CaseInterview: React.FC<CaseInterviewProps> = ({ onBack }) => {
  const location = useLocation();
  const caseData = location.state?.caseData;
  const caseId = caseData?.id || 3; // Default to Water Purifier case if no data
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isFrameworkModalOpen, setIsFrameworkModalOpen] = useState(false);
  const [frameworkText, setFrameworkText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);

  const caseStatement = `Your client is a water purifier manufacturer in India, focused on residential customers. The client is experiencing lower profitability (defined as EBITDA/Revenue) compared to competitors. They have hired you to analyze the issue and provide recommendations.`;

  const caseInstructions = [
    "Analyze the provided data packs thoroughly.",
    "Formulate clarifying questions to gather more information.",
    "Structure your approach logically.",
    "Develop a logical framework—a structured way to break down the problem into smaller parts",
    "Be prepared to present your analysis and recommendations clearly.",
    "Time management is key. Allocate your time wisely across different phases of the case."
  ];

  const onTimeUpdate = useCallback((newTime: number) => {
    setTimeElapsed(newTime);
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  const handleAddQuestion = async (questionText: string) => {
    if (questions.length >= 10) return;

    const tempId = Date.now();
    const tempQuestion: Question = {
      id: tempId,
      text: questionText,
      answer: '',
      isLoading: true,
    };

    setQuestions(prev => [...prev, tempQuestion]);
    setConversation(prev => [...prev, { sender: 'user', message: questionText }]);

    try {
      let streamedAnswer = '';
      
      const geminiResponse = await generateResponseWithGemini(
        questionText,
        (chunk: string) => {
          streamedAnswer += chunk;
          // Update the question with the streaming response
          setQuestions(prev => prev.map(q => 
            q.id === tempId 
              ? { ...q, answer: streamedAnswer, isLoading: true }
              : q
          ));
        }
      );
      
      // Final update with complete response and evaluation
      const newQuestion: Question = {
        id: tempId,
        text: questionText,
        answer: geminiResponse.answer,
        evaluation: geminiResponse.evaluation,
        feedback: geminiResponse.rating,
        isLoading: false,
      };

      setQuestions(prev => prev.map(q => q.id === tempId ? newQuestion : q));
      setConversation(prev => [...prev, { sender: 'model', message: geminiResponse.answer }]);
    } catch (error) {
      console.error('Error generating response:', error);
      
      const errorQuestion: Question = {
        id: tempId,
        text: questionText,
        answer: "I'm sorry, there was an error generating a response. Please try again.",
        feedback: 'needs-improvement',
        isLoading: false,
      };

      setQuestions(prev => prev.map(q => q.id === tempId ? errorQuestion : q));
      setConversation(prev => [...prev, { sender: 'model', message: "I'm sorry, there was an error generating a response. Please try again." }]);
    }
  };

  const handleUpdateFeedback = (questionId: number, feedback: Question['feedback']) => {
    setQuestions(prev => 
      prev.map(q => q.id === questionId ? { ...q, feedback } : q)
    );
  };

  const handleFrameworkSubmit = (framework: string) => {
    setFrameworkText(framework);
    setIsCompleted(true);
    setIsFrameworkModalOpen(false);
  };

  const canSubmitFramework = questions.length >= 2 || questions.length >= 10;

  if (isCompleted) {
    return (
      <ResultsView 
        caseData={{
          id: caseId,
          questions,
          timeElapsed,
          frameworkText,
          isCompleted: true,
          conversation,
        }}
        caseStatement={caseStatement}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="hidden lg:flex bg-white border-b px-4 py-3 items-center justify-between sticky top-0 z-20">
            <Button 
                variant="outline" 
                onClick={onBack}
                className="p-1"
            >
                <div className="rounded">
                    <ArrowLeft className="h-4 w-4" />
                </div>
            </Button>
            <h1 className="text-xl font-semibold text-center">Case Practice: Water Purifier</h1>
            <div className="w-36"></div>
        </div>

      {/* Mobile Layout */}
      <div className="block lg:hidden h-screen flex flex-col">
        <MobileCaseHeader 
          statement={caseStatement}
          instructions={caseInstructions}
          timeElapsed={timeElapsed}
          onTimeUpdate={onTimeUpdate}
          isCompleted={isCompleted}
          questionCount={questions.length}
          onBack={onBack}
        />

        <QuestionPanel 
          questions={questions}
          onAddQuestion={handleAddQuestion}
          onUpdateFeedback={handleUpdateFeedback}
          maxQuestions={10}
        />
        
        {canSubmitFramework && (
          <div className="p-3 border-t border-gray-200 bg-white">
            <Button 
              onClick={() => setIsFrameworkModalOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10"
            >
              Submit Framework
            </Button>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-[calc(100vh-61px)]">
        <div className="flex-1 bg-white border-r border-gray-200 flex flex-col">
          <QuestionPanel 
            questions={questions}
            onAddQuestion={handleAddQuestion}
            onUpdateFeedback={handleUpdateFeedback}
            maxQuestions={10}
          />
          
          {canSubmitFramework && (
            <div className="p-6 border-t border-gray-200 bg-white">
              <Button 
                onClick={() => setIsFrameworkModalOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Submit Framework
              </Button>
            </div>
          )}
        </div>

        <div className="w-96 bg-gray-50 p-6 flex flex-col">
          <Timer 
            timeElapsed={timeElapsed}
            onTimeUpdate={onTimeUpdate}
            isCompleted={isCompleted}
          />
          
          <CaseStatement 
            statement={caseStatement}
            instructions={caseInstructions}
          />
        </div>
      </div>

      <FrameworkModal 
        isOpen={isFrameworkModalOpen}
        onClose={() => setIsFrameworkModalOpen(false)}
        onSubmit={handleFrameworkSubmit}
      />
    </div>
  );
};
