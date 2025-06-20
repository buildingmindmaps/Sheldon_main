
export interface ReviewScores {
  overall: number;
  questionQuality: number;
  frameworkApplication: number;
  timeManagement: number;
  recommendations: string[];
}

export interface FrameworkAnalysis {
  structure: string;
  strengths: string[];
  improvements: string[];
  recommendation: string;
}

export const generateReviewScores = async (questions: any[], timeElapsed: number, frameworkText: string): Promise<ReviewScores> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Calculate scores based on question quality and time management
  const questionQuality = Math.max(1, Math.min(5, questions.length >= 5 ? 4.5 : 3.5));
  const timeManagement = timeElapsed < 1800 ? 4.5 : timeElapsed < 3600 ? 4.0 : 3.5; // 30 min / 60 min thresholds
  const frameworkScore = frameworkText.length > 200 ? 4.5 : frameworkText.length > 100 ? 4.0 : 3.5;
  
  const overall = (questionQuality + timeManagement + frameworkScore) / 3;
  
  return {
    overall,
    questionQuality,
    frameworkApplication: frameworkScore,
    timeManagement,
    recommendations: [
      "Focus on asking more strategic questions",
      "Develop a stronger framework structure",
      "Improve time management during case solving"
    ]
  };
};

export const generateFrameworkAnalysis = async (frameworkText: string, questions: any[]): Promise<FrameworkAnalysis> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    structure: "Your framework demonstrates a systematic approach to problem-solving with clear categorization of issues.",
    strengths: [
      "Clear problem identification",
      "Logical flow of analysis", 
      "Comprehensive coverage of key areas"
    ],
    improvements: [
      "Could benefit from more specific metrics",
      "Consider adding implementation timeline",
      "Include risk assessment factors"
    ],
    recommendation: "Strong foundation with room for more detailed quantitative analysis."
  };
};

export const generateFlowchartVisualization = async (frameworkText: string): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return a simple mermaid diagram
  return `
    graph TD
    A[Problem Identification] --> B[Data Analysis]
    B --> C[Root Cause Analysis]
    C --> D[Solution Development]
    D --> E[Implementation Plan]
    E --> F[Success Metrics]
  `;
};
