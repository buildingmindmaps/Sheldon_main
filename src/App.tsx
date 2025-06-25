import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"; // Ensure useNavigate is imported

// Auth import
import { AuthProvider } from "./lib/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import OAuthCallbackHandler from "./components/OAuthCallbackHandler";
import EmailVerification from "./pages/EmailVerification";
import ResendVerification from "./pages/ResendVerification";
import Dashboard from "./pages/Dashboard"; // Assuming Dashboard is imported

// CasePracticeProvider import
import { CasePracticeProvider } from "./contexts/CasePracticeContext";

// Course progress tracking components
import CourseDashboard from './components/courses/CourseDashboard';
import CourseDetail from './components/courses/CourseDetail';
import CourseModules from './pages/CourseDetail'; // Import our new CourseDetail component as CourseModules

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
import {CaseInterview} from "../CaseQuest/src/components/CaseInterview";
import { SWOTApp } from "./components/SWOTApp";

// Modified CaseInterviewWrapper to pass the onBack prop
const CaseInterviewWrapper = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    // You can choose to navigate back to the previous page or a specific route
    navigate('/all-courses/case-practice'); // Example: Navigate to the case practice list
  };
  return <CaseInterview onBack={handleBack} />; // Pass onBack prop
};

// Modified SWOTAppWrapper to pass the onBack prop
const SWOTAppWrapper = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    // Navigate back to the business frameworks page
    navigate('/all-courses/business-frameworks');
  };
  return <SWOTApp onBack={handleBack} />; // Pass onBack prop
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
              <Route path="/" element={<Index />} />
              <Route path="/icons-playbook" element={<IconsPlaybook />} />
              <Route path="/playbook" element={<IconsPlaybook />} /> {/* Route /playbook to the IconsPlaybook component */}
              <Route path="/careers" element={<Careers />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/articles/:slug" element={<ArticlePage />} />
              <Route path="/all-courses" element={<AllCourses />} />
              <Route path="/all-courses/:slug" element={<CourseModules />} />
              <Route path="/all-courses/case-practice" element={<CasePracticePage />} />
              <Route path="/all-courses/business-frameworks" element={<BusinessFrameworksPage />} />

              {/* CaseInterview route using the wrapper */}
              <Route path="/all-courses/case-interview" element={<CaseInterviewWrapper />} />

              {/* SWOTApp route using the wrapper */}
              <Route path="/all-courses/business-frameworks/swot-analysis" element={<SWOTAppWrapper />} />

              {/* Course progress tracking routes */}
              <Route path="/dashboard/courses" element={<CourseDashboard />} />
              <Route path="/dashboard/courses/:courseId" element={<CourseDetail />} />
              <Route path="/dashboard/courses/modules/:moduleId" element={<CourseModules />} /> {/* New route for CourseDetail component */}

              <Route path="/auth/callback" element={<OAuthCallbackHandler />} />
              <Route path="/auth/verify-email" element={<EmailVerification />} />
              <Route path="/auth/resend-verification" element={<ResendVerification />} />
              <Route path="/verify" element={<EmailVerification />} />
              <Route path="/verify/:token" element={<EmailVerification />} />

              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </CasePracticeProvider>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;