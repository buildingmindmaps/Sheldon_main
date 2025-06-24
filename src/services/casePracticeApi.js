const API_BASE_URL = '/api';

const getAuthToken = () => {
  const token = localStorage.getItem('auth_token');
  console.log('🔑 Getting token:', token ? 'Token exists' : 'No token found');
  return token;
};

const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  console.log('🚀 Making API call to:', `${API_BASE_URL}${endpoint}`);
  console.log('🔑 Token present:', !!token);
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  console.log('📦 Request config:', config);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ API Error:', error);
      throw new Error(error.message || 'API call failed');
    }
    
    const data = await response.json();
    console.log('✅ API Success:', data);
    return data;
  } catch (error) {
    console.error('💥 Fetch error:', error);
    throw error;
  }
};

export const casePracticeApi = {
  startCase: async (caseData) => {
    console.log('📝 Starting case with data:', caseData);
    return apiCall('/case-practice/start', {
      method: 'POST',
      body: JSON.stringify(caseData),
    });
  },

  addQuestionAndResponse: async (sessionId, qaData) => {
    console.log('❓ Adding Q&A for session:', sessionId, qaData);
    return apiCall(`/case-practice/${sessionId}/add-qa`, {
      method: 'PUT',
      body: JSON.stringify(qaData),
    });
  },

  // ... other methods


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
