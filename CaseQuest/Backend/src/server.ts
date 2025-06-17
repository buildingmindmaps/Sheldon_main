
// backend/src/server.ts

import express, { Request, Response } from 'express'; // <--- MODIFICATION: Import Request and Response
import asyncHandler from 'express-async-handler';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3001;

// --- Middleware ---
// Use the port your React app runs on. I see localhost:8080 in your browser tabs.
const allowedOrigins = [
  'http://localhost:8080',
  'https://case-quest-flow.lovable.app'
];

const corsOptions = {
  origin: 'https://case-quest-flow.lovable.app', // **REQUIRED: Change this to your actual deployed frontend URL**
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // If you're sending cookies/auth headers
  optionsSuccessStatus: 204 // Some legacy browsers (IE11, various SmartTVs) choke on 200
};

app.use(cors(corsOptions)); // Use CORS middleware with your options

app.use(express.json()); // To parse JSON request bodies

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like mobile apps, curl, etc.)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());

// --- API Key Setup ---
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in the .env file");
}
const genAI = new GoogleGenerativeAI(apiKey);

// --- API Route ---
// <--- MODIFICATION: Add types to req and res --->
app.post('/api/generate-flowchart', asyncHandler(async (req: Request, res: Response) => {
  const { frameworkText } = req.body;

  if (!frameworkText) {
    res.status(400).json({ error: 'frameworkText is required.' });
    return;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      Convert the following text description into a valid Mermaid.js flowchart diagram.

      IMPORTANT RULES:
      - Only respond with the Mermaid code block itself, starting with \`\`\`mermaid and ending with \`\`\`.
      - Do NOT include any other explanatory text.
      - Start the diagram with "flowchart TD".
      - Use simple, alphanumeric node IDs (e.g., A, B, C1, C2).
      - Enclose all node labels in double quotes (e.g., A["Label Text"]).
      - Keep labels concise.

      Framework Text to Convert:
      "${frameworkText}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let rawResponse = response.text();

    // --- ✅ KEY FIX START ---
    // Extract the code from the markdown block
    const mermaidRegex = /```mermaid([\s\S]*?)```/;
    const match = rawResponse.match(mermaidRegex);

    if (!match || !match[1]) {
        // If the model doesn't return the expected format, throw an error.
        console.error("Failed to extract Mermaid code from Gemini response:", rawResponse);
        throw new Error("Could not parse the generated flowchart from the AI response.");
    }
    
    const mermaidCode = match[1].trim();
    // --- ✅ KEY FIX END ---

    res.status(200).json({ mermaidCode }); 

  } catch (error) {
    console.error('Error calling Gemini API or parsing response:', error);
    res.status(500).json({ error: 'Failed to generate flowchart.' });
  }
}));

app.post('/api/analyze-framework', asyncHandler(async (req: Request, res: Response) => {
  const { frameworkText, questions, caseStatement } = req.body;

  if (!frameworkText || !caseStatement) {
    res.status(400).json({ error: 'frameworkText and caseStatement are required.' });
    return;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Enhanced prompt that includes model response and feedback
    const prompt = `
      Analyze this business case framework approach:
      
      Case Statement: "${caseStatement}"
      
      User's Framework: "${frameworkText}"
      
      Questions Asked: ${questions?.map((q: { text: string; feedback?: string; modelResponse?: string }) => `
        - Question: ${q.text}
        - Feedback: ${q.feedback || 'No feedback provided'}
        - Model Response: ${q.modelResponse || 'No response provided'}
      `).join('\n')}
      
      Please provide a structured analysis in the following JSON format:
      {
        "strengths": ["strength1", "strength2", "strength3"],
        "weaknesses": ["weakness1", "weakness2", "weakness3"],
        "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
      }
      
      Consider both the framework quality and the questions asked (including any feedback and model responses provided for each question). Analyze how well the user understood the problem, structured their approach, and formulated insightful clarifying questions. Take into account the model responses and feedback that was provided to improve the overall assessment.
      
      Only return valid JSON, no additional text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let rawResponse = response.text();

    // Extract JSON from a markdown code block
    const jsonRegex = /```json([\s\S]*?)```/;
    const match = rawResponse.match(jsonRegex);

    let jsonString;
    if (match && match[1]) {
        jsonString = match[1].trim();
    } else {
        jsonString = rawResponse.trim();
    }

    try {
        const analysis = JSON.parse(jsonString);
        res.status(200).json(analysis);
    } catch (parseError) {
        // Log the actual string that failed to parse for easier debugging
        console.error('Failed to parse extracted JSON from Gemini response:', jsonString);
        // Send a 500 error status to the client
        res.status(500).json({ error: 'Failed to parse AI response.' }); 
    }

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to analyze framework.' });
  }
}));

app.post('/api/generate-review', asyncHandler(async (req: Request, res: Response) => {
    const { questions, frameworkText, timeElapsed, caseStatement } = req.body;

    if (!frameworkText || !caseStatement || !questions) {
        res.status(400).json({ error: 'frameworkText, caseStatement, and questions are required.' });
        return;
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `
            You are an expert case interview coach. Analyze the user's performance on the provided case study.
            
            Case Statement: "${caseStatement}"
            User's Framework/Approach: "${frameworkText}"
            User's Clarifying Questions: ${JSON.stringify(questions.map((q: { text: string; feedback?: string; modelResponse?: string }) => ({
              question: q.text,
              feedback: q.feedback || 'No feedback provided',
              modelResponse: q.modelResponse || 'No response provided'
            })))}
            Time Taken: ${timeElapsed} seconds

            Based on this information, evaluate the user's performance on a scale of 1-7 for each of the following criteria:
            - Structure: How logical, comprehensive, and MECE (Mutually Exclusive, Collectively Exhaustive) was their framework?
            - Problem Formulation: How insightful and relevant were their clarifying questions? Did they identify the core problem? Consider the model responses and feedback.
            - Communication: Based on the clarity of their framework text.
            - Confidence: Infer a confidence level based on the quality of the framework and questions.
            - Overall: Your final overall assessment.

            Also, provide 2-4 specific, actionable "areasForImprovement" as an array of strings.

            IMPORTANT: You must respond with only a valid JSON object in a markdown block. Do not include any other text. The JSON object must match this exact structure:
            {
              "structure": number,
              "problemFormulation": number,
              "communication": number,
              "confidence": number,
              "overall": number,
              "areasForImprovement": ["string1", "string2"]
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rawResponse = response.text();

        // Extract JSON from the markdown code block
        const jsonRegex = /```json([\s\S]*?)```/;
        const match = rawResponse.match(jsonRegex);

        let jsonString;
        if (match && match[1]) {
            jsonString = match[1].trim();
        } else {
            // If no markdown block is found, assume the whole response is the JSON
            jsonString = rawResponse.trim();
        }

        try {
            const reviewScores = JSON.parse(jsonString);
            res.status(200).json(reviewScores);
        } catch (parseError) {
            console.error('Failed to parse extracted JSON for review scores:', jsonString);
            res.status(500).json({ error: 'Failed to parse AI response for review scores.' });
        }

    } catch (error) {
        console.error('Error calling Gemini API for review generation:', error);
        res.status(500).json({ error: 'Failed to generate review scores.' });
    }
}));

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
