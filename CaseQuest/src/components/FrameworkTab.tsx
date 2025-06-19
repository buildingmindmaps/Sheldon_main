import React, { useEffect, useState, useRef } from 'react';
import mermaid from 'mermaid';
import { generateFrameworkAnalysis, generateFlowchartVisualization, type FrameworkAnalysis } from '../services/analysisService';
import type { Question, ConversationMessage } from '../../src/components/CaseInterview';

interface FrameworkTabProps {
  frameworkText: string;
  questions: Question[];
  caseStatement: string;
  conversation: ConversationMessage[];
}

// Helper component for displaying loading spinner
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center p-10">
    <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="mt-4 text-gray-600">Generating framework visualization...</p>
  </div>
);

// Helper component for displaying an error message
const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
    <strong className="font-bold">Error: </strong> 
    <span className="block sm:inline">{message}</span>
  </div>
);

export const FrameworkTab: React.FC<FrameworkTabProps> = ({ frameworkText, questions, caseStatement, conversation }) => {
  const [mermaidCode, setMermaidCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FrameworkAnalysis | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(true);
  const mermaidContainerRef = useRef<HTMLDivElement>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: 'default' });
  }, []);

  useEffect(() => {
    if (!frameworkText || hasGenerated) {
      if (!frameworkText) {
        setIsLoading(false);
        setError("No framework text was provided to generate a visualization.");
      }
      return;
    }

    const generateFlowchart = async () => {
      setIsLoading(true);
      setError(null);
      setMermaidCode('');

      try {
        const generatedCode = await generateFlowchartVisualization(frameworkText);
        setMermaidCode(generatedCode);
        setHasGenerated(true);
      } catch (err: any) {
        console.error("API or Data Error:", err);
        setError(err.message || 'An unexpected error occurred while generating the flowchart.');
      } finally {
        setIsLoading(false);
      }
    };

    generateFlowchart();
  }, [frameworkText, hasGenerated]);

  useEffect(() => {
    if (mermaidCode && mermaidContainerRef.current) {
      try {
        const renderMermaid = async () => {
          mermaidContainerRef.current!.innerHTML = ''; 
          const diagramId = `mermaid-diagram-${Date.now()}`;
          const { svg } = await mermaid.render(diagramId, mermaidCode);
          if (mermaidContainerRef.current) {
            mermaidContainerRef.current.innerHTML = svg;
          }
        };
        renderMermaid();
      } catch (e: any) {
        console.error('Mermaid rendering error:', e);
        setError('Failed to render the flowchart. The diagram syntax may be invalid.');
      }
    }
  }, [mermaidCode]);

  // Generate dynamic analysis
  useEffect(() => {
    if (!frameworkText || !questions.length) {
      setIsAnalysisLoading(false);
      return;
    }

    const generateAnalysis = async () => {
      setIsAnalysisLoading(true);
      try {
        const analysisResult = await generateFrameworkAnalysis(frameworkText);
        setAnalysis(analysisResult);
      } catch (error) {
        console.error('Error generating analysis:', error);
      } finally {
        setIsAnalysisLoading(false);
      }
    };

    generateAnalysis();
  }, [frameworkText, questions, caseStatement, conversation]);

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* User's Framework */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Framework</h3>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-800 whitespace-pre-wrap">{frameworkText}</p>
          </div>
        </div>

        {/* Mermaid Diagram */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Framework Visualization</h3>
          <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[250px] flex justify-center items-center">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorDisplay message={error} />}
            {!isLoading && !error && <div ref={mermaidContainerRef} className="w-full"></div>}
          </div>
        </div>

        {/* Dynamic Framework Analysis */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Framework Analysis</h3>
          {isAnalysisLoading ? (
            <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
              <p className="text-gray-600">Generating personalized analysis...</p>
            </div>
          ) : analysis ? (
            <div className="bg-blue-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Strengths of Your Approach:</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index}>• {strength}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Areas for Enhancement:</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  {analysis.weaknesses.map((weakness, index) => (
                    <li key={index}>• {weakness}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-blue-900 mb-2">Recommendations:</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index}>• {recommendation}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Strengths of Your Approach:</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Clear structure addressing both revenue and cost components</li>
                  <li>• Good identification of key profitability drivers</li>
                  <li>• Logical flow from high-level to specific factors</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Areas for Enhancement:</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Consider adding competitive benchmarking dimension</li>
                  <li>• Include market segmentation analysis</li>
                  <li>• Add timeline for implementation of recommendations</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
