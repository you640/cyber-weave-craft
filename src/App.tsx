import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import CaseStudiesPage from "./pages/CaseStudiesPage.tsx";
import BlogPage from "./pages/BlogPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import PrivacyPage from "./pages/PrivacyPage.tsx";
import DpaPage from "./pages/DpaPage.tsx";
import TermsPage from "./pages/TermsPage.tsx";
import CookiesPage from "./pages/CookiesPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import { AuthProvider } from "./components/auth/AuthProvider";
import { AdminRoute } from "./components/auth/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/reset" element={<ResetPasswordPage />} />
            <Route
              path="/dashboard/*"
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            />
            <Route path="/o-nas" element={<AboutPage />} />
            <Route path="/case-studies" element={<CaseStudiesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/kontakt" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/dpa" element={<DpaPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
