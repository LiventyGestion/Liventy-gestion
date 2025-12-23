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
import ClientArea from "./pages/ClientArea";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import TenantServices from "./pages/tenant/TenantServices";
import TenantIncidents from "./pages/tenant/TenantIncidents";
import TenantChat from "./pages/tenant/TenantChat";
import TenantContact from "./pages/tenant/TenantContact";
import GlobalDocuments from "./pages/GlobalDocuments";
import RentalSimulatorPage from "./pages/RentalSimulatorPage";
import LeadMagnetPage from "./pages/LeadMagnetPage";
import Herramientas from "./pages/Herramientas";
import StartNowPage from "./pages/StartNowPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import TermsConditions from "./pages/TermsConditions";
import LegalNotice from "./pages/LegalNotice";
import NotFound from "./pages/NotFound";
import GestionIntegral from "./pages/services/GestionIntegral";
import AsesoramientoLegal from "./pages/services/AsesoramientoLegal";
import MantenimientoIncidencias from "./pages/services/MantenimientoIncidencias";
import AlquilerTemporada from "./pages/services/AlquilerTemporada";
import AlquilerLargaDuracion from "./pages/services/AlquilerLargaDuracion";
import Mantenimiento from "./pages/services/Mantenimiento";
import ConsultarMiCaso from "./pages/ConsultarMiCaso";
import Venta from "./pages/Venta";
import FAQ from "./pages/FAQ";
import Inquilinos from "./pages/Inquilinos";
import Propietarios from "./pages/Propietarios";
import Precios from "./pages/Precios";
import Recursos from "./pages/Recursos";

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
            <Route path="/propietarios" element={<Propietarios />} />
            <Route path="/precios" element={<Precios />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/recursos" element={<Recursos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* New Client Area Structure */}
            <Route 
              path="/area-clientes" 
              element={
                <ProtectedRoute allowedRoles={['inquilino', 'propietario']}>
                  <ClientArea />
                </ProtectedRoute>
              }
            >
              {/* Tenant Routes */}
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
              
              {/* Global Documents */}
              <Route path="documentos" element={<GlobalDocuments />} />
            </Route>
            
            <Route path="/simulador" element={<RentalSimulatorPage />} />
            <Route path="/herramientas" element={<Herramientas />} />
            <Route path="/empezar-ahora" element={<StartNowPage />} />
            <Route path="/guia-gratuita" element={<LeadMagnetPage />} />
            
            {/* Service Pages */}
            <Route path="/servicios/gestion-de-alquileres" element={<GestionIntegral />} />
            <Route path="/servicios/alquiler-temporada" element={<AlquilerTemporada />} />
            <Route path="/servicios/alquiler-larga-duracion" element={<AlquilerLargaDuracion />} />
            <Route path="/servicios/asesoria-legal" element={<AsesoramientoLegal />} />
            <Route path="/servicios/mantenimiento-incidencias" element={<MantenimientoIncidencias />} />
            <Route path="/servicios/mantenimiento" element={<Mantenimiento />} />
            <Route path="/consultar-mi-caso" element={<ConsultarMiCaso />} />
            <Route path="/venta" element={<Venta />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/inquilinos" element={<Inquilinos />} />
            
            <Route path="/politica-privacidad" element={<PrivacyPolicy />} />
            <Route path="/politica-cookies" element={<CookiePolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/legal-notice" element={<LegalNotice />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
