
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';

interface CaseProgress {
  caseId: number;
  completed: boolean;
  completedAt?: Date;
}

export const useCaseProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<CaseProgress[]>([]);

  useEffect(() => {
    if (user) {
      // Load progress from localStorage for now (can be replaced with Supabase later)
      const savedProgress = localStorage.getItem(`case_progress_${user.uid}`);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        setProgress(parsed.map((p: any) => ({
          ...p,
          completedAt: p.completedAt ? new Date(p.completedAt) : undefined
        })));
      } else {
        // Initialize with first case unlocked
        setProgress([
          { caseId: 3, completed: false }, // Water Purifier
          { caseId: 4, completed: false }, // Market Entry
          { caseId: 5, completed: false }  // XYZ
        ]);
      }
    }
  }, [user]);

  const saveProgress = (newProgress: CaseProgress[]) => {
    if (user) {
      setProgress(newProgress);
      localStorage.setItem(`case_progress_${user.uid}`, JSON.stringify(newProgress));
    }
  };

  const markCaseCompleted = (caseId: number) => {
    const newProgress = progress.map(p => 
      p.caseId === caseId 
        ? { ...p, completed: true, completedAt: new Date() }
        : p
    );
    saveProgress(newProgress);
  };

  const isCaseUnlocked = (caseId: number) => {
    // First case is always unlocked
    if (caseId === 3) return true;
    
    // Find the previous case
    const caseIndex = progress.findIndex(p => p.caseId === caseId);
    if (caseIndex <= 0) return true;
    
    const previousCase = progress[caseIndex - 1];
    return previousCase?.completed || false;
  };

  const isCaseCompleted = (caseId: number) => {
    return progress.find(p => p.caseId === caseId)?.completed || false;
  };

  return {
    progress,
    markCaseCompleted,
    isCaseUnlocked,
    isCaseCompleted
  };
};
