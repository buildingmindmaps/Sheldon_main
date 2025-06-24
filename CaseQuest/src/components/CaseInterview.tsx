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

export interface ConversationMessage {
  sender: 'user' | 'model';
  message: string;
}

export interface CaseData {
  id?: number;
  questions: Question[];
  timeElapsed: number;
  frameworkText: string;
  isCompleted: boolean;
  conversation: ConversationMessage[];
}

export const CaseInterview = () => {
  const { state, actions } = useCasePractice();
  const [isFrameworkModalOpen, setIsFrameworkModalOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const caseId = 3;
  const caseStatement = `Your client is a water purifier manufacturer in India, focused on residential customers. The client is experiencing lower profitability (defined as EBITDA/Revenue) compared to competitors. They have hired you to analyze the issue and provide recommendations.`;

  const caseInstructions = [
    "Analyze the provided data packs thoroughly.",
    "Formulate clarifying questions to gather more information.",
    "Structure your approach logically.",
    "Develop a logical framework—a structured way to break down the problem into smaller parts",
    "Be prepared to present your analysis and recommendations clearly.",
    "Time management is key. Allocate your time wisely across different phases of the case."
  ];

  // LOGGING FOR SESSION START
  useEffect(() => {
    console.log('[CaseInterview - useEffect] Checking session status. Current state.currentSession:', state.currentSession);
    if (!state.currentSession) {
      console.log('[CaseInterview - useEffect] No active session found, attempting to start a new one...');
      actions.startCase({
        caseId: "water-purifier-case",
        caseTitle: "Water Purifier Profitability",
        caseDifficulty: "Beginner",
        caseStatement: caseStatement
      }).then(sessionData => {
        console.log('[CaseInterview - useEffect] Case session started successfully:', sessionData);
      }).catch(error => {
        console.error('[CaseInterview - useEffect] Failed to start case session:', error);
        toast.error("Could not start a new case session. Please try again.");
      });
    } else {
      console.log('[CaseInterview - useEffect] Session already active with ID:', state.currentSession._id);
    }
  }, [actions, state.currentSession, caseStatement]);

  const onTimeUpdate = useCallback((newTime: number) => {
    setTimeElapsed(newTime);
  }, []);

  const handleAddQuestion = async (questionText: string) => {
    // IMMEDIATE LOGGING
    console.log('--- handleAddQuestion triggered ---');
    console.log('[handleAddQuestion] User question submitted:', questionText);
    console.log('[handleAddQuestion] Current state.currentSession:', state.currentSession); // Log current session state immediately

    if (state.questions.length >= 10) {
      toast.info("You have reached the maximum number of questions.");
      console.log('[handleAddQuestion] Max questions reached.');
      return;
    }
    if (!state.currentSession) {
      toast.error("No active case session. Please refresh the page.");
      console.error('[handleAddQuestion] No active session found for adding question. Cannot proceed.');
      return;
    }

    try {
      // Log before calling Gemini service
      console.log('[handleAddQuestion] Calling generateResponseWithGemini...');
      const geminiResponse = await generateResponseWithGemini(questionText);
      console.log('[handleAddQuestion] Received Gemini response:', geminiResponse);

      if (!geminiResponse) {
        toast.error("Received an empty response from the AI. Please try again.");
        console.error("[handleAddQuestion] generateResponseWithGemini returned an undefined or null response.");
        return;
      }

      // Log before calling backend API via context
      console.log('[handleAddQuestion] Calling actions.addQuestionAndResponse...');
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
      console.log('[handleAddQuestion] actions.addQuestionAndResponse called successfully.'); // After successful context action

      setConversation(prev => [
        ...prev,
        { sender: 'user', message: questionText },
        { sender: 'model', message: geminiResponse.answer }
      ]);

    } catch (error) {
      console.error('[handleAddQuestion] Error during question submission or saving:', error);
      toast.error("There was an error getting a response or saving your question.");
    } finally {
      console.log('--- handleAddQuestion finished ---');
    }
  };

  const handleUpdateFeedback = (questionId: number, feedback: Question['feedback']) => {
    console.log('[CaseInterview] Updating feedback for question:', questionId, feedback);
    actions.updateQuestionFeedback(questionId, feedback);
  };

  const handleFrameworkSubmit = async (framework: string) => {
    console.log('[CaseInterview] Attempting to submit framework...');
    try {
      if (state.currentSession) {
        await actions.submitFramework(framework);
        setIsCompleted(true);
        setIsFrameworkModalOpen(false);
        console.log('[CaseInterview] Framework submitted and case marked completed.');
      } else {
        console.warn('[CaseInterview] No active session to submit framework to.');
        toast.error("No active case session to submit framework.");
      }
    } catch (error) {
      console.error('[CaseInterview] Failed to submit framework:', error);
      toast.error("Could not submit your framework. Please try again.");
    }
  };

  const handleBack = () => {
    setShowFeedbackModal(true);
  };

  const handleFeedbackClose = () => {
    setShowFeedbackModal(false);
    window.history.back();
  };

  const handleCaseComplete = async () => {
    console.log('[CaseInterview] Attempting to complete case...');
    try {
      if (state.currentSession) {
        const completionData = {
          performanceMetrics: {
            overallRating: 8,
            structure: 7,
            problemFormulation: 8,
            communication: 8,
            confidence: 7,
            questionsAsked: state.questions.length,
            excellentQuestions: state.questions.filter(q => q.feedback === 'excellent').length,
            timeTaken: `${Math.floor(timeElapsed / 60)}m ${timeElapsed % 60}s`,
            frameworkSubmitted: state.isFrameworkSubmitted, // Use actual state
          },
          areasForImprovement: state.questions
            .filter(q => q.feedback === 'needs-improvement' || q.feedback === 'critical')
            .map(q => ({
              category: "Question Quality",
              feedback: q.evaluation?.constructiveFeedback || "Needs improvement"
            })),
          totalTimeSpent: timeElapsed
        };

        await actions.completeCase(completionData);
        console.log('[CaseInterview] Case completed successfully.');
      } else {
        console.warn('[CaseInterview] No active session to complete.');
        toast.error("No active case session to complete.");
      }
    } catch (error) {
      console.error('[CaseInterview] Failed to complete case:', error);
      toast.error("Could not complete the case. Please try again.");
    }
  };

  // Adjust this logic to be robust based on state.currentSession
  const canSubmitFramework = state.currentSession && (state.questions.length >= 2 || state.questions.length >= 10);

  if (state.loading && !state.currentSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Starting case session...</div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Error: {state.error}</div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <ResultsView
        caseData={{
          id: caseId,
          questions: state.questions,
          timeElapsed,
          frameworkText: state.framework || '',
          isCompleted: true,
          conversation,
        }}
        caseStatement={caseStatement}
        onComplete={handleCaseComplete}
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

      {/* Mobile Layout */}
      <div className="lg:hidden h-screen flex flex-col">
        <MobileCaseHeader
          statement={caseStatement}
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

      {/* Desktop Layout */}
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
            statement={caseStatement}
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
