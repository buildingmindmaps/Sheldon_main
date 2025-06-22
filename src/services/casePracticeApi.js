const API_BASE_URL = 'http://localhost:5001/api';

// Get JWT token from localStorage or context
const getAuthToken = () => {
  return localStorage.getItem('token'); // Adjust based on your auth implementation
};

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API call failed');
  }
  
  return response.json();
};

// Case Practice API functions
export const casePracticeApi = {
  // Start a new case practice session
  startCase: async (caseData) => {
    return apiCall('/case-practice/start', {
      method: 'POST',
      body: JSON.stringify(caseData),
    });
  },

  // Add question and response
  addQuestionAndResponse: async (sessionId, qaData) => {
    return apiCall(`/case-practice/${sessionId}/add-qa`, {
      method: 'PUT',
      body: JSON.stringify(qaData),
    });
  },

  // Submit framework
  submitFramework: async (sessionId, frameworkContent) => {
    return apiCall(`/case-practice/${sessionId}/submit-framework`, {
      method: 'PUT',
      body: JSON.stringify({ frameworkContent }),
    });
  },

  // Complete case practice session
  completeCase: async (sessionId, completionData) => {
    return apiCall(`/case-practice/${sessionId}/complete`, {
      method: 'PUT',
      body: JSON.stringify(completionData),
    });
  },

  // Get case practice history
  getHistory: async () => {
    return apiCall('/case-practice/history');
  },

  // Get specific session details
  getSessionDetails: async (sessionId) => {
    return apiCall(`/case-practice/${sessionId}`);
  },
};
