import React, { createContext, useContext, useReducer } from 'react';
import { casePracticeApi } from '../services/casePracticeApi'; // Assuming this path is correct

// Define the shape of your initial state
const initialState = {
  currentSession: null as any | null, // Use 'any' or a more specific type if currentSession has a known structure
  loading: false,
  error: null as string | null,
  questions: [] as any[], // Use 'any[]' or define your Question type from CaseInterview.tsx if needed
  framework: null as string | null,
  isFrameworkSubmitted: false,
  performanceMetrics: null as any | null, // Use 'any' or a more specific type if performanceMetrics has a known structure
};

// Define the type for your context's actions
interface CasePracticeActions {
  startCase: (caseData: any) => Promise<any>;
  addQuestionAndResponse: (qaData: any) => Promise<any>;
  submitFramework: (frameworkContent: string) => Promise<any>;
  completeCase: (completionData: any) => Promise<any>;
  resetSession: () => void;
}

// Define the type for your context's value
interface CasePracticeContextType {
  state: typeof initialState;
  actions: CasePracticeActions;
}

// Provide a default value that matches the CasePracticeContextType interface
// This dummy value is used when useContext is called outside of a Provider,
// which is caught by the 'if (!context)' check in useCasePractice.
const CasePracticeContext = createContext<CasePracticeContextType>({
  state: initialState, // Use your actual initialState for the default state
  actions: {
    // Provide dummy implementations for the actions
    startCase: async (caseData: any) => { console.warn("startCase called outside of Provider"); return Promise.resolve(null); },
    addQuestionAndResponse: async (qaData: any) => { console.warn("addQuestionAndResponse called outside of Provider"); return Promise.resolve(null); },
    submitFramework: async (frameworkContent: string) => { console.warn("submitFramework called outside of Provider"); return Promise.resolve(null); },
    completeCase: async (completionData: any) => { console.warn("completeCase called outside of Provider"); return Promise.resolve(null); },
    resetSession: () => { console.warn("resetSession called outside of Provider"); },
  }
});

const casePracticeReducer = (state: typeof initialState, action: { type: string; payload?: any }) => {
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
  const [state, dispatch] = useReducer(casePracticeReducer, initialState);

  // Memoize actions to prevent unnecessary re-renders of consumers
  const actions = React.useMemo<CasePracticeActions>(() => ({
    startCase: async (caseData) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await casePracticeApi.startCase(caseData);
        dispatch({ type: 'START_SESSION', payload: response.data });
        return response.data;
      } catch (error: any) { // Type 'any' for error to access message property
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    addQuestionAndResponse: async (qaData) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        // Ensure currentSession._id is not null before using
        if (!state.currentSession?._id) {
            throw new Error("No active session to add question to.");
        }
        const response = await casePracticeApi.addQuestionAndResponse(
          state.currentSession._id,
          qaData
        );
        dispatch({ type: 'ADD_QUESTION', payload: qaData });
        return response;
      } catch (error: any) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    submitFramework: async (frameworkContent) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        // Ensure currentSession._id is not null before using
        if (!state.currentSession?._id) {
            throw new Error("No active session to submit framework for.");
        }
        const response = await casePracticeApi.submitFramework(
          state.currentSession._id,
          frameworkContent
        );
        dispatch({ type: 'SUBMIT_FRAMEWORK', payload: frameworkContent });
        return response;
      } catch (error: any) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    completeCase: async (completionData) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        // Ensure currentSession._id is not null before using
        if (!state.currentSession?._id) {
            throw new Error("No active session to complete.");
        }
        const response = await casePracticeApi.completeCase(
          state.currentSession._id,
          completionData
        );
        dispatch({ type: 'COMPLETE_SESSION', payload: completionData });
        return response;
      } catch (error: any) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },

    resetSession: () => {
      dispatch({ type: 'RESET_SESSION' });
    },
  }), [state.currentSession?._id]); // Dependency array for useMemo

  return (
    <CasePracticeContext.Provider value={{ state, actions }}>
      {children}
    </CasePracticeContext.Provider>
  );
};

export const useCasePractice = () => {
  const context = useContext(CasePracticeContext);
  if (!context) {
    throw new Error('useCasePractice must be used within CasePracticeProvider');
  }
  return context;
};