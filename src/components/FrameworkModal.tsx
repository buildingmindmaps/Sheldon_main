import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { VoiceVisualizer } from './VoiceVisualizer';

interface FrameworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (framework: string) => void;
}

export const FrameworkModal = ({ isOpen, onClose, onSubmit }: FrameworkModalProps) => {
  const [frameworkText, setFrameworkText] = useState('');

  const { isRecording, start, stop, isSupported, volume } = useSpeechToText({
    onTranscript: (transcript) => {
      setFrameworkText(transcript);
    }
  });

  const handleMicClick = () => {
    if (isRecording) {
      stop();
    } else {
      start(frameworkText);
    }
  };

  const handleSubmit = () => {
    if (frameworkText.trim()) {
      onSubmit(`Approach: ${frameworkText}`);
      setFrameworkText('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Enter Your Framework
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Please provide a structured framework for the water purifier profitability case. For better 
            visualization, clearly explain the relationships between different factors.
          </p>
          
          <div className="relative">
            <Textarea
              value={frameworkText}
              onChange={(e) => setFrameworkText(e.target.value)}
              placeholder="Describe your framework structure here or use the microphone to dictate..."
              className="min-h-[200px] resize-none pr-12"
              disabled={isRecording}
            />
            <div className="absolute bottom-3 right-3">
              <Button
                size="icon"
                variant={isRecording ? "ghost" : "outline"}
                onClick={handleMicClick}
                disabled={!isSupported}
                title={isRecording ? "Stop recording" : "Start recording"}
                className={isRecording ? 'p-0 rounded-full' : ''}
              >
                {isRecording ? (
                  <VoiceVisualizer volume={volume} />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!frameworkText.trim() || isRecording}
              className="bg-gray-700 hover:bg-gray-800"
            >
              Submit Framework for Evaluation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
