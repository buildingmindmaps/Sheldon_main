
// Analysis service for case interview data
export interface ReviewScores {
  structuredThinking: number;
  businessAcumen: number;
  communication: number;
  dataAnalysis: number;
  overall: number;
}

export interface FrameworkAnalysis {
  framework: string;
  strengths: string[];
  improvements: string[];
  score: number;
}

export const analyzePerformance = (conversation: any[], timeElapsed: number): ReviewScores => {
  // Simple scoring logic based on conversation length and time
  const messageCount = conversation.length;
  const timeScore = Math.max(1, 5 - Math.floor(timeElapsed / 300)); // Penalty for taking too long
  
  return {
    structuredThinking: Math.min(5, Math.floor(messageCount / 3) + timeScore),
    businessAcumen: Math.min(5, Math.floor(messageCount / 2) + 1),
    communication: Math.min(5, messageCount > 5 ? 4 : 3),
    dataAnalysis: Math.min(5, Math.floor(messageCount / 4) + 2),
    overall: Math.min(5, Math.floor((messageCount + timeScore) / 2))
  };
};

export const analyzeFramework = (frameworkText: string, conversation: any[]): FrameworkAnalysis => {
  return {
    framework: "Profitability Framework",
    strengths: [
      "Clear problem identification",
      "Structured approach to analysis"
    ],
    improvements: [
      "Consider more detailed market analysis",
      "Include competitive landscape assessment"
    ],
    score: 4
  };
};
