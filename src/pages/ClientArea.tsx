import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClientSidebar } from "@/components/ClientSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const ClientArea = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

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