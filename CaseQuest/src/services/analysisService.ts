

// Define interfaces locally without importing to avoid conflicts
interface ReviewScores {
  overall: number;
  problemSolving: number;
  structuredThinking: number;
  communication: number;
  structure: number;
  problemFormulation: number;
  confidence: number;
  insights: string[];
  recommendations: string[];
  areasForImprovement: string[];
}

interface FrameworkAnalysis {
  structure: string;
  completeness: number;
  strengths: string[];
  weaknesses: string[];
  insights: string[];
  recommendations: string[];
}

export const generateReviewScores = async (
  caseData: any,
  questions: any[],
  frameworkText: string,
  conversation: any[],
  timeElapsed: number
): Promise<ReviewScores> => {
  // Simulate analysis for now - this would typically call an AI service
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const questionCount = questions?.length || 0;
  const hasFramework = frameworkText?.length > 0;
  
  // Simple scoring logic based on engagement
  const problemSolving = Math.min(85, 60 + (questionCount * 3));
  const structuredThinking = hasFramework ? 80 : 65;
  const communication = 75;
  const structure = hasFramework ? 85 : 60;
  const problemFormulation = Math.min(90, 65 + (questionCount * 2));
  const confidence = Math.min(80, 70 + (questionCount * 1));
  const overall = Math.round((problemSolving + structuredThinking + communication + structure + problemFormulation + confidence) / 6);
  
  return {
    overall,
    problemSolving,
    structuredThinking,
    communication,
    structure,
    problemFormulation,
    confidence,
    insights: [
      "Good questioning approach to gather information",
      "Shows analytical thinking in problem breakdown",
      "Could benefit from more strategic prioritization"
    ],
    recommendations: [
      "Practice structuring responses using frameworks like MECE",
      "Focus on asking more hypothesis-driven questions",
      "Work on quantitative analysis skills"
    ],
    areasForImprovement: [
      "Develop stronger hypothesis-driven questioning",
      "Improve framework structuring skills",
      "Focus on quantitative analysis"
    ]
  };
};

export const generateFrameworkAnalysis = async (frameworkText: string): Promise<FrameworkAnalysis> => {
  // Simulate analysis for now
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const wordCount = frameworkText.split(' ').length;
  const completeness = Math.min(90, (wordCount / 50) * 100);
  
  return {
    structure: "The framework demonstrates a logical approach to problem-solving with clear components.",
    completeness,
    strengths: [
      "Clear logical structure",
      "Comprehensive coverage of key areas",
      "Well-organized approach"
    ],
    weaknesses: [
      "Could be more detailed in certain sections",
      "Missing some quantitative elements",
      "Limited risk assessment"
    ],
    insights: [
      "Framework shows good structure and logical flow",
      "Covers key areas of the business problem",
      "Could be more detailed in certain sections"
    ],
    recommendations: [
      "Consider adding more specific metrics to measure success",
      "Include risk assessment in the framework",
      "Add timeline considerations for implementation"
    ]
  };
};

export const generateFlowchartVisualization = async (frameworkText: string): Promise<string> => {
  // Generate a simple mermaid flowchart based on framework text
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return `
graph TD
    A[Problem Analysis] --> B[Data Collection]
    B --> C[Hypothesis Formation]
    C --> D[Testing & Validation]
    D --> E[Solution Development]
    E --> F[Implementation Plan]
    F --> G[Success Metrics]
  `;
};

export type { ReviewScores, FrameworkAnalysis };

