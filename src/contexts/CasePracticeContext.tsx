import React, { createContext, useContext, useReducer } from 'react';
import { casePracticeApi } from '../services/casePracticeApi';

interface Question {
  id: number;
  text: string;
  answer: string;
  evaluation?: {
    relevance: string;
    depth: string;
    constructiveFeedback: string;
    rating?: string;
  };
  feedback?: 'excellent' | 'satisfactory' | 'needs-improvement' | 'critical';
  isLoading?: boolean;
}

interface CasePracticeState {
  currentSession: any | null;
  loading: boolean;
  error: string | null;
  questions: Question[];
  framework: string | null;
  isFrameworkSubmitted: boolean;
  performanceMetrics: any | null;
}

interface CasePracticeActions {
  startCase: (caseData: any) => Promise<any>;
  addQuestionAndResponse: (qaData: any) => Promise<any>;
  submitFramework: (frameworkContent: string) => Promise<any>;
  completeCase: (completionData: any) => Promise<any>;
  updateQuestionFeedback: (questionId: number, feedback: Question['feedback']) => void;
  resetSession: () => void;
}

interface CasePracticeContextType {
  state: CasePracticeState;
  actions: CasePracticeActions;
}

const CasePracticeContext = createContext<CasePracticeContextType | undefined>(undefined);

const initialState: CasePracticeState = {
  currentSession: null,
  loading: false,
  error: null,
  questions: [],
  framework: null,
  isFrameworkSubmitted: false,
  performanceMetrics: null,
};

type Action = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'START_SESSION'; payload: any }
  | { type: 'ADD_QUESTION'; payload: Question }
  | { type: 'UPDATE_QUESTION_FEEDBACK'; payload: { questionId: number; feedback: Question['feedback'] } }
  | { type: 'SUBMIT_FRAMEWORK'; payload: string }
  | { type: 'COMPLETE_SESSION'; payload: any }
  | { type: 'RESET_SESSION' };

const casePracticeReducer = (state: CasePracticeState, action: Action): CasePracticeState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'START_SESSION':
      return { 
        ...state, 
        currentSession: action.payload, 
        loading: false,
        questions: [],
        framework: null,
        isFrameworkSubmitted: false,
      };
    case 'ADD_QUESTION':
      return { 
        ...state, 
        questions: [...state.questions, action.payload], 
        loading: false 
      };
    case 'UPDATE_QUESTION_FEEDBACK':
      return {
        ...state,
        questions: state.questions.map(q => 
          q.id === action.payload.questionId 
            ? { ...q, feedback: action.payload.feedback }
            : q
        )
      };
    case 'SUBMIT_FRAMEWORK':
      return { 
        ...state, 
        framework: action.payload, 
        isFrameworkSubmitted: true, 
        loading: false 
      };
    case 'COMPLETE_SESSION':
      return { 
        ...state, 
        performanceMetrics: action.payload, 
        loading: false 
      };
    case 'RESET_SESSION':
      return initialState;
    default:
      return state;
  }
};

export const CasePracticeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log("CasePracticeProvider is rendering!"); // Add this
  const [state, dispatch] = useReducer(casePracticeReducer, initialState);

  const actions: CasePracticeActions = {
    // ... inside the 'actions' object

startCase: async (caseData) => {
  console.log('📝 Starting case with data:', caseData);

  // 💡 FIX: Check for an existing session OR if a session is currently being created.
  if (state.currentSession || state.loading) {
    console.warn('⚠️ A case session is already active or is being created. Skipping new request.');
    return state.currentSession;
  }

  // Convert caseStatement to string if it's an array
  const fixedCaseData = {
    ...caseData,
    caseStatement: Array.isArray(caseData.caseStatement)
      ? caseData.caseStatement.join(' ')
      : String(caseData.caseStatement),
  };

  try {
    dispatch({ type: 'SET_LOADING', payload: true });

    const response = await casePracticeApi.startCase(fixedCaseData);
    dispatch({ type: 'START_SESSION', payload: response.data });
    return response.data;
  } catch (error: any) {
    console.error('❌ [Context] Error starting case:', error);
    dispatch({ type: 'SET_ERROR', payload: error.message });
    throw error;
  }
},

// ... rest of the actions


addQuestionAndResponse: async (qaData) => {
      console.log('🎯 [Context] Adding Q&A with data:', qaData);
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        if (!state.currentSession) {
          console.error('❌ [Context] No active session found!');
          throw new Error('No active session');
        }

        console.log('📡 [Context] Calling API: addQuestionAndResponse for session:', state.currentSession._id);
        const response = await casePracticeApi.addQuestionAndResponse(
          state.currentSession._id, 
          qaData
        );
        console.log('✅ [Context] Q&A added successfully. Response:', response);
        
        const newQuestion: Question = {
          id: Date.now(),
          text: qaData.userQuestion,
          answer: qaData.aiResponse,
          evaluation: {
            relevance: qaData.feedback.relevance,
            depth: qaData.feedback.depth,
            constructiveFeedback: qaData.feedback.constructiveFeedback,
            rating: qaData.feedback.rating
          },
          feedback: qaData.feedback.rating as Question['feedback'],
          isLoading: false
        };
        
        dispatch({ type: 'ADD_QUESTION', payload: newQuestion });
        return response;
      } catch (error: any) {
        console.error('❌ [Context] Error adding Q&A:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    submitFramework: async (frameworkContent) => {
      console.log('🎯 [Context] Submitting framework:', frameworkContent);
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        if (!state.currentSession) {
          console.error('❌ [Context] No active session for framework submission!');
          throw new Error('No active session');
        }

        console.log('📡 [Context] Calling API: submitFramework for session:', state.currentSession._id);
        const response = await casePracticeApi.submitFramework(
          state.currentSession._id, 
          frameworkContent
        );
        console.log('✅ [Context] Framework submitted successfully. Response:', response);
        dispatch({ type: 'SUBMIT_FRAMEWORK', payload: frameworkContent });
        return response;
      } catch (error: any) {
        console.error('❌ [Context] Error submitting framework:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    completeCase: async (completionData) => {
      console.log('🎯 [Context] Completing case with data:', completionData);
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        if (!state.currentSession) {
          console.error('❌ [Context] No active session for completion!');
          throw new Error('No active session');
        }

        console.log('📡 [Context] Calling API: completeCase for session:', state.currentSession._id);
        const response = await casePracticeApi.completeCase(
          state.currentSession._id, 
          completionData
        );
        console.log('✅ [Context] Case completed successfully. Response:', response);
        dispatch({ type: 'COMPLETE_SESSION', payload: completionData });
        return response;
      } catch (error: any) {
        console.error('❌ [Context] Error completing case:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    updateQuestionFeedback: (questionId: number, feedback: Question['feedback']) => {
      console.log('🎯 [Context] Updating feedback for question:', questionId, feedback);
      dispatch({ type: 'UPDATE_QUESTION_FEEDBACK', payload: { questionId, feedback } });
    },

    resetSession: () => {
      console.log('🎯 [Context] Resetting session');
      dispatch({ type: 'RESET_SESSION' });
    },
  };

  return (
    <CasePracticeContext.Provider value={{ state, actions }}>
      {children}
    </CasePracticeContext.Provider>
  );
};

export const useCasePractice = (): CasePracticeContextType => {
  const context = useContext(CasePracticeContext);
  if (!context) {
    throw new Error('useCasePractice must be used within CasePracticeProvider');
  }
  return context;
};
