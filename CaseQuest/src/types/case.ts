// src/types/case.ts
// This interface represents the full data for a case module fetched from your API
export interface CaseModule {
  _id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  courseId: string;
  caseStatement: string;
  caseFacts: string[];
  caseConversation: string;
}