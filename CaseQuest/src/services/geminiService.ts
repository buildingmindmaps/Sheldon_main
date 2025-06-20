import { Question } from '../components/CaseInterview';

interface Evaluation {
  relevance: string;
  depth: string;
  constructiveFeedback: string;
}

interface GeminiResponse {
  answer: string;
  evaluation: Evaluation;
  rating: 'excellent' | 'satisfactory' | 'needs-improvement' | 'critical';
}

export const generateResponseWithGemini = async (questionText: string): Promise<GeminiResponse> => {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not found');
  }

  const prompt = `You are an expert case interview consultant. A candidate has asked: "${questionText}"

You must respond with ONLY a valid JSON object in this exact format (no additional text, no markdown, no code blocks):

{
  "answer": "Your detailed response to the question",
  "evaluation": {
    "relevance": "Evaluation of how relevant the question is to solving the case",
    "depth": "Assessment of the analytical depth shown in the question", 
    "constructiveFeedback": "Specific constructive feedback for improvement"
  },
  "rating": "excellent" | "satisfactory" | "needs-improvement" | "critical"
}

The rating should be:
- "excellent": Highly strategic, demonstrates strong case interview skills
- "satisfactory": Good question with solid reasoning
- "needs-improvement": Basic question that could be more strategic
- "critical": Poor question that misses key aspects

Provide a helpful, detailed answer while evaluating the question's quality for a case interview context.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
            responseMimeType: "application/json"
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No response generated');
    }

    // Parse the JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(generatedText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', generatedText);
      // Fallback response if JSON parsing fails
      return {
        answer: "I apologize, but I'm having trouble processing your question right now. Could you please rephrase it?",
        evaluation: {
          relevance: "Unable to evaluate due to technical issue",
          depth: "Unable to evaluate due to technical issue", 
          constructiveFeedback: "Please try asking your question again"
        },
        rating: 'needs-improvement' as const
      };
    }

    // Validate the response structure
    if (!parsedResponse.answer || !parsedResponse.evaluation || !parsedResponse.rating) {
      console.error('Invalid response structure:', parsedResponse);
      return {
        answer: "I apologize, but I'm having trouble processing your question right now. Could you please rephrase it?",
        evaluation: {
          relevance: "Unable to evaluate due to technical issue",
          depth: "Unable to evaluate due to technical issue",
          constructiveFeedback: "Please try asking your question again"
        },
        rating: 'needs-improvement' as const
      };
    }

    // Ensure rating is one of the valid values
    const validRatings = ['excellent', 'satisfactory', 'needs-improvement', 'critical'];
    if (!validRatings.includes(parsedResponse.rating)) {
      parsedResponse.rating = 'needs-improvement';
    }

    return {
      answer: parsedResponse.answer,
      evaluation: {
        relevance: parsedResponse.evaluation.relevance || "No evaluation provided",
        depth: parsedResponse.evaluation.depth || "No evaluation provided",
        constructiveFeedback: parsedResponse.evaluation.constructiveFeedback || "No feedback provided"
      },
      rating: parsedResponse.rating as 'excellent' | 'satisfactory' | 'needs-improvement' | 'critical'
    };

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Return a fallback response
    return {
      answer: "I apologize, but I'm experiencing technical difficulties. Please try asking your question again.",
      evaluation: {
        relevance: "Unable to evaluate due to technical error",
        depth: "Unable to evaluate due to technical error",
        constructiveFeedback: "Please try again later"
      },
      rating: 'needs-improvement' as const
    };
  }
};
