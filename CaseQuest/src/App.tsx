import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { CaseInterview } from "./components/CaseInterview"; // Make sure this path is correct
import { CasePracticeProvider } from "./contexts/CasePracticeContext"; // Import your CasePracticeProvider

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Wrap the routes that need access to the CasePracticeContext with CasePracticeProvider */}
        <CasePracticeProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Define the route for your CaseInterview component */}
            <Route path="/case-interview" element={<CaseInterview />} /> 
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CasePracticeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;