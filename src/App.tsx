import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

// Assuming components are in these locations
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import IconsPlaybook from "./pages/IconsPlaybook";
import Careers from "./pages/Careers";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
import ArticlePage from "./pages/ArticlePage";
import MySprints, { CaseStudiesPage, CoursesPage } from "./pages/MySprints";
import { CaseInterview } from "./components/CaseInterview";
import {SWOTApp} from "./components/Interactive SWOT Analysis App"; // UPDATED: Import SWOTApp

const queryClient = new QueryClient();

// --- Placeholder Components (for self-containment) ---
// In a real project, you would import these from their actual files.

const PlaceholderNavBar = () => (
    <div className="bg-white shadow-sm h-16 flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="font-bold text-xl">Sheldon</div>
        <div className="flex items-center gap-4">
            <a href="#" className="text-gray-600 hover:text-gray-900">Dashboard</a>
            <a href="/my-sprints" className="text-gray-600 hover:text-gray-900">My Sprints</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Settings</a>
        </div>
    </div>
);

// We need to provide the component definitions if they are not in scope.
// Since MySprints, Index, etc. are imported, we assume they exist.
// We are adding wrappers for pages that need navigation props.

// Wrapper component for CaseInterview to handle back navigation
const CaseInterviewWrapper = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/my-sprints/case-studies');
  };
  return <CaseInterview onBack={handleBack} />;
};

// NEW: Wrapper component for SWOTApp to handle back navigation
const SWOTAppWrapper = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/my-sprints/courses');
  };
  return <SWOTApp onBack={handleBack} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* The NavBar could be placed here to appear on all pages if needed */}
        {/* <PlaceholderNavBar /> */}
        <Routes>
          {/* Assuming these page components exist in your project */}
          <Route path="/" element={<Index />} />
          <Route path="/playbook" element={<IconsPlaybook />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/article" element={<ArticlePage />} />

          {/* Main Sprints and Sub-pages */}
          <Route path="/my-sprints" element={<MySprints />} />
          <Route path="/my-sprints/case-studies" element={<CaseStudiesPage />} />
          <Route path="/my-sprints/courses" element={<CoursesPage />} />
          
          {/* Sprint-specific Apps */}
          <Route path="/my-sprints/case-interview" element={<CaseInterviewWrapper />} />
          {/* UPDATED: Added a clean route for the SWOT Analysis App */}
          <Route path="/my-sprints/courses/swot-analysis" element={<SWOTAppWrapper />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
