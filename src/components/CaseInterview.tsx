import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define TypeScript interfaces
interface ChatMessage {
  role: 'user' | 'model';
  type?: 'question' | 'framework';
  parts: { text: string }[];
  timestamp: string;
  feedback?: string;
  feedbackVisible?: boolean;
  questionNumber?: number | null;
  isFrameworkResponse?: boolean;
  hasDiagram?: boolean;
}

interface ApiPayload {
  contents: Array<{
    role: string;
    parts: { text: string }[];
  }>;
  generationConfig?: {
    responseMimeType?: string;
    temperature?: number;
  };
}

type AppPhase = 'clarifying' | 'framework_input' | 'framework_submitted' | 'case_ended';

// Icon Components
const LightningIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5Z"/>
  </svg>
);

interface CaseInterviewProps {
  onBack: () => void;
}

export const CaseInterview: React.FC<CaseInterviewProps> = ({ onBack }) => {
  const [casePrompt] = useState<string>('Your client is a water purifier manufacturer in India, focused on residential customers. The client is experiencing lower profitability (defined as EBITDA/Revenue) compared to competitors. They have hired you to analyze the issue and provide recommendations.');
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [appPhase, setAppPhase] = useState<AppPhase>('clarifying');
  const [frameworkText, setFrameworkText] = useState<string>('');
  const [showFrameworkButton, setShowFrameworkButton] = useState<boolean>(false);
  const [showFrameworkPopup, setShowFrameworkPopup] = useState<boolean>(false);

  const [mermaidAPI, setMermaidAPI] = useState<any>(null);
  const [mermaidDiagramCode, setMermaidDiagramCode] = useState<string>('');
  const [isDiagramLoading, setIsDiagramLoading] = useState<boolean>(false);
  const [diagramError, setDiagramError] = useState<string>('');

  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const mermaidDivRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatHistory]);

  useEffect(() => {
    const initMermaid = async (): Promise<void> => {
      try {
        const mermaidModule = await import('mermaid');
        const mermaidInstance = mermaidModule.default;

        if (mermaidInstance && typeof mermaidInstance.initialize === 'function') {
          mermaidInstance.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
          });
          setMermaidAPI(mermaidInstance);
          console.log("Mermaid API loaded and initialized successfully.");
        } else {
          throw new Error("Mermaid initialize method not found");
        }
      } catch (err) {
        console.error("Failed to dynamically load or initialize Mermaid:", err);
        setDiagramError("Failed to load Mermaid library. Diagramming disabled.");
      }
    };
    initMermaid();
  }, []);

  useEffect(() => {
    if (mermaidAPI && mermaidDiagramCode && mermaidDivRef.current) {
      console.log("Attempting to render Mermaid diagram with code:", mermaidDiagramCode);
      mermaidDivRef.current.innerHTML = '';
      try {
        mermaidDivRef.current.className = 'mermaid';
        mermaidDivRef.current.innerHTML = mermaidDiagramCode;

        const existingSvg = mermaidDivRef.current.querySelector('svg');
        if (existingSvg) {
          existingSvg.remove();
        }

        if (mermaidAPI.run) {
          mermaidAPI.run({ nodes: [mermaidDivRef.current] });
        }
        console.log("Mermaid diagram rendered.");
      } catch (e: any) {
        console.error("Mermaid rendering error:", e);
        setDiagramError(`Error rendering diagram: ${e.message}. The generated code might be invalid.`);
        if (mermaidDivRef.current) {
          mermaidDivRef.current.innerHTML = `<p class="text-red-600">Could not render diagram. Mermaid code: <pre class="whitespace-pre-wrap break-all p-2 bg-red-50 border border-red-200 rounded-md">${mermaidDiagramCode.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></p>`;
        }
      }
    } else if (mermaidAPI && mermaidDivRef.current && !mermaidDiagramCode) {
      mermaidDivRef.current.innerHTML = '';
      mermaidDivRef.current.className = 'mermaid';
    }
  }, [mermaidAPI, mermaidDiagramCode]);

  useEffect(() => {
    const aiResponses = chatHistory.filter(msg => msg.role === 'model').length;
    const userQuestions = chatHistory.filter(msg => msg.role === 'user' && msg.type !== 'framework').length;

    // After 10 clarifying questions, force framework popup
    if (userQuestions >= 10 && appPhase === 'clarifying') {
      setAppPhase('framework_input');
      setShowFrameworkPopup(true); // Show the framework popup
      return;
    }

    if (aiResponses >= 2 && appPhase === 'clarifying') {
      setShowFrameworkButton(true);
    } else {
      setShowFrameworkButton(false);
    }
  }, [chatHistory, appPhase]);


  const toggleFeedbackVisibility = (index: number): void => {
    setChatHistory(prevChatHistory =>
        prevChatHistory.map((msg, i) =>
            msg.role === 'model'
                ? { ...msg, feedbackVisible: i === index ? !msg.feedbackVisible : false }
                : msg
        )
    );
  };

  const handleProceedToFramework = (): void => {
    setShowFrameworkPopup(true);
  };

  const generateMermaidDiagram = async (textForDiagram: string): Promise<void> => {
    if (!mermaidAPI) {
      setDiagramError("Mermaid library not loaded. Cannot generate diagram.");
      return;
    }
    setIsDiagramLoading(true);
    setDiagramError('');
    setMermaidDiagramCode('');

    const apiKey = "AIzaSyAHM7wY5VjVYL0Xj-GCDqhbuFeOgJzOx20";
    const diagramApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const prompt = `
Convert the following text description into a valid Mermaid.js flowchart diagram.
Use flowchart TD (Top-Down) or LR (Left-Right) syntax.
Ensure all node text is properly quoted if it contains special characters like parentheses, brackets, or hyphens that are not part of arrow syntax.
Only respond with the Mermaid code block itself, starting with \`\`\`mermaid and ending with \`\`\`.
Do NOT include any other explanatory text before or after the code block.

Description: ${textForDiagram}

Example of a valid response with quoted node text:
\`\`\`mermaid
flowchart TD
    A["Start Node (with parentheses)"] --> B{"Decision Point?"}
    B -- Yes --> C["Process 1: Action"]
    B -- "No (with quotes)" --> D["Process 2: Alternative"]
    C --> E["End Result"]
    D --> E
\`\`\`
`;

    const payload: ApiPayload = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "text/plain",
        temperature: 0.1,
      }
    };

    console.log("Requesting Mermaid diagram from Gemini with payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(diagramApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Mermaid Diagram API Error Data:', errorData);
        throw new Error(errorData.error?.message || `Mermaid API request failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log("Raw Mermaid Diagram API Response:", result);

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        let rawMermaidCode = result.candidates[0].content.parts[0].text;
        console.log("Raw Mermaid code from API:", rawMermaidCode);

        const match = rawMermaidCode.match(/```mermaid\s*([\s\S]*?)\s*```/);
        if (match && match[1]) {
          let extractedCode = match[1].trim();
          if (!extractedCode.toLowerCase().startsWith('graph') && !extractedCode.toLowerCase().startsWith('flowchart') && !extractedCode.toLowerCase().startsWith('sequencediagram') && !extractedCode.toLowerCase().startsWith('gantt') && !extractedCode.toLowerCase().startsWith('classdiagram') && !extractedCode.toLowerCase().startsWith('statediagram')) {
             console.warn("Generated code doesn't seem to start with a known Mermaid diagram type. Using as is, but might fail to render.");
          }
          setMermaidDiagramCode(extractedCode);
        } else {
          console.warn("Mermaid code block not found or improperly formatted. Trying to use the full response if it looks like Mermaid.");
          if (rawMermaidCode.toLowerCase().includes('graph') || rawMermaidCode.toLowerCase().includes('flowchart')) {
            setMermaidDiagramCode(rawMermaidCode.trim());
          } else {
            throw new Error('Valid Mermaid code block not found, and fallback heuristic failed. AI response did not contain expected diagram code.');
          }
        }
      } else {
        throw new Error('Could not retrieve valid Mermaid diagram response from API (no candidates or parts).');
      }
    } catch (err: any) {
      console.error("Error generating Mermaid diagram:", err);
      setDiagramError(`Failed to generate diagram: ${err.message}`);
      setMermaidDiagramCode('');
    } finally {
      setIsDiagramLoading(false);
    }
  };

  const handleSubmit = async (isFrameworkSubmission: boolean = false): Promise<void> => {
    if (!isFrameworkSubmission && !currentQuestion.trim()) {
      setError('Please enter your question.');
      return;
    }
    if (isFrameworkSubmission && !frameworkText.trim()) {
      setError('Please enter your framework.');
      return;
    }

    // Ensure all feedback is collapsed when submitting a new question
    setChatHistory(prev =>
      prev.map(msg =>
        msg.role === 'model' ? { ...msg, feedbackVisible: false } : msg
      )
    );

    setIsLoading(true);
    setError('');
    if(isFrameworkSubmission) {
        setDiagramError('');
    }

    const userMessageText = isFrameworkSubmission ? frameworkText : currentQuestion;
    const currentQNumber = chatHistory.filter(msg => msg.role === 'user' && msg.type !== 'framework').length + 1;

    const newUserMessage: ChatMessage = {
      role: 'user',
      type: isFrameworkSubmission ? 'framework' : 'question',
      parts: [{ text: userMessageText }],
      timestamp: new Date().toISOString(),
    };
    setChatHistory(prev => [...prev, newUserMessage]);

    if (!isFrameworkSubmission) setCurrentQuestion('');

    let contentsForGemini: Array<{ role: string; parts: { text: string }[] }> = [];
    let systemInstruction = "You are a business case interview coach. Your responses should be structured and provide clear, actionable feedback.";

    const initialCaseContext = {
      role: 'user',
      parts: [{ text: `Initial Case Details: ${casePrompt}` }]
    };

    const historyForAPIPayload = [initialCaseContext, ...chatHistory.map(msg => ({
      role: msg.role,
      parts: msg.parts
    })), newUserMessage];

    let promptForAIMessage: string;
    if (isFrameworkSubmission) {
      promptForAIMessage = `
        ${systemInstruction}
        The user has provided the following framework for the case we've been discussing:
        "${userMessageText}"

        Please provide:
        1. An Evaluation of this framework based on its MECE (Mutually Exclusive, Collectively Exhaustive) properties, relevance to the case, completeness, and logical structure. Be specific.
        2. Constructive Feedback: Offer specific, actionable suggestions for improvement. What could they add, remove, or refine? How can they make it more robust?
      `;
      contentsForGemini = [...historyForAPIPayload.slice(0, -1), { role: "user", parts: [{ text: promptForAIMessage }] }];
    } else {
      promptForAIMessage = `
        ${systemInstruction}
        User's question: "${userMessageText}"

        Please provide:
        1. An Answer to the user's question based on the case and our discussion. If the case doesn't provide enough information, state that clearly and explain why.
        2. An Evaluation of this specific question based on the following criteria:
            a. Relevance: Is the question relevant to the case at this stage? (Yes/No, and briefly explain why)
            b. Depth: Rate the depth of the question. (Options: Superficial, Useful, Deep. Briefly explain your rating.)
            c. Constructive Feedback: Offer specific, actionable feedback to help the user improve their questioning or analytical approach for this question. For example, how could they make it more insightful or targeted?
      `;
        contentsForGemini = [...historyForAPIPayload.slice(0, -1), { role: "user", parts: [{ text: promptForAIMessage }] }];
    }

    const payload: ApiPayload = { contents: contentsForGemini };
    const coachApiKey = "AIzaSyAHM7wY5VjVYL0Xj-GCDqhbuFeOgJzOx20";
    const coachApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${coachApiKey}`;

    try {
      const response = await fetch(coachApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Coach API request failed with status ${response.status}`);
      }
      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {

        const fullResponseText = result.candidates[0].content.parts[0].text;
        let finalAnswerToShow = "Sorry, the Sheldon response could not be understood.";
        let feedbackForDropdown = "No specific feedback was parsed.";

        if (isFrameworkSubmission) {
            const evalRegex = /1\.\s*(?:An\s*)?Evaluation(?:.*?):\s*([\s\S]*?)(?=\n*\s*2\.\s*Constructive Feedback|$)/is;
            const suggestionsRegex = /2\.\s*Constructive Feedback(?:.*?):\s*([\s\S]*)/is;
            const evalMatch = fullResponseText.match(evalRegex);
            const suggestionsMatch = fullResponseText.match(suggestionsRegex);
            const parsedEval = (evalMatch && evalMatch[1] && evalMatch[1].trim()) ? evalMatch[1].trim() : null;
            const parsedSuggestions = (suggestionsMatch && suggestionsMatch[1] && suggestionsMatch[1].trim()) ? suggestionsMatch[1].trim() : null;
            if (parsedEval) finalAnswerToShow = parsedEval;
            if (parsedSuggestions) feedbackForDropdown = parsedSuggestions;
            if (!parsedEval && !parsedSuggestions && fullResponseText) finalAnswerToShow = fullResponseText;
            else if (!parsedEval && parsedSuggestions) finalAnswerToShow = "Framework evaluation details are in the suggestions below.";
        } else {
            const answerRegex = /1\.\s*(?:An\s*)?Answer(?:.*?):\s*([\s\S]*?)(?=\n*\s*2\.\s*(?:An\s*)?Evaluation|$)/is;
            const feedbackRegex = /2\.\s*(?:An\s*)?Evaluation(?:.*?):\s*([\s\S]*)/is;
            const answerMatch = fullResponseText.match(answerRegex);
            const feedbackMatch = fullResponseText.match(feedbackRegex);
            const parsedAnswer = (answerMatch && answerMatch[1] && answerMatch[1].trim()) ? answerMatch[1].trim() : null;
            const parsedFeedback = (feedbackMatch && feedbackMatch[1] && feedbackMatch[1].trim()) ? feedbackMatch[1].trim() : null;
            if (parsedAnswer) finalAnswerToShow = parsedAnswer;
            if (parsedFeedback) feedbackForDropdown = parsedFeedback;
            if (!parsedAnswer && !parsedFeedback && fullResponseText) finalAnswerToShow = fullResponseText;
            else if (!parsedAnswer && parsedFeedback) finalAnswerToShow = "Please see feedback below for details on your question.";
        }

        setChatHistory(prev => [...prev, {
          role: "model",
          parts: [{ text: finalAnswerToShow }],
          feedback: feedbackForDropdown,
          feedbackVisible: false,
          questionNumber: isFrameworkSubmission ? null : currentQNumber,
          isFrameworkResponse: isFrameworkSubmission,
          timestamp: new Date().toISOString(),
        }]);

        if (isFrameworkSubmission) {
          await generateMermaidDiagram(frameworkText);

          // Add the diagram as part of the chat rather than waiting for case_ended
          if (mermaidDiagramCode) {
            setChatHistory(prev => [...prev, {
              role: 'model',
              parts: [{ text: '**Your Framework Visualization:**' }],
              feedback: '',
              feedbackVisible: false,
              timestamp: new Date().toISOString(),
              isFrameworkResponse: true,
              hasDiagram: true,
            }]);
          }

          setAppPhase('case_ended');
        }
      } else {
        throw new Error('Could not retrieve valid response from Sheldon.');
      }
    } catch (err: any) {
      console.error("Error in handleSubmit (Coach API):", err);
      setError(`Failed to get Sheldon response: ${err.message}`);
      setChatHistory(prev => [...prev, {
        role: 'model',
        parts: [{ text: `Error: ${err.message}` }],
        feedback: '',
        feedbackVisible: false,
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormattedText = (text: string, isBold: boolean = false): React.ReactNode => {
    if (!text) return null;
    return text
      .split('\n')
      .map((line, lineIndex) => {
        if (line.trim() === '') return <br key={`br-${lineIndex}`} />;

        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
        line = line.replace(/~~(.*?)~~/g, '<del>$1</del>');

        let listClass = '';
        if (line.match(/^\s*-\s/) || line.match(/^\s*\*\s/)) {
          line = line.replace(/^\s*[-\*]\s/, '');
          listClass = "ml-5 list-disc";
        } else if (line.match(/^\s*\d+\.\s/)) {
          line = line.replace(/^\s*\d+\.\s/, '');
          listClass = "ml-5 list-decimal";
        }

        const lineContent = <span dangerouslySetInnerHTML={{ __html: line }} />;

        if (listClass) {
          return <li key={`li-${lineIndex}`} className={listClass}>{lineContent}</li>;
        }
        return <p key={`p-${lineIndex}`} className={`my-1 ${isBold ? 'font-semibold' : ''}`}>{lineContent}</p>;
      });
  };

  const userQuestions = chatHistory.filter(msg => msg.role === 'user' && msg.type !== 'framework').length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style>{`
        :root {
          --btn-primary-bg: #6feb62;
          --btn-primary-text: #000000;
          --btn-primary-hover-bg: #000000;
          --btn-primary-hover-text: #ffffff;
          --highlight-color: #b5ff4c;
          --element-orange: #fef3c7;
          --element-lightblue: #ebf3ff;
          --gradient-blue-start: #5ca6f9;
          --gradient-blue-end: #0cb5d7;
          --gradient-green-start: #49dd80;
          --gradient-green-end: #11ba81;
          --gradient-purple-start: #be84fc;
          --gradient-purple-end: #6567f2;
          --gradient-orange-start: #fbbd23;
          --gradient-orange-end: #f9771a;
          --gradient-yellow-start:#cff19c;
          --gradient-yellow-end:#e1ffb3;
          --grey-1: #f9fafb;
          --grey-2: #f1f2f3;
          --background: #fcfcfc;
          --font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
          --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          --radius-sm: 0.375rem;
          --radius: 0.5rem;
          --radius-md: 0.75rem;
          --radius-lg: 1rem;
        }

        /* Mobile-first responsive styles */
        @media (max-width: 640px) {
          .responsive-container {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          
          .responsive-heading {
            font-size: 1.5rem;
          }
          
          .responsive-button-text {
            display: none;
          }
          
          .responsive-button-icon {
            display: block;
          }
        }
        
        @media (min-width: 641px) {
          .responsive-container {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
          
          .responsive-heading {
            font-size: 2rem;
          }
          
          .responsive-button-text {
            display: inline;
          }
          
          .responsive-button-icon {
            display: inline;
          }
        }

        .chat-input-button {
          background-color: var(--btn-primary-bg);
          color: var(--btn-primary-text);
          border-radius: var(--radius);
          padding: 0.625rem 1.25rem;
          font-weight: 600;
          font-family: var(--font-family);
          box-shadow: var(--shadow);
          transition: all 0.15s ease-in-out;
        }

        .chat-input-button:hover {
          background-color: var(--btn-primary-hover-bg);
          color: var(--btn-primary-hover-text);
          box-shadow: var(--shadow-md);
        }

        .chat-input-button:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: var(--grey-2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }

        .mermaid-diagram-container {
          border: 1px solid #e5e7eb;
          border-radius: var(--radius-md);
          padding: 1rem;
          margin-top: 1.5rem;
          background-color: white;
          box-shadow: var(--shadow);
          max-height: 400px;
          overflow: auto;
          font-family: var(--font-family);
        }

        .mermaid {
          text-align: center;
          margin: auto;
        }

        .mermaid svg {
          max-width: 100%;
          height: auto;
          display: block;
          margin: auto;
        }

        .case-statement-box {
          background-color: white;
          border: 2px solid #a3e635;
          border-radius: var(--radius-md);
          padding: 1.25rem;
          box-shadow: var(--shadow-lg);
          color: #374151;
          font-family: var(--font-family);
        }

        .case-statement-box h2 {
          color: #a3e635;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .tooltip {
          position: relative;
          display: inline-block;
        }

        .tooltip .tooltip-text {
          visibility: hidden;
          width: 200px;
          background-color: #333;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 0.5rem;
          position: absolute;
          z-index: 1;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
          transition: opacity 0.3s;
          font-size: 0.75rem;
          line-height: 1.2;
        }

        .tooltip:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
        }

        .learning-tip {
          background-color: var(--element-lightblue);
          border-left: 4px solid var(--gradient-blue-start);
          padding: 0.75rem;
          margin: 1rem 0;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
        }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sprints
          </Button>
          <h1 className="text-xl font-semibold">Case Practice</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full border-2 border-[#a3e635] text-black hover:bg-[#a3e635]/10 px-5 py-2 bg-white font-medium">
            <LightningIcon />
            <span className="ml-1.5">1</span>
          </Button>
          <Button className="rounded-lg bg-[#a3e635] hover:bg-[#84cc16] text-black font-medium px-8 py-2 border-2 border-[#a3e635]">
            Start Free Trial
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 flex flex-col items-center w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-3 text-center tracking-tight">
          Case Sprint: Water Purifier
        </h1>
        <p className="text-gray-600 mb-10 text-center text-lg">
          Hone your consulting skills with AI-driven scenarios.
        </p>

        <div className="w-full mb-6 case-statement-box">
          <h2 className="text-l font-semibold mb-3">
            Case Statement:
            <span className="tooltip ml-2 text-gray-500 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412l-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
              <span className="tooltip-text">The case statement contains the initial client problem. Read this carefully to understand the context before asking questions.</span>
            </span>
          </h2>
          <div className="text-sm leading-relaxed">{renderFormattedText(casePrompt, true)}</div>
        </div>

        <div className="w-full flex-grow overflow-y-auto space-y-4 mb-4 custom-scrollbar pr-2 bg-white p-6 rounded-xl shadow-xl" style={{ minHeight: '350px', maxHeight: '60vh'}}>
          {chatHistory.map((msg, index) => (
            <div key={msg.timestamp + '-' + index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] p-3.5 rounded-xl shadow-md ${
                  msg.role === 'user'
                  ? 'bg-gradient-to-br from-[var(--gradient-blue-start)] to-[var(--gradient-blue-end)] text-white'
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}
              >
                <p className={`text-sm font-semibold mb-1.5 ${msg.role === 'user' ? 'text-white/90' : 'text-gray-700'}`}>
                  {msg.role === 'user' ? (msg.type === 'framework' ? 'Your Framework:' : 'You:') : (msg.isFrameworkResponse ? 'AI Coach (Framework Evaluation):' : 'AI Coach:')}
                </p>
                <div className="prose prose-sm max-w-none text-current leading-relaxed">
                    {renderFormattedText(msg.parts[0].text)}
                </div>

                {/* Render mermaid diagram inside the chat message when hasDiagram is true */}
                {msg.hasDiagram && (
                  <div className="w-full my-4 mermaid-diagram-container">
                    {isDiagramLoading && <p className="text-gray-500 text-center py-4">Generating diagram...</p>}
                    {!isDiagramLoading && diagramError &&
                      <div className="text-red-600 p-3 bg-red-50 border border-red-200 rounded-md">
                        <strong>Diagram Error:</strong> {diagramError}
                      </div>
                    }
                    <div ref={mermaidDivRef} className="mermaid">
                      {/* Content injected by useEffect */}
                    </div>
                    {!isDiagramLoading && !diagramError && !mermaidDiagramCode && mermaidAPI &&
                      <p className="text-gray-500 text-sm text-center py-4">No diagram generated or framework was not suitable for visualization.</p>
                    }
                    {!mermaidAPI && !isDiagramLoading &&
                      <p className="text-red-500 text-sm text-center py-4">Mermaid library could not be loaded. Diagrams are unavailable.</p>
                    }
                  </div>
                )}

                {msg.role === 'model' && msg.feedback && msg.feedback !== "No specific feedback was parsed." && msg.feedback.trim() !== "" && (
                  <div className="mt-2.5 pt-2.5 border-t border-gray-300/60">
                    <button
                      onClick={() => toggleFeedbackVisibility(index)}
                      className="text-xs font-semibold flex items-center hover:opacity-80 transition-opacity group"
                      style={{ color: msg.role === 'user' ? 'rgba(255,255,255,0.85)' : 'var(--gradient-blue-start)'}}
                    >
                      {msg.isFrameworkResponse ? "Detailed Suggestions" : `Feedback on Question ${msg.questionNumber || ''}`}
                      <ChevronDown className={`ml-1.5 h-4 w-4 transform transition-transform duration-200 ${msg.feedbackVisible ? 'rotate-180' : ''}`} />
                    </button>
                    {msg.feedbackVisible && (
                      <div className="mt-1.5 p-2.5 rounded-md bg-black/5 prose prose-xs max-w-none text-current leading-normal">
                          {renderFormattedText(msg.feedback)}
                      </div>
                    )}
                    {!msg.feedbackVisible && (
                      <div className="max-h-[3em] overflow-hidden relative">
                        {renderFormattedText(msg.feedback)}
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.05)]"></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={chatMessagesEndRef} />
        </div>

        {error && (
            <div className="w-full my-2 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm shadow">
                <strong>Coach Error:</strong> {error}
            </div>
        )}

        {appPhase === 'clarifying' && (
          <div className="w-full mt-auto pt-4 sticky bottom-0 bg-gray-50 pb-6 z-10">
            {showFrameworkButton && (
              <button
                onClick={handleProceedToFramework}
                className="bg-[#a3e635] w-full mb-3 py-2.5 px-4 chat-input-button"
              >
                Proceed to Framework
              </button>
            )}
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                onKeyPress={(e) => { if (e.key === 'Enter' && !isLoading) handleSubmit(false); }}
                placeholder="Ask a clarifying question..."
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--highlight-color)] focus:border-[var(--highlight-color)] outline-none text-gray-700 placeholder-gray-500 shadow-sm"
                disabled={isLoading}
              />
             <button
  onClick={() => handleSubmit(false)}
  disabled={isLoading || !currentQuestion.trim()}
  className="chat-input-button flex items-center justify-center"
>
  {isLoading ? (
    <>
      <svg
        className="animate-spin h-5 w-5 mr-2 text-gray-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      Sending...
    </>
  ) : (
    "Send"
  )}
</button>

            </div>
          </div>
        )}

        {appPhase === 'framework_input' && (
          <div className="w-full mt-auto pt-4 sticky bottom-0 bg-gray-50 pb-6 z-10">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Enter Your Framework</h3>
            <textarea
              value={frameworkText}
              onChange={(e) => setFrameworkText(e.target.value)}
              placeholder="Describe your framework structure here (e.g., Profitability = Revenues - Costs; Revenues = Price x Volume...)"
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--highlight-color)] focus:border-[var(--highlight-color)] outline-none text-gray-700 placeholder-gray-500 mb-3 shadow-sm"
              disabled={isLoading || isDiagramLoading}
            />
            <button
              onClick={() => handleSubmit(true)}
              disabled={isLoading || isDiagramLoading || !frameworkText.trim()}
              className="w-full mb-2 py-2.5 px-4 chat-input-button"
            >
              {(isLoading || isDiagramLoading) ? 'Processing...' : 'Submit Framework for Evaluation'}
            </button>
              <button
                onClick={() => setAppPhase('clarifying')}
                className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm text-gray-600 hover:bg-gray-200 transition-colors duration-150 shadow-sm border border-gray-300"
                disabled={isLoading || isDiagramLoading}
              >
                Back to Questions
              </button>
          </div>
        )}

        {appPhase === 'case_ended' && (
            <div className="w-full">
                <div className="w-full bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-4">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">🎉 Case Complete!</h3>
                    <p className="text-gray-600 text-center mb-4">
                        {frameworkText ?
                            "Great job! You've completed the case by submitting your framework. Review your performance and consider practicing more cases to further improve your consulting skills." :
                            "You've completed the maximum number of clarifying questions (10). Time to develop and submit a framework for this case!"
                        }
                    </p>

                    {mermaidDiagramCode && (
                        <div className="w-full my-4 mermaid-diagram-container">
                            <h4 className="text-lg font-semibold text-gray-700 mb-3">Your Framework Visualization:</h4>
                            {isDiagramLoading && <p className="text-gray-500 text-center py-4">Generating diagram...</p>}
                            {!isDiagramLoading && diagramError &&
                                <div className="text-red-600 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <strong>Diagram Error:</strong> {diagramError}
                                </div>
                            }
                            <div ref={mermaidDivRef} className="mermaid">
                                {/* Content injected by useEffect */}
                            </div>
                            {!isDiagramLoading && !diagramError && !mermaidDiagramCode && mermaidAPI &&
                             <p className="text-gray-500 text-sm text-center py-4">No diagram generated or framework was not suitable for visualization.</p>
                            }
                            {!mermaidAPI && !isDiagramLoading &&
                                <p className="text-red-500 text-sm text-center py-4">Mermaid library could not be loaded. Diagrams are unavailable.</p>
                            }
                        </div>
                    )}
                </div>

                <div className="w-full mt-auto pt-4 sticky bottom-0 bg-gray-50 pb-6 z-10">
                  <div className="flex gap-3">
                    <button
                      onClick={onBack}
                      className="flex-1 py-2.5 px-4 chat-input-button"
                    >
                      Back to Sprints
                    </button>
                    <button
                      onClick={() => {
                          setChatHistory([]);
                          setAppPhase('clarifying');
                          setFrameworkText('');
                          setMermaidDiagramCode('');
                          setDiagramError('');
                          setError('');
                          setCurrentQuestion('');
                      }}
                      className="flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm text-gray-600 hover:bg-gray-200 transition-colors duration-150 shadow-sm border border-gray-300"
                    >
                      Start New Case
                    </button>
                  </div>
                </div>
            </div>
        )}

        {/* Framework Submission Confirmation Popup */}
        {showFrameworkPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-30" onClick={() => setShowFrameworkPopup(false)}></div>
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 z-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Enter Your Framework</h3>
                <button onClick={() => setShowFrameworkPopup(false)} className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-700 mb-4">
                Please provide a structured framework for the water purifier profitability case.
                For better visualization, clearly explain the relationships between different factors.
              </p>

              <textarea
                value={frameworkText}
                onChange={(e) => setFrameworkText(e.target.value)}
                placeholder="Describe your framework structure here (e.g., Profitability = Revenues - Costs; Revenues = Price x Volume...)"
                rows={8}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--highlight-color)] focus:border-[var(--highlight-color)] outline-none text-gray-700 placeholder-gray-500 mb-4 shadow-sm"
                disabled={isLoading || isDiagramLoading}
              />

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (!frameworkText.trim()) {
                      setError('Please enter your framework before submitting.');
                      return;
                    }
                    setShowFrameworkPopup(false);
                    handleSubmit(true);
                  }}
                  className="flex-1 py-2.5 px-4 chat-input-button"
                  disabled={isLoading || isDiagramLoading || !frameworkText.trim()}
                >
                  {(isLoading || isDiagramLoading) ? 'Processing...' : 'Submit Framework for Evaluation'}
                </button>
                <button
                  onClick={() => setShowFrameworkPopup(false)}
                  className="flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm text-gray-600 hover:bg-gray-200 transition-colors duration-150 shadow-sm border border-gray-300"
                  disabled={isLoading || isDiagramLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};