
// Define interfaces locally to avoid conflicts
interface ReviewScores {
  structure: number;
  problemFormulation: number;
  communication: number;
  confidence: number;
  overall: number;
  areasForImprovement: string[];
}

interface FrameworkAnalysis {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface Question {
  text: string;
  feedback?: string;
  modelResponse?: string;
}

// Export types
export type { ReviewScores, FrameworkAnalysis, Question };

export const analyzeFramework = async (
  frameworkText: string,
  questions: Question[],
  caseStatement: string
): Promise<FrameworkAnalysis> => {
  try {
    const response = await fetch('/api/analyze-framework', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        frameworkText,
        questions,
        caseStatement,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing framework:', error);
    throw error;
  }
};

export const generateReview = async (
  questions: Question[],
  frameworkText: string,
  timeElapsed: number,
  caseStatement: string,
  conversation?: any
): Promise<ReviewScores> => {
  try {
    const response = await fetch('/api/generate-review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questions,
        frameworkText,
        timeElapsed,
        caseStatement,
        conversation,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating review:', error);
    throw error;
  }
};

// Add the missing functions that components are trying to import
export const generateFrameworkAnalysis = analyzeFramework;
export const generateReviewScores = generateReview;

export const generateFlowchartVisualization = async (frameworkText: string): Promise<string> => {
  try {
    const response = await fetch('/api/generate-flowchart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        frameworkText,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.mermaidCode;
  } catch (error) {
    console.error('Error generating flowchart:', error);
    throw error;
  }
};
