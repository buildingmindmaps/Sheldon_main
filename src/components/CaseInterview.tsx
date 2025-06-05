
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CaseInterviewProps {
  onBack: () => void;
}

export function CaseInterview({ onBack }: CaseInterviewProps) {
  const [currentInput, setCurrentInput] = useState('');
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || isLoading) return;

    const userQuestion = currentInput.trim();
    setCurrentInput('');
    setIsLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      setQuestionsAsked(prev => prev + 1);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-medium">Case Sprint: Water Purifier</h1>
            <p className="text-sm text-gray-600">Hone your consulting skills with AI-driven scenarios.</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Case Statement */}
        <div className="bg-white rounded-lg border-2 border-blue-200 p-6 mb-8">
          <h2 className="text-xl font-medium text-blue-600 mb-4">Case Statement:</h2>
          <p className="text-gray-800 leading-relaxed">
            Your client is a water purifier manufacturer in India, focused on residential customers. The client is 
            experiencing lower profitability (defined as EBITDA/Revenue) compared to competitors. They have 
            hired you to analyze the issue and provide recommendations.
          </p>
        </div>

        {/* Question Interface */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">Questions asked: {questionsAsked}/10</p>
            
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Ask a clarifying question..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!currentInput.trim() || isLoading}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
            </form>
          </div>

          {/* Previous questions/answers would be displayed here */}
          {questionsAsked > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                You've asked {questionsAsked} question{questionsAsked > 1 ? 's' : ''}. 
                Continue asking clarifying questions to understand the case better.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
