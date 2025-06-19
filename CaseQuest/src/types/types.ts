
export interface ReviewScores {
  structure: number;
  problemFormulation: number;
  communication: number;
  confidence: number;
  overall: number;
  areasForImprovement: string[];
}

export interface FrameworkAnalysis {
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}
