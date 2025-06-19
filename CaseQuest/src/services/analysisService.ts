
// Analysis service for case interview data
export interface ReviewScores {
  structuredThinking: number;
  businessAcumen: number;
  communication: number;
  dataAnalysis: number;
  overall: number;
  structure: number;
  problemFormulation: number;
  confidence: number;
  areasForImprovement: string[];
}

export interface FrameworkAnalysis {
  framework: string;
  strengths: string[];
  improvements: string[];
  weaknesses: string[];
  recommendations: string[];
  score: number;
}

export const analyzePerformance = (conversation: any[], timeElapsed: number): ReviewScores => {
  // Simple scoring logic based on conversation length and time
  const messageCount = conversation.length;
  const timeScore = Math.max(1, 5 - Math.floor(timeElapsed / 300)); // Penalty for taking too long
  
  const structuredThinking = Math.min(5, Math.floor(messageCount / 3) + timeScore);
  const businessAcumen = Math.min(5, Math.floor(messageCount / 2) + 1);
  const communication = Math.min(5, messageCount > 5 ? 4 : 3);
  const dataAnalysis = Math.min(5, Math.floor(messageCount / 4) + 2);
  const overall = Math.min(5, Math.floor((messageCount + timeScore) / 2));
  
  return {
    structuredThinking,
    businessAcumen,
    communication,
    dataAnalysis,
    overall,
    structure: structuredThinking,
    problemFormulation: businessAcumen,
    confidence: communication,
    areasForImprovement: [
      structuredThinking < 5 ? "Work on structuring your approach more systematically" : null,
      businessAcumen < 5 ? "Develop stronger business acumen through practice" : null,
      communication < 5 ? "Focus on clearer communication of your analysis" : null
    ].filter(Boolean) as string[]
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
    weaknesses: [
      "Could include more quantitative analysis",
      "Missing stakeholder impact assessment"
    ],
    recommendations: [
      "Add financial projections to support conclusions",
      "Include risk assessment framework",
      "Consider implementation timeline"
    ],
    score: 4
  };
};

export const generateReviewScores = async (
  questions: any[],
  frameworkText: string,
  timeElapsed: number,
  caseStatement: string,
  conversation: any[]
): Promise<ReviewScores> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const questionCount = questions.length;
  const excellentCount = questions.filter(q => q.feedback === 'excellent').length;
  const satisfactoryCount = questions.filter(q => q.feedback === 'satisfactory').length;

  const structure = frameworkText.length > 100 ? 7 : 5;
  const problemFormulation = questionCount >= 5 ? 7 : Math.max(3, questionCount + 2);
  const communication = excellentCount > 0 ? Math.min(7, 3 + excellentCount * 2) : satisfactoryCount > 0 ? 5 : 3;
  const confidence = Math.min(7, Math.floor((structure + problemFormulation + communication) / 3));
  const overall = Math.floor((structure + problemFormulation + communication + confidence) / 4);

  return {
    structuredThinking: structure,
    businessAcumen: problemFormulation,
    communication,
    dataAnalysis: confidence,
    overall,
    structure,
    problemFormulation,
    confidence,
    areasForImprovement: [
      structure < 7 ? "Work on structuring your approach more systematically" : null,
      problemFormulation < 7 ? "Ask more targeted and insightful clarifying questions" : null,
      communication < 7 ? "Focus on clearer communication of your analysis" : null,
      questionCount < 5 ? "Consider asking more questions to gather comprehensive information" : null
    ].filter(Boolean) as string[]
  };
};

export const generateFrameworkAnalysis = async (
  frameworkText: string,
  questions: any[],
  caseStatement: string
): Promise<FrameworkAnalysis> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const questionCount = questions.length;
  const hasGoodStructure = frameworkText.length > 100;
  
  return {
    framework: "Custom Framework Analysis",
    strengths: [
      hasGoodStructure ? "Well-structured approach to problem solving" : "Clear initial problem identification",
      questionCount > 3 ? "Good questioning technique" : "Shows analytical thinking",
      "Demonstrates business understanding"
    ],
    improvements: [
      !hasGoodStructure ? "Develop more comprehensive framework structure" : "Consider additional analytical dimensions",
      questionCount < 5 ? "Ask more clarifying questions" : "Explore deeper implications",
      "Include more quantitative analysis"
    ],
    weaknesses: [
      frameworkText.length < 50 ? "Framework lacks detail and depth" : "Could benefit from more specific metrics",
      questionCount < 3 ? "Limited questioning approach" : "Could explore more diverse question types",
      "Missing stakeholder impact considerations"
    ],
    recommendations: [
      "Develop a more systematic approach to case analysis",
      "Practice asking more targeted business questions",
      "Include financial and operational metrics in your framework",
      "Consider implementation challenges and timeline"
    ],
    score: Math.min(5, Math.floor((frameworkText.length / 50) + (questionCount / 2)))
  };
};

export const generateFlowchartVisualization = async (frameworkText: string): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate a simple mermaid flowchart based on the framework text
  const hasRevenue = frameworkText.toLowerCase().includes('revenue');
  const hasCost = frameworkText.toLowerCase().includes('cost');
  const hasProfitability = frameworkText.toLowerCase().includes('profit');
  
  if (hasProfitability || (hasRevenue && hasCost)) {
    return `flowchart TD
    A[Business Problem] --> B[Profitability Analysis]
    B --> C[Revenue Analysis]
    B --> D[Cost Analysis]
    C --> E[Market Size]
    C --> F[Pricing Strategy]
    D --> G[Fixed Costs]
    D --> H[Variable Costs]
    E --> I[Recommendations]
    F --> I
    G --> I
    H --> I`;
  }
  
  return `flowchart TD
    A[Problem Statement] --> B[Framework Analysis]
    B --> C[Key Questions]
    B --> D[Data Collection]
    C --> E[Analysis]
    D --> E
    E --> F[Insights]
    F --> G[Recommendations]`;
};
