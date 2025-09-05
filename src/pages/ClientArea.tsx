import { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClientSidebar } from "@/components/ClientSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const ClientArea = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    } else if (user && location.pathname === '/area-clientes') {
      // Redirect to appropriate section based on user role
      if (user.role === 'inquilino') {
        navigate('/area-clientes/inquilino/servicios');
      } else if (user.role === 'propietario') {
        navigate('/area-clientes/propietario/dashboard');
      }
    }
  }, [user, isLoading, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <ClientSidebar />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
      <Footer />
    </div>
  );
};

export default ClientArea;