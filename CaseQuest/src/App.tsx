import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { CaseInterview } from "./components/CaseInterview";

// Add components for loading case studies
const CaseStudyLoader = () => {
  const [loading, setLoading] = useState(true);
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Parse URL query parameters
    const params = new URLSearchParams(window.location.search);
    const moduleIdParam = params.get('moduleId');
    const returnUrlParam = params.get('returnUrl');

    console.log('CaseQuest received parameters:', { moduleId: moduleIdParam, returnUrl: returnUrlParam });

    if (moduleIdParam) {
      setModuleId(moduleIdParam);
      setReturnUrl(returnUrlParam);
      setLoading(false);
    } else {
      setError("No module ID provided");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Case Study...</h1>
          <p className="text-gray-600">Please wait while we prepare your case study.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-red-500">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>{error}</p>
          <button
            onClick={() => {
              // Try to go back to main application
              const mainAppUrl = window.location.origin;
              window.location.href = `${mainAppUrl}/all-courses/case-practice`;
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Case Practice
          </button>
        </div>
      </div>
    );
  }

  // Handle the back button functionality
  const handleBack = () => {
    if (returnUrl) {
      // Check if returnUrl is a full URL or just a path
      if (returnUrl.startsWith('http')) {
        window.location.href = decodeURIComponent(returnUrl);
      } else {
        // If it's just a path, append it to the origin
        const mainAppUrl = window.location.origin;
        window.location.href = `${mainAppUrl}${decodeURIComponent(returnUrl)}`;
      }
    } else {
      // Default fallback
      const mainAppUrl = window.location.origin;
      window.location.href = `${mainAppUrl}/all-courses/case-practice`;
    }
  };

  // Render the case interview component with the module ID
  return <CaseInterview moduleId={moduleId} onBack={handleBack} />;
};

const queryClient = new QueryClient();

const App = () => {
  // Check if there are query parameters for direct case study loading
  const hasModuleIdParam = new URLSearchParams(window.location.search).has('moduleId');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={window.location.pathname.includes('index.html') ? '/' : undefined}>
          <Routes>
            {/* If moduleId is in query params, load the case study directly */}
            {hasModuleIdParam ? (
              <Route path="/" element={<CaseStudyLoader />} />
            ) : (
              <Route path="/" element={<Index />} />
            )}
            {/* Support direct paths to case studies as well */}
            <Route path="/case/:moduleId" element={<CaseStudyLoader />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
