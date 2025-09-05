import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  Home, 
  Wrench, 
  Sparkles, 
  MessageSquare, 
  AlertTriangle,
  FileText,
  Phone,
  LogOut,
  TrendingUp,
  Euro,
  Calendar
} from "lucide-react";

export function ClientSidebar() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const isActive = (path: string) => location.pathname.startsWith(path);
  const getNavCls = (active: boolean) =>
    active ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Items para inquilinos
  const tenantItems = [
    { title: "Hogar", url: "/area-clientes/inquilino/dashboard", icon: Home },
    { title: "Solicitar Servicios", url: "/area-clientes/inquilino/servicios", icon: Wrench },
    { title: "Consulta (Chat)", url: "/area-clientes/inquilino/consulta", icon: MessageSquare },
    { title: "Mis Incidencias", url: "/area-clientes/inquilino/incidencias", icon: AlertTriangle },
    { title: "Contacto", url: "/area-clientes/inquilino/contacto", icon: Phone },
  ];

  // Items para propietarios
  const ownerItems = [
    { title: "Dashboard", url: "/area-clientes/propietario/dashboard", icon: TrendingUp },
    { title: "Mis Propiedades", url: "/area-clientes/propietario/propiedades", icon: Home },
    { title: "Pagos", url: "/area-clientes/propietario/pagos", icon: Euro },
    { title: "Incidencias", url: "/area-clientes/propietario/incidencias", icon: AlertTriangle },
    { title: "Mensajería", url: "/area-clientes/propietario/mensajeria", icon: MessageSquare },
    { title: "Contacto", url: "/area-clientes/propietario/contacto", icon: Phone },
  ];

  // Items globales
  const globalItems = [
    { title: "Documentos", url: "/area-clientes/documentos", icon: FileText },
  ];

  const items = user.role === 'inquilino' ? tenantItems : ownerItems;

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-64"} collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        {/* User Info */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {state !== "collapsed" && (
              <div className="flex flex-col">
                <span className="font-semibold">{user.name}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {user.role}
                </span>
              </div>
            )}
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>{user.role === 'inquilino' ? 'Servicios' : 'Gestión'}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => getNavCls(isActive)}
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Global Items */}
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {globalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => getNavCls(isActive)}
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4" />
                    {state !== "collapsed" && <span>Cerrar Sesión</span>}
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}