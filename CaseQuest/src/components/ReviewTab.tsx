import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { generateReviewScores, type ReviewScores } from '../services/analysisService';
import type { CaseData } from './CaseInterview';

interface ReviewTabProps {
  caseData: CaseData;
}

export const ReviewTab: React.FC<ReviewTabProps> = ({ caseData }) => {
  const [scores, setScores] = useState<ReviewScores | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Very Good';
    if (score >= 4) return 'Good';
    if (score >= 3) return 'Needs Improvement';
    return 'Room to Grow';
  };

  // Generate dynamic scores
  useEffect(() => {
    const generateScores = async () => {
      setIsLoading(true);
      try {
        const reviewScores = await generateReviewScores(
            caseData.questions,
            caseData.frameworkText,
            caseData.timeElapsed,
            "Your client is a water purifier manufacturer in India, focused on residential customers. The client is experiencing lower profitability (defined as EBITDA/Revenue) compared to competitors.",
            caseData.conversation // Added this line to pass conversation data
        );
        setScores(reviewScores);
      } catch (error) {
        console.error('Error generating scores:', error);
        // Fallback to static calculation
        const calculateFallbackScores = (): ReviewScores => {
          const questionCount = caseData.questions.length;
          const excellentCount = caseData.questions.filter(q => q.feedback === 'excellent').length;
          const satisfactoryCount = caseData.questions.filter(q => q.feedback === 'satisfactory').length;

          const structure = caseData.frameworkText.length > 100 ? 7 : 5;
          const problemFormulation = questionCount >= 5 ? 7 : Math.max(3, questionCount + 2);
          const communication = excellentCount > 0 ? Math.min(7, 3 + excellentCount * 2) : satisfactoryCount > 0 ? 5 : 3;
          const confidence = Math.min(7, Math.floor((structure + problemFormulation + communication) / 3));
          const overall = Math.floor((structure + problemFormulation + communication + confidence) / 4);

          return {
            structure,
            problemFormulation,
            communication,
            confidence,
            overall,
            areasForImprovement: [
              structure < 7 ? "Work on structuring your approach more systematically" : null,
              problemFormulation < 7 ? "Ask more targeted and insightful clarifying questions" : null,
              communication < 7 ? "Focus on clearer communication of your analysis" : null,
              questionCount < 5 ? "Consider asking more questions to gather comprehensive information" : null
            ].filter(Boolean) as string[]
          };
        };
        setScores(calculateFallbackScores());
      } finally {
        setIsLoading(false);
      }
    };

    generateScores();
  }, [caseData]);

  if (isLoading) {
    return (
        <div className="p-6 h-full overflow-y-auto">
          <div className="max-w-2xl mx-auto flex items-center justify-center h-64">
            <p className="text-gray-600">Generating personalized review...</p>
          </div>
        </div>
    );
  }

  if (!scores) {
    return (
        <div className="p-6 h-full overflow-y-auto">
          <div className="max-w-2xl mx-auto flex items-center justify-center h-64">
            <p className="text-red-600">Error generating review scores</p>
          </div>
        </div>
    );
  }

  return (
      <div className="p-6 h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Overall Score Circle */}
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200"
                />
                <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(scores.overall / 10) * 314} 314`}
                    className="text-green-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{scores.overall}.0/10</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Overall Rating</h3>
          </div>

          {/* Detailed Scores */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Structure</span>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{getScoreLabel(scores.structure)}</span>
                    <div className="text-sm font-medium">{scores.structure}/10</div>
                  </div>
                </div>
                <Progress value={scores.structure * 10} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Problem Formulation</span>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{getScoreLabel(scores.problemFormulation)}</span>
                    <div className="text-sm font-medium">{scores.problemFormulation}/10</div>
                  </div>
                </div>
                <Progress value={scores.problemFormulation * 10} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Communication</span>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{getScoreLabel(scores.communication)}</span>
                    <div className="text-sm font-medium">{scores.communication}/10</div>
                  </div>
                </div>
                <Progress value={scores.communication * 10} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Confidence</span>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{getScoreLabel(scores.confidence)}</span>
                    <div className="text-sm font-medium">{scores.confidence}/10</div>
                  </div>
                </div>
                <Progress value={scores.confidence * 10} className="h-2" />
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h4 className="font-semibold text-gray-900">Performance Summary</h4>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Questions Asked:</span>
                  <div className="font-medium">{caseData.questions.length}/10</div>
                </div>

                <div>
                  <span className="text-gray-600">Time Taken:</span>
                  <div className="font-medium">{formatTime(caseData.timeElapsed)}</div>
                </div>

                <div>
                  <span className="text-gray-600">Excellent Questions:</span>
                  <div className="font-medium">
                    {caseData.questions.filter(q => q.feedback === 'excellent').length} questions
                  </div>
                </div>

                <div>
                  <span className="text-gray-600">Framework Submitted:</span>
                  <div className="font-medium">✓ Yes</div>
                </div>
              </div>
            </div>

            {/* Dynamic Areas for Improvement */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Areas for Improvement</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {scores.areasForImprovement.map((area, index) => (
                    <li key={index}>• {area}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
};