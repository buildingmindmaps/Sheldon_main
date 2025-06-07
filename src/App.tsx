import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
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

const queryClient = new QueryClient();

// Wrapper component for CaseInterview to handle navigation
const CaseInterviewWrapper = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/my-sprints/case-studies');
  };

  return <CaseInterview onBack={handleBack} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/playbook" element={<IconsPlaybook />} />
          <Route path="/my-sprints" element={<MySprints />} />
          <Route path="/my-sprints/case-studies" element={<CaseStudiesPage />} />
          <Route path="/my-sprints/courses" element={<CoursesPage />} />
          <Route path="/my-sprints/case-interview" element={<CaseInterviewWrapper />} />
          <Route path="/article" element={<ArticlePage />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
