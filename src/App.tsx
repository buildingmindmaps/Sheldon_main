import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

// Auth import - using the correct AuthProvider from lib/AuthContext
import { AuthProvider } from "./lib/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Assuming components are in these locations
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import IconsPlaybook from "./pages/IconsPlaybook";
import Careers from "./pages/Careers";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
import ArticlePage from "./pages/ArticlePage";
import AllCourses, { CasePracticePage, BusinessFrameworksPage } from "./pages/AllCourses";
import { CaseInterview } from "./components/CaseInterview";
import {SWOTApp} from "./components/Interactive SWOT Analysis App";

const queryClient = new QueryClient();

// Wrapper component for CaseInterview to handle back navigation
const CaseInterviewWrapper = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/all-courses/case-practice');
  };
  return (
    <ProtectedRoute>
      <CaseInterview onBack={handleBack} />
    </ProtectedRoute>
  );
};

// Wrapper component for SWOTApp to handle back navigation
const SWOTAppWrapper = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/all-courses/business-frameworks');
  };
  return (
    <ProtectedRoute>
      <SWOTApp onBack={handleBack} />
    </ProtectedRoute>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/playbook" element={<IconsPlaybook />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/contact" element={<Contact />} />

            {/* Keep the old /article route for backward compatibility */}
            <Route path="/article" element={<ArticlePage />} />

            {/* Add new route for article slugs */}
            <Route path="/:slug" element={<ArticlePage />} />

            {/* Main Sprints and Sub-pages */}
            <Route path="/all-courses" element={<AllCourses />} />
            <Route path="/all-courses/case-practice" element={<CasePracticePage />} />
            <Route path="/all-courses/business-frameworks" element={<BusinessFrameworksPage />} />

            {/* Sprint-specific Apps */}
            <Route path="/all-courses/case-interview" element={<CaseInterviewWrapper />} />
            <Route path="/all-courses/business-frameworks/swot-analysis" element={<SWOTAppWrapper />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
