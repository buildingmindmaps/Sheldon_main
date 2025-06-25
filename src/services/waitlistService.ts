// filepath: /Users/harshita_shar25/Documents/CODES/games/Sheldon_Main/case-sheldonai-462f5ce0 2/src/services/waitlistService.ts

// Make sure we're using the correct base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

interface WaitlistSubmission {
  name: string;
  email: string;
  education: string;
  source: 'waitlist_form' | 'newsletter';
}

export const submitToWaitlist = async (data: WaitlistSubmission): Promise<any> => {
  // Constructing the full URL properly with the /api prefix
  const url = `${API_BASE_URL}/api/waitlist`;
  console.log("Submitting to URL:", url); // Debug log

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit to waitlist');
    } catch (e) {
      throw new Error(`Server error (${response.status}): Failed to submit to waitlist`);
    }
  }

  return response.json();
};
