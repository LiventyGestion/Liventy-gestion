import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Auth from "./pages/Auth";
import ClientArea from "./pages/ClientArea";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import TenantServices from "./pages/tenant/TenantServices";
import TenantIncidents from "./pages/tenant/TenantIncidents";
import TenantChat from "./pages/tenant/TenantChat";
import TenantContact from "./pages/tenant/TenantContact";
import GlobalDocuments from "./pages/GlobalDocuments";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import TermsConditions from "./pages/TermsConditions";
import LegalNotice from "./pages/LegalNotice";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import Inquilinos from "./pages/Inquilinos";
import Propietarios from "./pages/Propietarios";
import Precios from "./pages/Precios";
import Recursos from "./pages/Recursos";
import AdminLeads from "./pages/admin/AdminLeads";

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
            {/* Main Pages */}
            <Route path="/" element={<Index />} />
            <Route path="/propietarios" element={<Propietarios />} />
            <Route path="/inquilinos" element={<Inquilinos />} />
            <Route path="/precios" element={<Precios />} />
            <Route path="/recursos" element={<Recursos />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Admin */}
            <Route 
              path="/admin/leads" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLeads />
                </ProtectedRoute>
              } 
            />
            
            {/* Client Area */}
            <Route 
              path="/area-clientes" 
              element={
                <ProtectedRoute allowedRoles={['inquilino', 'propietario']}>
                  <ClientArea />
                </ProtectedRoute>
              }
            >
              <Route 
                path="inquilino/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['inquilino']}>
                    <TenantDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="inquilino/servicios" 
                element={
                  <ProtectedRoute allowedRoles={['inquilino']}>
                    <TenantServices />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="inquilino/incidencias" 
                element={
                  <ProtectedRoute allowedRoles={['inquilino']}>
                    <TenantIncidents />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="inquilino/consulta" 
                element={
                  <ProtectedRoute allowedRoles={['inquilino']}>
                    <TenantChat />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="inquilino/contacto" 
                element={
                  <ProtectedRoute allowedRoles={['inquilino']}>
                    <TenantContact />
                  </ProtectedRoute>
                } 
              />
              <Route path="documentos" element={<GlobalDocuments />} />
            </Route>
            
            {/* Legacy Redirects */}
            <Route path="/herramientas" element={<Navigate to="/recursos" replace />} />
            <Route path="/empezar-ahora" element={<Navigate to="/contact#empezar" replace />} />
            <Route path="/servicios/gestion-de-alquileres" element={<Navigate to="/propietarios" replace />} />
            <Route path="/servicios/asesoria-legal" element={<Navigate to="/propietarios" replace />} />
            <Route path="/servicios/mantenimiento-incidencias" element={<Navigate to="/propietarios" replace />} />
            <Route path="/servicios/alquiler-temporada" element={<Navigate to="/propietarios" replace />} />
            <Route path="/servicios/alquiler-larga-duracion" element={<Navigate to="/propietarios" replace />} />
            <Route path="/servicios/mantenimiento" element={<Navigate to="/propietarios" replace />} />
            <Route path="/consultar-mi-caso" element={<Navigate to="/recursos" replace />} />
            <Route path="/simulador" element={<Navigate to="/recursos" replace />} />
            <Route path="/guia-gratuita" element={<Navigate to="/recursos" replace />} />
            <Route path="/venta" element={<Navigate to="/propietarios" replace />} />
            <Route path="/blog" element={<Navigate to="/" replace />} />
            
            {/* Legal */}
            <Route path="/politica-privacidad" element={<PrivacyPolicy />} />
            <Route path="/politica-cookies" element={<CookiePolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/legal-notice" element={<LegalNotice />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
