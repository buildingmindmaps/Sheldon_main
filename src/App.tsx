import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom"; // Add useParams and useLocation

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
import InteractiveSWOTAnalysis from "./components/Interactive SWOT Analysis App";
import { useEffect, useState } from "react";

// Modified CaseInterviewWrapper to pass the onBack prop
const CaseInterviewWrapper = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    // You can choose to navigate back to the previous page or a specific route
    navigate('/all-courses/case-practice'); // Example: Navigate to the case practice list
  };
  return <CaseInterview onBack={handleBack} />; // Pass onBack prop
};

// New component to handle case study routes and directly integrate with CaseQuest
const CaseStudyWrapper = () => {
  const { courseSlug, moduleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [caseModuleData, setCaseModuleData] = useState<any>(null);

  // Handle the back button functionality
  const handleBack = () => {
    // Navigate back to case practice page or previous location
    navigate('/all-courses/case-practice');
  };

  useEffect(() => {
    const fetchCaseData = async () => {
      if (!moduleId) {
        setError("No module ID provided");
        setLoading(false);
        return;
      }

      try {
        // Fetch case module data
        const response = await fetch(`/api/modules/${moduleId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch case module: ${response.statusText}`);
        }

        const data = await response.json();

        // Create case module data with required properties
        setCaseModuleData({
          _id: data._id || moduleId,
          title: data.title || "Case Study",
          description: data.description || "",
          level: data.level || "Intermediate",
          duration: data.duration || 30,
          courseId: data.courseId || "",
          caseStatement: data.caseStatement || "No case statement available",
          caseFacts: data.caseFacts || [],
          caseConversation: data.caseConversation || ""
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching case module:", err);
        setError("Failed to load case study. Please try again.");
        setLoading(false);
      }
    };

    fetchCaseData();
  }, [moduleId]);

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

  if (error || !caseModuleData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-red-500">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>{error || "Failed to load case data"}</p>
          <button
            onClick={() => navigate('/all-courses/case-practice')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Case Practice
          </button>
        </div>
      </div>
    );
  }

  // Directly render the CaseInterview component with the caseModuleData
  return <CaseInterview caseModuleData={caseModuleData} onBack={handleBack} />;
};

// Modified SWOTAppWrapper to pass the onBack prop
const SWOTAppWrapper = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    // Use browser history to go back to the previous page
    navigate(-1);
  };
  return <InteractiveSWOTAnalysis onBack={handleBack} />; // Use InteractiveSWOTAnalysis instead of SWOTApp
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

              {/* CaseInterview route using the wrapper */}
              <Route path="/all-courses/case-interview" element={<CaseInterviewWrapper />} />

              {/* Add the specific case study route */}
              <Route path="/all-courses/:courseSlug/module/:moduleId" element={<CaseStudyWrapper />} />

              {/* SWOTApp route using the wrapper */}
              <Route path="/all-courses/business-frameworks-fundamentals/swot-analysis" element={<SWOTAppWrapper />} />

              {/* Course progress tracking routes */}
              <Route path="/dashboard/courses" element={<CourseDashboard />} />
              <Route path="/dashboard/courses/:courseId" element={<CourseDetail />} />
              <Route path="/dashboard/courses/modules/:moduleId" element={<CourseModules />} /> {/* New route for CourseDetail component */}

              {/* Add missing route for modules with the same pattern that's causing the error */}
              <Route path="/modules/:courseSlug/module/:moduleId" element={<CourseModules />} />

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
