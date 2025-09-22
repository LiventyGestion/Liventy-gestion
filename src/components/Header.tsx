import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="/icons/logo-source.svg" 
              alt="Liventy Gestión - Volver al inicio" 
              className="h-16 sm:h-20 lg:h-24 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link to="/herramientas" className="text-foreground hover:text-primary transition-colors">
              Herramientas
            </Link>
            
            {/* Services Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-primary transition-colors bg-transparent hover:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent focus:bg-transparent text-base font-normal h-auto p-0">
                    Servicios
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4">
                      <div className="grid gap-3">
                        <NavigationMenuLink asChild>
                          <Link 
                            to="/servicios/gestion-integral"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Gestión Integral</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Servicio completo de gestión de alquileres
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link 
                            to="/servicios/alquiler-larga-duracion"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Alquiler Larga Duración</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Gestión de alquileres residenciales
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link 
                            to="/servicios/alquiler-temporada"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Alquiler Temporada</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Gestión de alquileres vacacionales
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link 
                            to="/servicios/mantenimiento"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Mantenimiento</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Gestión de incidencias y reparaciones
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link 
                            to="/servicios/asesoria-legal"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Asesoría Legal</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Asesoramiento jurídico en alquileres
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              Sobre Nosotros
            </Link>
            <Link to="/blog" className="text-foreground hover:text-primary transition-colors">
              Liventy Insights
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contacto
            </Link>
            <Link to="/login">
              <Button>Área de Clientes</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menú de navegación"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? 
              <X className="h-6 w-6" aria-hidden="true" /> : 
              <Menu className="h-6 w-6" aria-hidden="true" />
            }
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t" id="mobile-menu">
            <div className="flex flex-col space-y-4 pt-4">
              <Link 
                to="/" 
                className="text-foreground hover:text-primary transition-colors py-2 px-1 rounded focus:outline-none focus:ring-2 focus:ring-ring"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                to="/herramientas" 
                className="text-foreground hover:text-primary transition-colors py-2 px-1 rounded focus:outline-none focus:ring-2 focus:ring-ring"
                onClick={() => setIsMenuOpen(false)}
              >
                Herramientas
              </Link>
              
              {/* Services Mobile Menu */}
              <div className="space-y-2">
                <div className="text-foreground font-medium py-2 px-1">Servicios</div>
                <div className="pl-4 space-y-2">
                  <Link 
                    to="/servicios/gestion-integral"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 px-1 rounded focus:outline-none focus:ring-2 focus:ring-ring"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Gestión Integral
                  </Link>
                  <Link 
                    to="/servicios/alquiler-larga-duracion"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 px-1 rounded focus:outline-none focus:ring-2 focus:ring-ring"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Alquiler Larga Duración
                  </Link>
                  <Link 
                    to="/servicios/alquiler-temporada"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 px-1 rounded focus:outline-none focus:ring-2 focus:ring-ring"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Alquiler Temporada
                  </Link>
                  <Link 
                    to="/servicios/mantenimiento"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 px-1 rounded focus:outline-none focus:ring-2 focus:ring-ring"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mantenimiento
                  </Link>
                  <Link 
                    to="/servicios/asesoria-legal"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 px-1 rounded focus:outline-none focus:ring-2 focus:ring-ring"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Asesoría Legal
                  </Link>
                </div>
              </div>
              
              <Link 
                to="/about" 
                className="text-foreground hover:text-primary transition-colors py-2 px-1 rounded focus:outline-none focus:ring-2 focus:ring-ring"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre Nosotros
              </Link>
              <Link 
                to="/blog" 
                className="text-foreground hover:text-primary transition-colors py-2 px-1 rounded focus:outline-none focus:ring-2 focus:ring-ring"
                onClick={() => setIsMenuOpen(false)}
              >
                Liventy Insights
              </Link>
              <Link 
                to="/contact" 
                className="text-foreground hover:text-primary transition-colors py-2 px-1 rounded focus:outline-none focus:ring-2 focus:ring-ring"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full">Área de Clientes</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;