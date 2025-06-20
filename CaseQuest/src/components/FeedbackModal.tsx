
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FeedbackData {
  problemSolvingSkills: number;
  clarityRealism: number;
  userExperience: number;
  recommendation: number;
  suggestions: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedback, setFeedback] = useState<FeedbackData>({
    problemSolvingSkills: 0,
    clarityRealism: 0,
    userExperience: 0,
    recommendation: 0,
    suggestions: ''
  });

  const questions = [
    {
      key: 'problemSolvingSkills' as keyof FeedbackData,
      text: 'How helpful was this case in improving your problem-solving skills?'
    },
    {
      key: 'clarityRealism' as keyof FeedbackData,
      text: 'How clear and realistic was the case prompt and information provided?'
    },
    {
      key: 'userExperience' as keyof FeedbackData,
      text: 'How smooth and intuitive was your overall experience using the interface?'
    },
    {
      key: 'recommendation' as keyof FeedbackData,
      text: 'How likely are you to recommend this platform to a peer practicing case interviews?'
    }
  ];

  const handleStarClick = (questionKey: keyof FeedbackData, rating: number) => {
    setFeedback(prev => ({
      ...prev,
      [questionKey]: rating
    }));
  };

  const handleSubmit = () => {
    // Here you can save the feedback data to localStorage or send to backend
    console.log('Feedback submitted:', feedback);
    
    // Store feedback in localStorage for now
    const existingFeedback = JSON.parse(localStorage.getItem('caseFeedback') || '[]');
    existingFeedback.push({
      ...feedback,
      timestamp: new Date().toISOString(),
      caseId: 3 // Water Purifier case
    });
    localStorage.setItem('caseFeedback', JSON.stringify(existingFeedback));

    // Reset form and close modal
    setFeedback({
      problemSolvingSkills: 0,
      clarityRealism: 0,
      userExperience: 0,
      recommendation: 0,
      suggestions: ''
    });
    onClose();
  };

  const isFormValid = () => {
    return feedback.problemSolvingSkills > 0 && 
           feedback.clarityRealism > 0 && 
           feedback.userExperience > 0 && 
           feedback.recommendation > 0;
  };

  const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="transition-colors duration-200"
          >
            <Star
              className={`w-6 h-6 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 hover:text-yellow-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Case Feedback
          </DialogTitle>
          <p className="text-sm text-gray-600 text-center mt-2">
            Please rate your experience to help us improve the platform
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {questions.map((question, index) => (
            <div key={question.key} className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">
                {index + 1}. {question.text}
              </h3>
              <StarRating
                rating={feedback[question.key] as number}
                onRatingChange={(rating) => handleStarClick(question.key, rating)}
              />
            </div>
          ))}

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">
              Any suggestions for improving the case or the platform? (Optional)
            </h3>
            <Textarea
              value={feedback.suggestions}
              onChange={(e) => setFeedback(prev => ({ ...prev, suggestions: e.target.value }))}
              placeholder="Share your thoughts on how we can improve..."
              className="min-h-[80px] resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            Submit Feedback
          </Button>
        </div>

        {!isFormValid() && (
          <p className="text-xs text-red-500 text-center mt-2">
            Please rate all questions before submitting
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
