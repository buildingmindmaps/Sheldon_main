import React, { useState, useEffect, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAuth } from '@/lib/AuthContext';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

// In a real project, import these from 'lucide-react'
// import { Search, Settings, UserCircle, XCircle, ArrowLeft } from 'lucide-react';

import DOMPurify from 'dompurify';

// Define API base URL for backend calls
const API_BASE_URL = 'http://localhost:5001/api';

//<editor-fold desc="TypeScript Types and Interfaces">
interface SWOTAppProps {
  onBack: () => void;
}

interface AppTheme {
  colors: {
    background: string;
    primary: string;
    lightBlue: string;
    buttonText: string;
    gradients: {
      purple: { start: string; end: string; };
      green: { start: string; end: string; };
      blue: { start: string; end: string; };
    };
  };
}

interface ModulePartType {
  title: string;
  content: string;
  interactionType?: 'quiz' | 'drag-drop' | 'image' | 'interactive-matrix' | 'drag-drop-matching';
  imageSrc?: string;
  imageAlt?: string;
  quizQuestions?: {
    question: string;
    options: string[];
    correctOption: number;
  }[];
  dragDropItems?: {
    id: string;
    type: 'strength' | 'weakness' | 'opportunity' | 'threat';
    content: string;
  }[];
  matchingItems?: {
    id: string;
    category: string;
    items: { id: string; content: string }[];
  }[];
}

interface SWOTMatrix {
  strengths: { id: string; content: string }[];
  weaknesses: { id: string; content: string }[];
  opportunities: { id: string; content: string }[];
  threats: { id: string; content: string }[];
}

interface SortableItemProps {
  id: string;
  content: string;
}

// Include any other types and interfaces from your original file
//</editor-fold>

//<editor-fold desc="Main App Component">
export const SWOTApp: FC<SWOTAppProps> = ({ onBack }) => {
  const [currentPartIndex, setCurrentPartIndex] = useState<number>(0);
  const [completedParts, setCompletedParts] = useState<Set<number>>(new Set());
  const [showCompletion, setShowCompletion] = useState<boolean>(false);
  const { user, fetchUserProfile } = useAuth();
  const { toast } = useToast();

  // Function to mark SWOT module as completed
  const handleCompleteSWOTModule = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to track your SWOT progress.",
        variant: "destructive",
      });
      return;
    }
    const moduleId = 'business_frameworks_swot_app';
    try {
      await axios.put(`${API_BASE_URL}/users/modules-completed`, { moduleId });
      toast({
        title: "Success",
        description: "SWOT Analysis module marked as completed!",
      });
      await fetchUserProfile(); // Refresh user data in context
    } catch (error: any) {
      console.error('Error completing SWOT module:', error.response?.data?.message || error.message);
      toast({
        title: "Progress Update Failed",
        description: error.response?.data?.message || "Failed to mark SWOT module as completed.",
        variant: "destructive",
      });
    }
  };

  // Function to award XP for SWOT Analysis progress
  const handleGainSWOTXP = async (xpAmount: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to gain XP from SWOT.",
        variant: "destructive",
      });
      return;
    }
    try {
      await axios.put(`${API_BASE_URL}/users/add-xp`, { xpAmount });
      toast({
        title: "Success",
        description: `${xpAmount} XP gained from SWOT!`,
      });
      await fetchUserProfile(); // Refresh user data in context
    } catch (error: any) {
      console.error('Error gaining SWOT XP:', error.response?.data?.message || error.message);
      toast({
        title: "XP Update Failed",
        description: error.response?.data?.message || "Failed to add SWOT XP.",
        variant: "destructive",
      });
    }
  };

  const moduleContent: ModulePartType[] = [
    // Your module content array...
    { title: 'Introduction to SWOT Analysis', content: "<p><strong>SWOT analysis</strong> is a strategic planning framework used to identify and analyze an organization's internal <strong>Strengths</strong> and <strong>Weaknesses</strong>, as well as external <strong>Opportunities</strong> and <strong>Threats</strong>.</p><br><p>Imagine you're the CEO of a growing tech startup. To navigate the competitive landscape, you need a clear understanding of where your company excels and where it's vulnerable. That's where SWOT comes in.</p><br> <p>It is typically visualized in a simple 2x2 grid, allowing for a clear overview of factors that impact decision-making.</p>", interactionType: 'image', imageSrc: '', imageAlt: '' },
    // Add the rest of your module content here
  ];

  // Make sure to modify your handleComplete function to include the new authentication functionality
  const handleComplete = () => {
    setShowCompletion(true);

    // Add these lines to track module completion and award XP
    handleCompleteSWOTModule();
    handleGainSWOTXP(30); // Award 30 XP for completing the SWOT module
  };

  // Rest of your component code...

  return (
    // Your component UI...
    <div>
      {/* Your UI components */}
    </div>
  );
};
//</editor-fold>
