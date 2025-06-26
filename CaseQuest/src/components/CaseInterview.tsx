import React, { useState, useCallback, useEffect } from 'react';
import { Timer } from './Timer';
import { CaseStatement } from './CaseStatement';
import { QuestionPanel } from './QuestionPanel';
import { FrameworkModal } from './FrameworkModal';
import { ResultsView } from './ResultsView';
import { MobileCaseHeader } from './MobileCaseHeader';
import { FeedbackModal } from './FeedbackModal';
import { Button } from '@/components/ui/button';
import { generateResponseWithGemini } from '../services/geminiService';
import { useCasePractice } from '../../../src/contexts/CasePracticeContext';
import { toast } from 'sonner';
import { CaseModule } from '../types/case';


  export interface ConversationMessage {
  sender: 'user' | 'model';
  message: string;
}


export interface Question {
  id: number;
  text: string;
  answer: string;
  evaluation?: {
    relevance: string;
    depth: string;
    constructiveFeedback: string;
    rating?: string;
  };
  feedback?: 'excellent' | 'satisfactory' | 'needs-improvement' | 'critical';
  isLoading?: boolean;
}

interface CaseData {
  id?: string;
  questions: Question[];
  timeElapsed: number;
  frameworkText: string;
  isCompleted: boolean;
  conversation: ConversationMessage[];
  caseFacts: string[];
  caseStatement: string;
}

interface CaseInterviewProps {
  onBack?: () => void;
  caseModuleData: CaseModule;
}

export const CaseInterview: React.FC<CaseInterviewProps> = ({ onBack, caseModuleData }) => {
  const { state, actions } = useCasePractice();
  const [isFrameworkModalOpen, setIsFrameworkModalOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  

  useEffect(() => {
    if (caseModuleData) {
      actions.startCase({
        caseId: caseModuleData._id,
        caseTitle: caseModuleData.title,
        caseDifficulty: caseModuleData.level,
        caseStatement: Array.isArray(caseModuleData.caseStatement) ? caseModuleData.caseStatement : [caseModuleData.caseStatement],
      });
    }
  }, [caseModuleData, actions]);

  const caseInstructions = [
    "Analyze the provided data packs thoroughly.",
    "Formulate clarifying questions to gather more information.",
    "Structure your approach logically.",
    "Develop a logical framework—a structured way to break down the problem.",
    "Be prepared to present your analysis and recommendations clearly.",
    "Time management is key. Allocate your time wisely."
  ];



  const onTimeUpdate = useCallback((newTime: number) => {
    setTimeElapsed(newTime);
  }, []);

  const handleAddQuestion = useCallback(async (questionText: string) => {
    if (state.questions.length >= 10) {
      toast.info("You have reached the maximum number of questions.");
      return;
    }
    if (!state.currentSession) {
      toast.error("No active case session. Please refresh the page.");
      return;
    }

    try {
      const geminiResponse = await generateResponseWithGemini(
        questionText,
        caseModuleData.caseStatement,
        caseModuleData.caseFacts || [],
        caseModuleData.caseConversation,
      );

      if (!geminiResponse) {
        toast.error("Received an empty response from the AI. Please try again.");
        return;
      }

      await actions.addQuestionAndResponse({
        questionNumber: state.questions.length + 1,
        userQuestion: questionText,
        aiResponse: geminiResponse.answer,
        feedback: {
          rating: geminiResponse.rating,
          relevance: geminiResponse.evaluation?.relevance || '',
          depth: geminiResponse.evaluation?.depth || '',
          constructiveFeedback: geminiResponse.evaluation?.constructiveFeedback || '',
        }
      });

      setConversation(prev => [
        ...prev,
        { sender: 'user', message: questionText },
        { sender: 'model', message: geminiResponse.answer }
      ]);

    } catch (error) {
      console.error('[handleAddQuestion] Error during question submission or saving:', error);
      toast.error("There was an error getting a response from the AI.");
    }
  }, [caseModuleData.caseStatement, caseModuleData.caseFacts, state.currentSession, state.questions.length, actions]);

  const handleUpdateFeedback = (questionId: number, feedback: Question['feedback']) => {
    actions.updateQuestionFeedback(questionId, feedback);
  };

  const handleFrameworkSubmit = async (framework: string) => {
    try {
      if (state.currentSession) {
        await actions.submitFramework(framework);
        setIsCompleted(true);
        setIsFrameworkModalOpen(false);
      } else {
        toast.error("No active case session to submit framework.");
      }
    } catch (error) {
      console.error('[CaseInterview] Failed to submit framework:', error);
      toast.error("Could not submit your framework. Please try again.");
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setShowFeedbackModal(true);
    }
  };

  const handleFeedbackClose = () => {
    setShowFeedbackModal(false);
    window.history.back();
  };

  const canSubmitFramework = state.currentSession && (state.questions.length >= 2 || state.questions.length >= 10);

  if (isCompleted) {
    return (
      <ResultsView
        caseData={{
          id: caseModuleData._id,
          questions: state.questions,
          timeElapsed,
          frameworkText: state.framework || '',
          isCompleted: true,
          conversation,
          caseFacts: caseModuleData.caseFacts || [],
          caseStatement: caseModuleData.caseStatement,
        }}
        caseStatement={caseModuleData.caseStatement}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {state.loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-xl">Saving to database...</div>
        </div>
      )}

      <div className="lg:hidden h-screen flex flex-col">
        <MobileCaseHeader
          statement={caseModuleData.caseStatement}
          instructions={caseInstructions}
          timeElapsed={timeElapsed}
          onTimeUpdate={onTimeUpdate}
          isCompleted={isCompleted}
          questionCount={state.questions.length}
          onBack={handleBack}
        />
        <div className="flex-1 overflow-y-auto">
          <QuestionPanel
            questions={state.questions}
            onAddQuestion={handleAddQuestion}
            onUpdateFeedback={handleUpdateFeedback}
            maxQuestions={10}
            isLoading={state.loading}
          />
        </div>
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

      <div className="hidden lg:flex h-screen">
        <div className="flex-1 bg-white border-r border-gray-200 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <QuestionPanel
              questions={state.questions}
              onAddQuestion={handleAddQuestion}
              onUpdateFeedback={handleUpdateFeedback}
              maxQuestions={10}
              isLoading={state.loading}
            />
          </div>
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
            statement={caseModuleData.caseStatement}
            instructions={caseInstructions}
          />
        </div>
      </div>

      <FrameworkModal
        isOpen={isFrameworkModalOpen}
        onClose={() => setIsFrameworkModalOpen(false)}
        onSubmit={handleFrameworkSubmit}
        isLoading={state.loading}
      />
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={handleFeedbackClose}
      />
    </div>
  );
};
