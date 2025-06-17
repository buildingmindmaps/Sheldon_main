
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Calendar } from 'lucide-react';

const PlaybookArticle = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center border-b">
            <div className="flex justify-center space-x-2 mb-4">
              <Badge variant="secondary">Strategy</Badge>
              <Badge variant="outline">Framework Analysis</Badge>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
              Business Case Framework Analysis
            </CardTitle>
            <div className="flex justify-center items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                Case Coach
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Latest Guide
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                5 min read
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Understanding Framework Analysis
              </h2>
              
              <p className="mb-6 text-gray-700 leading-relaxed">
                A structured approach to business case analysis involves breaking down complex problems 
                into manageable components. This methodology helps consultants and business analysts 
                provide comprehensive solutions that address all aspects of a given challenge.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Key Components of Analysis
              </h3>
              
              <ul className="mb-6 space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Case Statement Analysis:</strong> Understanding the core problem and context</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Framework Development:</strong> Creating a structured approach to problem-solving</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Question Formulation:</strong> Developing insightful clarifying questions</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Feedback Integration:</strong> Incorporating model responses and feedback</span>
                </li>
              </ul>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">Pro Tip</h4>
                <p className="text-blue-700">
                  When analyzing frameworks, always consider both the model's response and any feedback 
                  provided. This comprehensive approach ensures that your analysis captures all relevant 
                  insights and addresses potential gaps in reasoning.
                </p>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Enhanced Analysis Process
              </h3>
              
              <p className="mb-4 text-gray-700">
                Our enhanced analysis process now includes:
              </p>
              
              <ol className="mb-6 space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">1</span>
                  <span>Comprehensive prompt construction with case statement and framework</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">2</span>
                  <span>Integration of user questions and their associated feedback</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">3</span>
                  <span>Model response analysis and structured feedback incorporation</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">4</span>
                  <span>JSON-formatted output for systematic evaluation</span>
                </li>
              </ol>
              
              <div className="bg-gray-100 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Sample Analysis Structure</h4>
                <pre className="text-sm text-gray-700 overflow-x-auto">
{`{
  "strengths": [
    "Clear problem identification",
    "Comprehensive framework approach",
    "Insightful clarifying questions"
  ],
  "weaknesses": [
    "Limited market analysis",
    "Insufficient risk assessment",
    "Missing implementation timeline"
  ],
  "recommendations": [
    "Expand market research scope",
    "Develop detailed risk mitigation plan",
    "Create phased implementation strategy"
  ]
}`}
                </pre>
              </div>
              
              <p className="text-gray-700">
                This enhanced approach ensures that all aspects of the case analysis are thoroughly 
                evaluated, providing users with comprehensive feedback that helps improve their 
                consulting and analytical skills.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlaybookArticle;
