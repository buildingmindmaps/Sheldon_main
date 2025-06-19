import { toast } from 'sonner';

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

export const generateResponseWithGemini = async (
  questionText: string,
  onStreamUpdate?: (chunk: string) => void
) => {
  try {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!API_KEY) {
      throw new Error('Gemini API key not found');
    }

    const prompt = `
You are an experienced McKinsey consultant conducting a case interview about a water purifier manufacturer in India experiencing profitability issues.

Context: The client is a water purifier manufacturer in India, focused on residential customers. They are experiencing lower profitability (EBITDA/Revenue) compared to competitors and need analysis and recommendations.

Question from candidate: "${questionText}"

Please provide:
1. A comprehensive answer that helps the candidate understand the situation better
2. Relevant data or insights that would be available in a real case
3. Follow-up information that guides them toward the solution

Respond as if you are the interviewer providing information to help the candidate solve the case. Be helpful but don't give away the entire solution.

After your response, evaluate the question on these criteria:
- Relevance: How well does this question help solve the case?
- Depth: Does this show good analytical thinking?
- Constructive Feedback: What could improve this question?

Rate the question as: excellent, satisfactory, needs-improvement, or critical
`;

    if (onStreamUpdate) {
      // Streaming response
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      let fullResponse = '';
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const jsonStr = line.slice(6);
                if (jsonStr.trim() === '[DONE]') continue;
                
                const data = JSON.parse(jsonStr);
                if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                  const text = data.candidates[0].content.parts[0].text;
                  fullResponse += text;
                  onStreamUpdate(text);
                }
              } catch (parseError) {
                console.log('Parse error for line:', line);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return parseGeminiResponse(fullResponse);
    } else {
      // Non-streaming response (fallback)
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const fullResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
      
      return parseGeminiResponse(fullResponse);
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

const parseGeminiResponse = (responseText: string) => {
  const lines = responseText.split('\n');
  let answer = '';
  let evaluation = {
    relevance: '',
    depth: '',
    constructiveFeedback: ''
  };
  let rating: 'excellent' | 'satisfactory' | 'needs-improvement' | 'critical' = 'satisfactory';

  // Extract the main answer (everything before evaluation section)
  let evaluationStart = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (line.includes('evaluat') || line.includes('rating') || line.includes('feedback')) {
      evaluationStart = i;
      break;
    }
  }

  if (evaluationStart > 0) {
    answer = lines.slice(0, evaluationStart).join('\n').trim();
    const evaluationText = lines.slice(evaluationStart).join('\n').toLowerCase();
    
    // Extract rating
    if (evaluationText.includes('excellent')) rating = 'excellent';
    else if (evaluationText.includes('critical')) rating = 'critical';
    else if (evaluationText.includes('needs-improvement') || evaluationText.includes('needs improvement')) rating = 'needs-improvement';
    else rating = 'satisfactory';

    // Simple evaluation extraction
    evaluation = {
      relevance: 'This question helps understand the case context.',
      depth: 'Shows analytical thinking about the problem.',
      constructiveFeedback: 'Consider asking more specific follow-up questions.'
    };
  } else {
    answer = responseText;
  }

  return {
    answer: answer || 'Thank you for your question. Let me provide you with some relevant information about the water purifier market in India...',
    evaluation,
    rating
  };
};
