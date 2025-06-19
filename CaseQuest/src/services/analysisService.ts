
interface ReviewScores {
  questionQuality: number;
  frameworkStructure: number;
  timeManagement: number;
  overallPerformance: number;
}

interface FrameworkAnalysis {
  structure: string;
  completeness: string;
  logicalFlow: string;
  recommendations: string[];
}

export const analyzeConversation = (conversation: Array<{ sender: 'user' | 'model'; message: string }>) => {
  // Simple analysis for now - can be enhanced with more sophisticated logic
  const userMessages = conversation.filter(msg => msg.sender === 'user');
  const questionQuality = Math.min(10, userMessages.length * 2); // Basic scoring
  
  return {
    insights: [
      "Good question progression",
      "Consider asking more specific follow-up questions",
      "Framework development shows logical thinking"
    ],
    strengths: [
      "Structured approach to problem-solving",
      "Clear communication"
    ],
    improvements: [
      "Could dive deeper into root cause analysis",
      "More quantitative questions would strengthen the analysis"
    ]
  };
};

export const calculateScores = (questions: any[], timeElapsed: number, frameworkText: string): ReviewScores => {
  const questionQuality = Math.min(10, questions.length * 1.5);
  const frameworkStructure = frameworkText.length > 100 ? 8 : 6;
  const timeManagement = timeElapsed < 1800 ? 9 : 7; // 30 minutes
  const overallPerformance = (questionQuality + frameworkStructure + timeManagement) / 3;

  return {
    questionQuality,
    frameworkStructure,
    timeManagement,
    overallPerformance
  };
};

export const analyzeFramework = (frameworkText: string): FrameworkAnalysis => {
  return {
    structure: "Well-organized framework with clear sections",
    completeness: "Covers most key areas of the case",
    logicalFlow: "Good logical progression from problem identification to recommendations",
    recommendations: [
      "Consider adding more specific metrics",
      "Include risk assessment",
      "Add implementation timeline"
    ]
  };
};
