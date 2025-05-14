
import React from 'react';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function LiveBattleFeature() {
  return (
    <Card className="p-6 overflow-hidden relative hover:shadow-md transition-all">
      <h3 className="text-xl font-bold mb-4">Live 1-v-1 Case Battles</h3>
      
      <div className="flex flex-col items-center">
        {/* Battle Score UI */}
        <div className="bg-white rounded-xl p-4 w-full max-w-md shadow-sm mb-6">
          <div className="flex justify-between items-center mb-3">
            <div className="flex flex-col items-center">
              <Avatar className="h-12 w-12 border-2 border-brand-green">
                <AvatarImage src="/placeholder.svg" alt="Alex" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <span className="mt-1 font-medium text-sm">Alex</span>
              <span className="text-xs text-gray-500">Harvard MBA</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 text-purple-700 font-semibold text-xl rounded-lg px-3 py-1">78</div>
              <span className="font-bold">vs</span>
              <div className="bg-blue-100 text-blue-700 font-semibold text-xl rounded-lg px-3 py-1">72</div>
            </div>
            
            <div className="flex flex-col items-center">
              <Avatar className="h-12 w-12 border-2 border-brand-green">
                <AvatarImage src="/placeholder.svg" alt="Jamie" />
                <AvatarFallback>J</AvatarFallback>
              </Avatar>
              <span className="mt-1 font-medium text-sm">Jamie</span>
              <span className="text-xs text-gray-500">Wharton MBA</span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="flex w-full h-full">
              <div className="bg-purple-400 h-full" style={{ width: "52%" }}></div>
              <div className="bg-blue-400 h-full" style={{ width: "48%" }}></div>
            </div>
          </div>
          <div className="text-right text-xs text-gray-500 mt-1">02:45 remaining</div>
          
          {/* Challenge */}
          <div className="mt-4 border border-gray-100 rounded-lg p-4">
            <div className="text-center font-medium mb-2">Current Challenge:</div>
            <p className="text-center text-gray-700">How should Tesla approach the Indian electric vehicle market?</p>
            
            <div className="flex justify-between mt-4">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Strategy</Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Market Entry</Badge>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 text-center max-w-md">
          Challenge your peers to real-time case competitions and get instant feedback on your problem-solving approach and presentation skills.
        </p>
      </div>
    </Card>
  );
}
