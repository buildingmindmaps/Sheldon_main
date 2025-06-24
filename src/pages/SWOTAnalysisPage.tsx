import React from 'react';
import { NavBar } from '@/components/NavBar';
import InteractiveSWOTAnalysis from '@/components/Interactive SWOT Analysis App';
import { useNavigate } from 'react-router-dom';

const SWOTAnalysisPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/all-courses/business-frameworks');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InteractiveSWOTAnalysis onBack={handleBack} />
        </div>
      </main>
    </div>
  );
};

export default SWOTAnalysisPage;
