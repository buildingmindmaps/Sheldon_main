
interface GeminiResponse {
  answer: string;
  evaluation: {
    relevance: string;
    depth: string;
    constructiveFeedback: string;
  };
  rating: 'excellent' | 'satisfactory' | 'needs-improvement' | 'critical';
}

export const generateResponseWithGemini = async (question: string): Promise<GeminiResponse> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const mockResponses = [
    {
      answer: "That's an excellent question about the profitability framework. When analyzing EBITDA/Revenue ratios, we need to examine both the revenue and cost sides. For a water purifier manufacturer, key revenue drivers include unit sales, average selling price, and market penetration. On the cost side, consider manufacturing costs, raw materials, labor, distribution, and marketing expenses.",
      evaluation: {
        relevance: "Highly relevant - directly addresses the core profitability issue",
        depth: "Good depth with specific framework elements mentioned",
        constructiveFeedback: "Consider exploring specific cost breakdown categories and competitor benchmarking"
      },
      rating: 'excellent' as const
    },
    {
      answer: "Good observation about the market dynamics. The Indian water purifier market is highly competitive with players like Kent, Aquaguard, and Pureit. Market share, pricing strategies, and distribution channels all impact profitability. We should examine if the client's lower profitability stems from pricing pressure, higher operational costs, or inefficient operations.",
      evaluation: {
        relevance: "Relevant to understanding competitive positioning",
        depth: "Satisfactory depth but could explore more specific metrics",
        constructiveFeedback: "Try to quantify the competitive gaps and identify specific operational inefficiencies"
      },
      rating: 'satisfactory' as const
    }
  ];

  // Create a more structured prompt to ensure consistent response format
  const structuredPrompt = `
You are a case interview expert responding to the question: "${question}"

You MUST respond in this EXACT JSON format - no deviations allowed:
{
  "answer": "Your detailed response here",
  "evaluation": {
    "relevance": "Assessment of how relevant the question is to the case",
    "depth": "Assessment of the depth and analytical rigor of the question", 
    "constructiveFeedback": "Specific suggestions for improvement"
  },
  "rating": "excellent" | "satisfactory" | "needs-improvement" | "critical"
}

The answer should be 2-3 sentences providing insights about the water purifier profitability case.
The rating must be one of exactly these four values: "excellent", "satisfactory", "needs-improvement", "critical"
`;

  try {
    // In a real implementation, you would call the Gemini API here with the structured prompt
    // For now, we'll use a mock response with strict format validation
    
    const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    // Strict validation to ensure response format is correct
    if (!response.answer || typeof response.answer !== 'string') {
      throw new Error('Invalid answer format');
    }
    
    if (!response.evaluation || 
        typeof response.evaluation.relevance !== 'string' ||
        typeof response.evaluation.depth !== 'string' || 
        typeof response.evaluation.constructiveFeedback !== 'string') {
      throw new Error('Invalid evaluation format');
    }
    
    const validRatings = ['excellent', 'satisfactory', 'needs-improvement', 'critical'];
    if (!validRatings.includes(response.rating)) {
      throw new Error('Invalid rating format');
    }
    
    return response;
    
  } catch (error) {
    console.error('Error in generateResponseWithGemini:', error);
    
    // Fallback response with guaranteed correct format
    return {
      answer: "I understand you're asking about the profitability analysis. Let me provide some insights on this important aspect of the case.",
      evaluation: {
        relevance: "The question addresses the core issue of profitability analysis",
        depth: "Good question that shows understanding of the business problem",
        constructiveFeedback: "Consider being more specific about which aspect of profitability you'd like to explore"
      },
      rating: 'satisfactory'
    };
  }
};
