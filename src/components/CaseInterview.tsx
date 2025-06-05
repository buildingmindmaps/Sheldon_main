
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface CaseInterviewProps {
  onBack: () => void;
}

export function CaseInterview({ onBack }: CaseInterviewProps) {
  const [currentInput, setCurrentInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulated AI responses for different types of questions
  const getAIResponse = (userQuestion: string): string => {
    const question = userQuestion.toLowerCase();
    
    if (question.includes('water purifier') || question.includes('what is')) {
      return "A water purifier is a device that removes undesirable chemicals, biological contaminants, suspended solids, and gases to produce water suitable for drinking. In the context of our case, it's a product sold to residential customers in India by our client, a manufacturer competing in a market with other water purifier companies. The specific technology used (e.g., RO, UV, etc.) and the features offered (e.g., mineral retention, smart features) are not yet specified and may be relevant to our analysis later.";
    }
    
    if (question.includes('market size') || question.includes('market')) {
      return "The Indian water purifier market has been growing steadily, valued at approximately $2.5 billion in 2023. The residential segment accounts for about 70% of the total market. Key factors driving growth include increasing awareness about water quality, urbanization, and rising disposable incomes. However, for our profitability analysis, we should focus on understanding our client's specific market position and competitive dynamics.";
    }
    
    if (question.includes('competitor') || question.includes('competition')) {
      return "The Indian water purifier market has several key players including Eureka Forbes (Aquaguard), Kent, Pureit (HUL), Blue Star, and regional brands. Competition is intense with players competing on technology, price, distribution, and brand trust. To understand our client's profitability issue, we should examine how they compare to these competitors in terms of pricing strategy, cost structure, and market positioning.";
    }
    
    if (question.includes('revenue') || question.includes('sales')) {
      return "Our client's revenue comes primarily from water purifier sales to residential customers. We should break this down into units sold × average selling price. Key questions to explore: Has there been a decline in units sold or average selling price? How does their pricing compare to competitors? Are there seasonal patterns or regional variations in sales?";
    }
    
    if (question.includes('cost') || question.includes('expense')) {
      return "For a water purifier manufacturer, key cost components typically include: Raw materials (30-40%), Manufacturing/Assembly (15-20%), Distribution & Logistics (10-15%), Marketing & Sales (15-20%), R&D (3-5%), and General Admin (5-10%). We should analyze which cost categories have increased relative to competitors and identify potential optimization opportunities.";
    }
    
    if (question.includes('distribution') || question.includes('channel')) {
      return "Water purifier distribution typically involves multiple channels: Direct sales, Retail partnerships (electronics stores, appliance stores), Online platforms, and Service center networks. Each channel has different margin structures. We should examine if our client's channel mix is optimal and whether their distribution costs are higher than competitors.";
    }
    
    // Default response for other questions
    return "That's a good question to explore further. In consulting case interviews, it's important to structure your thinking systematically. Consider breaking down your analysis into revenue drivers and cost components, then dive deeper into each area to identify the root cause of the profitability issue.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || isLoading || questionsAsked >= 10) return;

    const userQuestion = currentInput.trim();
    setCurrentInput('');
    setIsLoading(true);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: userQuestion,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setQuestionsAsked(prev => prev + 1);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = getAIResponse(userQuestion);
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1500); // Random delay between 1-2.5 seconds
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-medium">Case Sprint: Water Purifier</h1>
            <p className="text-sm text-gray-600">Hone your consulting skills with AI-driven scenarios.</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Case Statement */}
        <div className="bg-white rounded-lg border-2 border-blue-200 p-6 mb-8">
          <h2 className="text-xl font-medium text-blue-600 mb-4">Case Statement:</h2>
          <p className="text-gray-800 leading-relaxed">
            Your client is a water purifier manufacturer in India, focused on residential customers. The client is 
            experiencing lower profitability (defined as EBITDA/Revenue) compared to competitors. They have 
            hired you to analyze the issue and provide recommendations.
          </p>
        </div>

        {/* Conversation Area */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`inline-flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`text-sm font-medium ${message.type === 'user' ? 'text-blue-600' : 'text-gray-700'}`}>
                      {message.type === 'user' ? 'You:' : 'AI Coach:'}
                    </div>
                  </div>
                  <div className={`mt-1 p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white ml-12' 
                      : 'bg-gray-100 text-gray-800 mr-12'
                  }`}>
                    {message.type === 'ai' ? (
                      <div>
                        <div className="font-medium mb-2">Answer:</div>
                        <div className="leading-relaxed">{message.content}</div>
                        {questionsAsked < 10 && (
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <div className="font-medium">Evaluation:</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-3xl">
                  <div className="text-sm font-medium text-gray-700 mb-1">AI Coach:</div>
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg mr-12">
                    <div className="flex items-center gap-2">
                      <div className="animate-pulse">Thinking...</div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-6">
            <div className="mb-4 text-center">
              <p className="text-sm text-gray-600">Questions asked: {questionsAsked}/10</p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Ask a clarifying question..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading || questionsAsked >= 10}
              />
              <Button
                type="submit"
                disabled={!currentInput.trim() || isLoading || questionsAsked >= 10}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
            </form>
            
            {questionsAsked >= 10 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-blue-800 font-medium">Question limit reached!</p>
                <p className="text-blue-600 text-sm mt-1">You've asked all 10 questions. Time to provide your analysis and recommendations.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
