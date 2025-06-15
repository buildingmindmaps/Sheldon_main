import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronDown, ChevronUp, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Question } from './CaseInterview';
import { toast } from 'sonner';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { VoiceVisualizer } from './VoiceVisualizer';

interface QuestionPanelProps {
  questions: Question[];
  onAddQuestion: (question: string) => void;
  onUpdateFeedback: (questionId: number, feedback: Question['feedback']) => void;
  maxQuestions: number;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({
  questions,
  onAddQuestion,
  onUpdateFeedback,
  maxQuestions
}) => {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [expandedFeedback, setExpandedFeedback] = useState<number | null>(null);

  const { isRecording, start, stop, isSupported, volume } = useSpeechToText({
    onTranscript: (transcript) => {
      setCurrentQuestion(transcript);
    },
  });

  const handleMicClick = () => {
    if (isRecording) {
      stop();
    } else {
      start(currentQuestion);
    }
  };

  const handleSubmitQuestion = () => {
    if (currentQuestion.trim() && questions.length < maxQuestions) {
      onAddQuestion(currentQuestion.trim());
      setCurrentQuestion('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitQuestion();
    }
  };

  const getFeedbackDisplay = (feedback: Question['feedback']) => {
    switch (feedback) {
      case 'excellent':
        return { label: 'Excellent', className: 'bg-green-100 text-green-700 border-green-200' };
      case 'satisfactory':
        return { label: 'Satisfactory', className: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'needs-improvement':
        return { label: 'Needs Improvement', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
      case 'critical':
        return { label: 'Critical', className: 'bg-red-100 text-red-700 border-red-200' };
      default:
        return { label: 'Analyzing...', className: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
  };

  const toggleFeedbackExpansion = (questionId: number) => {
    setExpandedFeedback(expandedFeedback === questionId ? null : questionId);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Question List with dedicated scrollbar */}
      <div className="flex-1 overflow-y-auto p-6">
        {questions.length === 0 && currentQuestion.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg mb-2">No questions asked yet</p>
            <p className="text-sm">Start by asking your clarifying questions below</p>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((question, index) => {
              if (question.isLoading) {
                return (
                  <div key={question.id} className="space-y-3 animate-fade-in">
                    {/* Question */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Question {index + 1}:</span>
                      </div>
                      <p className="text-gray-800">{question.text}</p>
                    </div>

                    {/* Loading Answer */}
                    <div className="bg-blue-50 rounded-lg p-4 ml-4 border-l-4 border-blue-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
                      </div>
                    </div>
                  </div>
                );
              }

              const feedbackDisplay = getFeedbackDisplay(question.feedback);
              const isExpanded = expandedFeedback === question.id;
              
              return (
                <div key={question.id} className="space-y-3">
                  {/* Question */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Question {index + 1}:</span>
                    </div>
                    <p className="text-gray-800">{question.text}</p>
                  </div>

                  {/* Answer */}
                  <div className="bg-blue-50 rounded-lg p-4 ml-4 border-l-4 border-blue-200">
                    <p className="text-gray-800 mb-3">{question.answer}</p>
                    
                    {/* Auto-assigned Rating Badge */}
                    {question.feedback && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleFeedbackExpansion(question.id)}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border cursor-pointer hover:opacity-80 transition-opacity ${feedbackDisplay.className}`}
                        >
                          <span>{feedbackDisplay.label}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}

                    {/* Detailed Feedback Display */}
                    {isExpanded && question.evaluation && (
                      <div className="mt-3 p-3 bg-gray-100 rounded-lg border text-xs">
                        <h4 className="font-semibold text-gray-800 mb-2">Detailed Feedback:</h4>
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium text-gray-700">Relevance:</span>
                            <p className="text-gray-600 mt-1">{question.evaluation.relevance}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Depth:</span>
                            <p className="text-gray-600 mt-1">{question.evaluation.depth}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Constructive Feedback:</span>
                            <p className="text-gray-600 mt-1">{question.evaluation.constructiveFeedback}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center space-x-3">
          <div className="relative flex-grow">
            <Textarea
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your clarifying question or use the mic to dictate."
              className="min-h-[50px] resize-none py-3 pl-4 pr-14 w-full rounded-md"
              disabled={questions.length >= maxQuestions || isRecording}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleMicClick}
                disabled={!isSupported || questions.length >= maxQuestions}
                title={isRecording ? "Stop recording" : "Start recording"}
                className={`text-gray-500 hover:text-gray-700 ${isRecording ? 'p-0 rounded-full' : ''}`}
              >
                {isRecording ? (
                  <VoiceVisualizer volume={volume} />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
          <Button
            onClick={handleSubmitQuestion}
            disabled={!currentQuestion.trim() || questions.length >= maxQuestions || isRecording}
            className="bg-gray-800 hover:bg-gray-900 h-[50px] px-4 rounded-md flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
