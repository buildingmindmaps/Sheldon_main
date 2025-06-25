import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

// Auth import
import { AuthProvider } from "@/lib/AuthContext"; // Changed to use @/ alias
import { ProtectedRoute } from "@/components/ProtectedRoute"; // Changed to use @/ alias
import OAuthCallbackHandler from "@/components/OAuthCallbackHandler"; // Changed to use @/ alias
import EmailVerification from "@/pages/EmailVerification"; // Changed to use @/ alias
import ResendVerification from "@/pages/ResendVerification"; // Changed to use @/ alias
import Dashboard from "@/pages/Dashboard"; // Changed to use @/ alias

// CasePracticeProvider import
import { CasePracticeProvider } from "@/contexts/CasePracticeContext"; // Changed to use @/ alias

// Page and Component Imports
import CourseDashboard from '@/components/courses/CourseDashboard'; // Changed to use @/ alias
import CourseDetail from '@/components/courses/CourseDetail'; // Changed to use @/ alias
// Note: CourseModules is imported from './pages/CourseDetail', which can be confusing.
// Assuming it refers to the CourseDetail component's functionality for module listing.
import CourseModules from '@/pages/CourseDetail'; // Changed to use @/ alias
import Index from "@/pages/Index"; // Changed to use @/ alias
import NotFound from "@/pages/NotFound"; // Changed to use @/ alias
import IconsPlaybook from "@/pages/IconsPlaybook"; // Changed to use @/ alias
import Careers from "@/pages/Careers"; // Changed to use @/ alias
import PrivacyPolicy from "@/pages/PrivacyPolicy"; // Changed to use @/ alias
import TermsOfService from "@/pages/TermsOfService"; // Changed to use @/ alias
import Contact from "@/pages/Contact"; // Changed to use @/ alias
import ArticlePage from "@/pages/ArticlePage"; // Changed to use @/ alias
import AllCourses, { CasePracticePage } from "@/pages/AllCourses"; // Changed to use @/ alias
import InteractiveSWOTAnalysis from "@/components/Interactive SWOT Analysis App"; // Changed to use @/ alias

// Import the CasePage which correctly handles fetching and displaying a case interview
// This path is external to src, so it remains relative to App.tsx's parent directory.
import { CasePage } from '../CaseQuest/src/pages/CasePage';

// Wrapper for the SWOT Analysis App to handle navigation
const SWOTAppWrapper = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    // Use browser history to go back to the previous page
    navigate(-1);
  };
  return <InteractiveSWOTAnalysis onBack={handleBack} />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <CasePracticeProvider>
            <Routes>
              {/* General Site Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/icons-playbook" element={<IconsPlaybook />} />
              <Route path="/playbook" element={<IconsPlaybook />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/articles/:slug" element={<ArticlePage />} />

              {/* Course & Module Routes */}
              <Route path="/all-courses" element={<AllCourses />} />
              {/* This route handles displaying a Course's details (including its modules) based on a slug */}
              <Route path="/all-courses/:slug" element={<CourseModules />} />
              <Route path="/all-courses/case-practice" element={<CasePracticePage />} />
              
              {/* Existing route for case interviews, matching links from CourseDetail */}
              <Route path="/all-courses/case-interview/:moduleId" element={<CasePage />} />

              {/* NEW ROUTE ADDED: This route will now correctly handle URLs like 
                  /all-courses/profitability-case-practice/module/someId,
                  directing them to the CasePage component. */}
              <Route path="/all-courses/:courseSlug/module/:moduleId" element={<CasePage />} />

              {/* SWOT App Route */}
              <Route path="/all-courses/business-frameworks-fundamentals/swot-analysis" element={<SWOTAppWrapper />} />

              {/* Dashboard & Progress Routes */}
              <Route path="/dashboard/courses" element={<CourseDashboard />} />
              <Route path="/dashboard/courses/:courseId" element={<CourseDetail />} />
              {/* This route might be redundant if the new route for /all-courses/:courseSlug/module/:moduleId covers all module viewing needs.
                  Consider consolidating your module display routes. */}
              <Route path="/dashboard/courses/modules/:moduleId" element={<CourseModules />} /> 
              {/* Another module route. Review if this is still necessary given the new route above. */}
              <Route path="/modules/:courseSlug/module/:moduleId" element={<CourseModules />} />

              {/* Auth Routes */}
              <Route path="/auth/callback" element={<OAuthCallbackHandler />} />
              <Route path="/auth/verify-email" element={<EmailVerification />} />
              <Route path="/auth/resend-verification" element={<ResendVerification />} />
              <Route path="/verify" element={<EmailVerification />} />
              <Route path="/verify/:token" element={<EmailVerification />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              {/* Catch-all Not Found Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CasePracticeProvider>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
