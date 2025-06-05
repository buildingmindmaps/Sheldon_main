
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CaseInterviewProps {
  onBack: () => void;
}

export function CaseInterview({ onBack }: CaseInterviewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI consultant. Let's work through this case together. What's your initial understanding of the water purifier market?"
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || isLoading) return;

    const userMessage = currentInput.trim();
    setCurrentInput('');
    setIsLoading(true);

    // Add user message
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);

    try {
      // Simulate AI response for demo
      setTimeout(() => {
        const responses = [
          "Excellent point! Let's dive deeper into that market segment. What factors do you think drive customer decision-making in this space?",
          "That's a great insight. Now, let's consider the competitive landscape. How would you assess the barriers to entry?",
          "Very good analysis. Let's think about the go-to-market strategy. What channels would be most effective for reaching our target customers?",
          "Interesting perspective. How would you structure the pricing model to maximize both market penetration and profitability?"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setMessages(prev => [...prev, { role: "assistant", content: randomResponse }]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I apologize, but I'm having trouble processing your request right now. Please try again." 
      }]);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-medium">Case Sprint: Water Purifier</h1>
              <p className="text-sm text-gray-600">AI-Powered Case Interview</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Progress: 1/5</span>
            <div className="w-32 h-2 bg-gray-200 rounded-full">
              <div className="w-1/5 h-full bg-[#a3e635] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-[#a3e635] text-black'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 text-gray-800 max-w-3xl px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t bg-white p-6">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Share your thoughts on the case..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a3e635] focus:border-transparent"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!currentInput.trim() || isLoading}
              className="px-6 py-3 bg-[#a3e635] hover:bg-[#84cc16] text-black font-medium rounded-lg disabled:opacity-50"
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
