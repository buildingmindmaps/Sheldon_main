// Create a new file: src/pages/CasePage.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CaseInterview } from '../components/CaseInterview';
import { CaseModule } from '../types/case';

// API function to fetch a single module. (This could be moved to a service file)
async function getModuleById(moduleId: string): Promise<CaseModule> {
  const response = await fetch(`/api/modules/${moduleId}`); // Your backend API endpoint
  if (!response.ok) {
    throw new Error('Failed to fetch case data');
  }
  return response.json();
}

export const CasePage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [caseData, setCaseData] = useState<CaseModule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!moduleId) {
      setError("No module ID provided.");
      setIsLoading(false);
      return;
    }

    const fetchCase = async () => {
      try {
        setIsLoading(true);
        const data = await getModuleById(moduleId);
        setCaseData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCase();
  }, [moduleId]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading Case...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  if (!caseData) {
    return <div className="flex justify-center items-center h-screen">Case not found.</div>;
  }

  // Once data is fetched, render the main interview component with the data
  return <CaseInterview caseModuleData={caseData} />;
};