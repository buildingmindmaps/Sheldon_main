
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mic, MicOff, Volume2, VolumeX, Clock, Play, Pause, Send, RotateCcw } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

interface CaseInterviewProps {
  onBack: () => void;
}

interface ChatMessage {
  role: "user" | "assistant" | "model";
  content: string;
}

export function CaseInterview({ onBack }: CaseInterviewProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      role: "assistant", 
      content: "Welcome to your case interview! I'm here to guide you through a market entry case. Let's start by understanding the problem. A major consumer goods company is considering entering the Indian market with their premium skincare line. What would be your initial approach to evaluate this opportunity?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const addMessage = (message: ChatMessage) => {
    setChatMessages(prev => [...prev, message]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage: ChatMessage = { role: "user", content: inputMessage };
    addMessage(userMessage);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great start! Market sizing is indeed crucial. Can you walk me through how you would structure your approach to estimate the market size for premium skincare in India?",
        "Excellent point about competition analysis. What specific factors would you consider when evaluating the competitive landscape?",
        "Good thinking on the go-to-market strategy. What distribution channels do you think would be most effective for a premium skincare brand in India?",
        "That's a thoughtful approach. Let's dive deeper into the regulatory considerations. What compliance requirements should the company be aware of?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const aiMessage: ChatMessage = { role: "assistant", content: randomResponse };
      addMessage(aiMessage);
      setIsLoading(false);
    }, 2000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    const isUser = message.role === "user";
    const isModel = message.role === "model";
    
    return (
      <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[80%] p-4 rounded-lg ${
          isUser 
            ? 'bg-[#a3e635] text-black' 
            : isModel
            ? 'bg-blue-100 text-blue-900'
            : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onBack}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Case Interview Practice</h1>
              <p className="text-sm text-gray-600">Market Entry Analysis</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formatTime(timeElapsed)}</span>
            </div>
            <Badge variant="outline" className="bg-[#a3e635]/10 text-[#65a30d] border-[#a3e635]/30">
              Step {currentStep} of 5
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="text-lg">Interview Chat</CardTitle>
                <CardDescription>
                  Discuss your approach with the AI interviewer
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {chatMessages.map((message, index) => renderMessage(message, index))}
                  
                  {isLoading && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-gray-100 text-gray-900 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="animate-pulse flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          <span className="text-sm text-gray-500">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={chatEndRef} />
                </div>
              </CardContent>
              
              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex gap-3">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your response here..."
                    className="min-h-[80px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-[#a3e635] hover:bg-[#84cc16] text-black"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Audio Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Audio Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Microphone</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRecording(!isRecording)}
                    className={isRecording ? 'bg-red-50 border-red-200 text-red-700' : ''}
                  >
                    {isRecording ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Speaker</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Playback</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progress Tracker */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interview Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { step: 1, title: "Problem Setup", completed: true },
                    { step: 2, title: "Market Sizing", completed: currentStep > 2 },
                    { step: 3, title: "Competition Analysis", completed: currentStep > 3 },
                    { step: 4, title: "Go-to-Market", completed: currentStep > 4 },
                    { step: 5, title: "Recommendation", completed: currentStep > 5 }
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                        item.completed 
                          ? 'bg-[#a3e635] text-black' 
                          : currentStep === item.step
                          ? 'bg-[#a3e635]/20 text-[#65a30d] border-2 border-[#a3e635]'
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {item.completed ? '✓' : item.step}
                      </div>
                      <span className={`text-sm ${
                        item.completed || currentStep === item.step ? 'text-gray-900 font-medium' : 'text-gray-500'
                      }`}>
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
                
                {currentStep < 5 && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setCurrentStep(prev => Math.min(prev + 1, 5))}
                  >
                    Next Step
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setChatMessages([{
                      role: "assistant",
                      content: "Let's restart the interview. I'm here to guide you through a market entry case..."
                    }]);
                    setCurrentStep(1);
                    setTimeElapsed(0);
                  }}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restart Interview
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={onBack}
                >
                  End Interview
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
