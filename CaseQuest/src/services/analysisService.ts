
interface ReviewScores {
  questionQuality: number;
  frameworkStructure: number;
  timeManagement: number;
  overallPerformance: number;
  structure: number;
  problemFormulation: number;
  communication: number;
  confidence: number;
  overall: number;
  areasForImprovement: string[];
}

export interface FrameworkAnalysis {
  structure: string;
  completeness: string;
  logicalFlow: string;
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
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

  const questionCount = questions.length;
  const excellentCount = questions.filter((q: any) => q.feedback === 'excellent').length;
  const satisfactoryCount = questions.filter((q: any) => q.feedback === 'satisfactory').length;

  const structure = frameworkText.length > 100 ? 7 : 5;
  const problemFormulation = questionCount >= 5 ? 7 : Math.max(3, questionCount + 2);
  const communication = excellentCount > 0 ? Math.min(7, 3 + excellentCount * 2) : satisfactoryCount > 0 ? 5 : 3;
  const confidence = Math.min(7, Math.floor((structure + problemFormulation + communication) / 3));
  const overall = Math.floor((structure + problemFormulation + communication + confidence) / 4);

  return {
    questionQuality,
    frameworkStructure,
    timeManagement,
    overallPerformance,
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

export const analyzeFramework = (frameworkText: string): FrameworkAnalysis => {
  return {
    structure: "Well-organized framework with clear sections",
    completeness: "Covers most key areas of the case",
    logicalFlow: "Good logical progression from problem identification to recommendations",
    recommendations: [
      "Consider adding more specific metrics",
      "Include risk assessment",
      "Add implementation timeline"
    ],
    strengths: [
      "Clear structure addressing both revenue and cost components",
      "Good identification of key profitability drivers",
      "Logical flow from high-level to specific factors"
    ],
    weaknesses: [
      "Consider adding competitive benchmarking dimension",
      "Include market segmentation analysis",
      "Add timeline for implementation of recommendations"
    ]
  };
};

export const generateReviewScores = async (
  questions: any[], 
  frameworkText: string, 
  timeElapsed: number, 
  caseStatement: string, 
  conversation: any[]
): Promise<ReviewScores> => {
  // For now, return the calculated scores - this can be enhanced with AI analysis later
  return calculateScores(questions, timeElapsed, frameworkText);
};

export const generateFrameworkAnalysis = async (
  frameworkText: string,
  questions: any[],
  caseStatement: string
): Promise<FrameworkAnalysis> => {
  // For now, return the basic analysis - this can be enhanced with AI analysis later
  return analyzeFramework(frameworkText);
};

export const generateFlowchartVisualization = async (frameworkText: string): Promise<string> => {
  // Simple mermaid flowchart generation based on framework text
  const sections = frameworkText.split('\n').filter(line => line.trim());
  
  let mermaidCode = 'graph TD\n';
  mermaidCode += '    A[Problem Analysis] --> B[Revenue Analysis]\n';
  mermaidCode += '    A --> C[Cost Analysis]\n';
  mermaidCode += '    B --> D[Market Factors]\n';
  mermaidCode += '    B --> E[Product Factors]\n';
  mermaidCode += '    C --> F[Operational Costs]\n';
  mermaidCode += '    C --> G[Fixed Costs]\n';
  mermaidCode += '    D --> H[Recommendations]\n';
  mermaidCode += '    E --> H\n';
  mermaidCode += '    F --> H\n';
  mermaidCode += '    G --> H\n';
  
  return mermaidCode;
};

export type { ReviewScores };
