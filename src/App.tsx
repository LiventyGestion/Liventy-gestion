import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import Index from "./pages/Index";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Auth from "./pages/Auth";
import OwnerDashboard from "./pages/OwnerDashboard";
import TenantDashboard from "./pages/TenantDashboard";
import RentalSimulatorPage from "./pages/RentalSimulatorPage";
import LeadMagnetPage from "./pages/LeadMagnetPage";
import Herramientas from "./pages/Herramientas";
import StartNowPage from "./pages/StartNowPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ScrollManager = () => {
  useScrollRestoration();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollManager />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth" element={<Auth />} />
            <Route 
              path="/owner-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['propietario']}>
                  <OwnerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tenant-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['inquilino']}>
                  <TenantDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/simulador" element={<RentalSimulatorPage />} />
            <Route path="/herramientas" element={<Herramientas />} />
            <Route path="/empezar-ahora" element={<StartNowPage />} />
            <Route path="/guia-gratuita" element={<LeadMagnetPage />} />
            <Route path="/politica-privacidad" element={<PrivacyPolicy />} />
            <Route path="/politica-cookies" element={<CookiePolicy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
