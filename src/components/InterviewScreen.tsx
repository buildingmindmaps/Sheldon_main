
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mic, Video, Monitor, ArrowRight, Users } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

export function InterviewScreen() {
  const isMobile = useIsMobile();
  
  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-brand-green to-green-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Consulting Case Interview #1</h3>
            <p className="text-xs text-gray-500">Market Entry Strategy</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Medium</span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">20 min</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row p-3 gap-3 overflow-hidden">
        {/* Video area */}
        <div className="flex-1 min-w-0">
          <div className="rounded-lg overflow-hidden bg-gray-900 h-[280px] relative">
            {/* Interviewer - centered in the call */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-brand-green to-green-400 opacity-90 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">AI</span>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs py-1 px-2 rounded">
                AI Interviewer
              </div>
            </div>
            
            {/* User camera - properly positioned */}
            <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700">
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            
            {/* Controls */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/40 rounded-full px-4 py-2 flex items-center space-x-6">
              <Mic className="h-5 w-5 text-white" />
              <Video className="h-5 w-5 text-white" />
              <Monitor className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Question description */}
          <Card className="mt-3 p-3 text-sm">
            <p className="font-medium">Help McKinsey analyze the launch of a new sports beverage</p>
            <p className="text-xs text-gray-600 mt-1">
              Consider market size, competition, pricing strategy, and distribution channels
            </p>
          </Card>
        </div>

        {/* Chat transcript - reduced font size */}
        <div className="w-full md:w-[250px] bg-white rounded-lg border border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <h4 className="font-medium text-sm">Transcript</h4>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-brand-green to-green-400 rounded-full flex-shrink-0 flex items-center justify-center">
                <span className="text-white text-[8px] font-medium">AI</span>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg text-[11px] max-w-[80%]">
                <p>Let's start with market sizing. What's the total addressable market for sports beverages?</p>
              </div>
            </div>
            <div className="flex items-start gap-2 justify-end">
              <div className="bg-black text-white p-2 rounded-lg text-[11px] max-w-[80%]">
                <p>I'd start by estimating the population and percentage of active consumers...</p>
              </div>
              <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
                <Users className="h-3 w-3 text-gray-500" />
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-brand-green to-green-400 rounded-full flex-shrink-0 flex items-center justify-center">
                <span className="text-white text-[8px] font-medium">AI</span>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg text-[11px] max-w-[80%]">
                <p>Good approach. What factors might influence market growth?</p>
              </div>
            </div>
          </div>
          <div className="p-3 border-t border-gray-200">
            <div className="relative">
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-full px-4 py-2 pr-10 text-xs" 
                placeholder="Type your response..."
              />
              <div className="absolute right-3 top-2 w-5 h-5 bg-gradient-to-r from-brand-green to-green-400 rounded-full flex items-center justify-center">
                <ArrowRight className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related cases with proper names */}
      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">More like this</h4>
          <Button variant="ghost" size="sm" className="text-xs h-7">
            Browse all cases
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Card className="p-2 min-w-[180px] flex-shrink-0">
            <div className="flex gap-2 items-start">
              <div className="w-8 h-8 bg-gradient-to-r from-brand-green to-green-400 rounded-full flex-shrink-0 flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium">Market Expansion Strategy</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Consulting</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0.5 rounded-full">Medium</span>
                  <span className="text-[10px] text-gray-500">25 min</span>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-2 min-w-[180px] flex-shrink-0">
            <div className="flex gap-2 items-start">
              <div className="w-8 h-8 bg-gradient-to-r from-brand-green to-green-400 rounded-full flex-shrink-0 flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium">Pricing Strategy Analysis</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Consulting</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0.5 rounded-full">Medium</span>
                  <span className="text-[10px] text-gray-500">25 min</span>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-2 min-w-[180px] flex-shrink-0">
            <div className="flex gap-2 items-start">
              <div className="w-8 h-8 bg-gradient-to-r from-brand-green to-green-400 rounded-full flex-shrink-0 flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium">Merger Acquisition Case</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Consulting</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0.5 rounded-full">Medium</span>
                  <span className="text-[10px] text-gray-500">25 min</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
