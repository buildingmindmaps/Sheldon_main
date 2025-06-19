
import { ReviewScores, FrameworkAnalysis } from '../types/types';

export { ReviewScores, FrameworkAnalysis };

export const generateReview = async (
  questions: any[],
  timeElapsed: number,
  frameworkText: string,
  conversation: any[]
) => {
  return {
    scores: {
      overallRating: 85,
      structuredThinking: 88,
      businessAcumen: 82,
      communicationSkills: 87,
      timeManagement: 83
    },
    feedback: "Great analytical approach with well-structured thinking.",
    strengths: ["Clear framework", "Good questioning"],
    improvements: ["Deeper market analysis", "Consider more stakeholders"]
  };
};

export const generateReviewScores = async (
  questions: any[],
  frameworkText: string,
  timeElapsed: number,
  caseStatement: string,
  conversation: any[]
): Promise<ReviewScores> => {
  const questionCount = questions.length;
  const excellentCount = questions.filter(q => q.feedback === 'excellent').length;
  const satisfactoryCount = questions.filter(q => q.feedback === 'satisfactory').length;

  const structure = frameworkText.length > 100 ? 7 : 5;
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

export const generateFrameworkAnalysis = async (frameworkText: string): Promise<FrameworkAnalysis> => {
  return {
    score: 85,
    feedback: "Well-structured framework with clear logic.",
    strengths: ["Clear structure", "Comprehensive approach"],
    weaknesses: ["Add more specific metrics", "Consider external factors"],
    recommendations: ["Include competitive benchmarking", "Add timeline for implementation"]
  };
};

export const generateFlowchartVisualization = async (frameworkText: string) => {
  return "graph TD\n    A[Problem] --> B[Analysis]\n    B --> C[Solution]";
};
