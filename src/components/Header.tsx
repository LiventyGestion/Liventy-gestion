import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Main Header */}
      <header 
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-200 ease-out
          ${isScrolled 
            ? 'py-2 shadow-[0_6px_20px_rgba(0,0,0,0.08)]' 
            : 'py-3 shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
          }
        `}
        style={{
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img 
                src="/lovable-uploads/5b1ed236-dc4e-465f-a21e-7c3186a1ba0d.png" 
                alt="Liventy Gestión - Volver al inicio" 
                className="h-16 sm:h-18 lg:h-20 w-auto transition-all duration-200 ease-out group-hover:scale-[1.02] group-hover:drop-shadow-[0_0_8px_rgba(216,119,26,0.2)] transform scale-[1.12]"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link 
                to="/" 
                className="font-montserrat font-medium text-[#323232] hover:text-[#323232] transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] relative group focus:outline-none focus:ring-2 focus:ring-[#323232] focus:ring-offset-2 rounded-sm px-[18px] py-2" 
                style={{ fontSize: '16px' }}
              >
                Inicio
                <span className="absolute -bottom-1 left-[18px] right-[18px] w-0 h-0.5 bg-[#D8771A] transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:w-[calc(100%-36px)]"></span>
              </Link>
              <Link 
                to="/herramientas" 
                className="font-montserrat font-medium text-[#323232] hover:text-[#323232] transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] relative group focus:outline-none focus:ring-2 focus:ring-[#323232] focus:ring-offset-2 rounded-sm px-[18px] py-2" 
                style={{ fontSize: '16px' }}
              >
                Herramientas
                <span className="absolute -bottom-1 left-[18px] right-[18px] w-0 h-0.5 bg-[#D8771A] transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:w-[calc(100%-36px)]"></span>
              </Link>
              
              {/* Servicios Dropdown */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger 
                      className="font-montserrat font-medium text-[#323232] hover:text-[#323232] transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] relative group focus:outline-none focus:ring-2 focus:ring-[#323232] focus:ring-offset-2 rounded-sm px-[18px] py-2 bg-transparent data-[state=open]:bg-transparent data-[active]:bg-transparent hover:bg-transparent" 
                      style={{ fontSize: '16px' }}
                    >
                      Servicios
                      <span className="absolute -bottom-1 left-[18px] right-[18px] w-0 h-0.5 bg-[#D8771A] transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:w-[calc(100%-36px)]"></span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="p-4 w-80">
                        <div className="grid gap-3">
                          <Link
                            to="/servicios/gestion-integral"
                            className="block p-3 rounded-lg hover:bg-accent transition-colors"
                          >
                            <div className="font-medium">Gestión Integral</div>
                            <div className="text-sm text-muted-foreground">Gestión completa de tu propiedad</div>
                          </Link>
                          <Link
                            to="/servicios/alquiler-larga-duracion"
                            className="block p-3 rounded-lg hover:bg-accent transition-colors"
                          >
                            <div className="font-medium">Alquiler Larga Duración</div>
                            <div className="text-sm text-muted-foreground">Gestión de alquileres por meses</div>
                          </Link>
                          <Link
                            to="/servicios/alquiler-temporada"
                            className="block p-3 rounded-lg hover:bg-accent transition-colors"
                          >
                            <div className="font-medium">Alquiler Temporada</div>
                            <div className="text-sm text-muted-foreground">Gestión de alquileres turísticos</div>
                          </Link>
                          <Link
                            to="/servicios/mantenimiento"
                            className="block p-3 rounded-lg hover:bg-accent transition-colors"
                          >
                            <div className="font-medium">Mantenimiento</div>
                            <div className="text-sm text-muted-foreground">Mantenimiento y reparaciones</div>
                          </Link>
                          <Link
                            to="/servicios/asesoramiento-legal"
                            className="block p-3 rounded-lg hover:bg-accent transition-colors"
                          >
                            <div className="font-medium">Asesoramiento Legal</div>
                            <div className="text-sm text-muted-foreground">Consultoría jurídica especializada</div>
                          </Link>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <Link 
                to="/about" 
                className="font-montserrat font-medium text-[#323232] hover:text-[#323232] transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] relative group focus:outline-none focus:ring-2 focus:ring-[#323232] focus:ring-offset-2 rounded-sm px-[18px] py-2" 
                style={{ fontSize: '16px' }}
              >
                Sobre Nosotros
                <span className="absolute -bottom-1 left-[18px] right-[18px] w-0 h-0.5 bg-[#D8771A] transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:w-[calc(100%-36px)]"></span>
              </Link>
              <Link 
                to="/blog" 
                className="font-montserrat font-medium text-[#323232] hover:text-[#323232] transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] relative group focus:outline-none focus:ring-2 focus:ring-[#323232] focus:ring-offset-2 rounded-sm px-[18px] py-2" 
                style={{ fontSize: '16px' }}
              >
                Liventy Insights
                <span className="absolute -bottom-1 left-[18px] right-[18px] w-0 h-0.5 bg-[#D8771A] transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:w-[calc(100%-36px)]"></span>
              </Link>
              <Link 
                to="/contact" 
                className="font-montserrat font-medium text-[#323232] hover:text-[#323232] transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] relative group focus:outline-none focus:ring-2 focus:ring-[#323232] focus:ring-offset-2 rounded-sm px-[18px] py-2" 
                style={{ fontSize: '16px' }}
              >
                Contacto
                <span className="absolute -bottom-1 left-[18px] right-[18px] w-0 h-0.5 bg-[#D8771A] transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:w-[calc(100%-36px)]"></span>
              </Link>
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link 
                to="/login"
                className="font-montserrat font-medium px-[18px] py-[10px] bg-transparent text-[#323232] border-2 border-[#D8771A] rounded-[12px] transition-all duration-200 hover:bg-[#D8771A] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#323232] focus:ring-offset-2"
                style={{ fontSize: '15px' }}
                aria-label="Acceder al área de clientes"
              >
                Acceso Clientes
              </Link>
              <Link 
                to="/propietarios#form"
                className="font-montserrat font-medium px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                style={{ fontSize: '15px' }}
                aria-label="Comenzar proceso como propietario"
              >
                Empezar ahora
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#323232] focus:ring-offset-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Abrir menú de navegación"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? 
                <X className="h-6 w-6 text-[#323232]" aria-hidden="true" /> : 
                <Menu className="h-6 w-6 text-[#323232]" aria-hidden="true" />
              }
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200" id="mobile-menu">
              <div className="flex flex-col space-y-2 pt-4">
                <Link 
                  to="/" 
                  className="font-montserrat font-medium text-[#323232] hover:text-[#D8771A] transition-colors min-h-[44px] flex items-center py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#323232] focus:ring-offset-2"
                  style={{ fontSize: '15px', letterSpacing: '-0.2px' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link 
                  to="/herramientas" 
                  className="font-montserrat font-medium text-[#323232] hover:text-[#D8771A] transition-colors min-h-[44px] flex items-center py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#323232] focus:ring-offset-2"
                  style={{ fontSize: '15px', letterSpacing: '-0.2px' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Herramientas
                </Link>
                
                {/* Servicios submenu for mobile */}
                <div className="pl-4 space-y-1">
                  <div className="font-montserrat font-medium text-gray-600 text-sm py-2">Servicios:</div>
                  <Link 
                    to="/servicios/gestion-integral" 
                    className="block font-montserrat text-[#323232] hover:text-[#D8771A] transition-colors min-h-[44px] flex items-center py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#323232] focus:ring-offset-2"
                    style={{ fontSize: '14px' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Gestión Integral
                  </Link>
                  <Link 
                    to="/servicios/alquiler-larga-duracion" 
                    className="block font-montserrat text-[#323232] hover:text-[#D8771A] transition-colors min-h-[44px] flex items-center py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#323232] focus:ring-offset-2"
                    style={{ fontSize: '14px' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Alquiler Larga Duración
                  </Link>
                  <Link 
                    to="/servicios/alquiler-temporada" 
                    className="block font-montserrat text-[#323232] hover:text-[#D8771A] transition-colors min-h-[44px] flex items-center py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#323232] focus:ring-offset-2"
                    style={{ fontSize: '14px' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Alquiler Temporada
                  </Link>
                  <Link 
                    to="/servicios/mantenimiento" 
                    className="block font-montserrat text-[#323232] hover:text-[#D8771A] transition-colors min-h-[44px] flex items-center py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#323232] focus:ring-offset-2"
                    style={{ fontSize: '14px' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mantenimiento
                  </Link>
                  <Link 
                    to="/servicios/asesoramiento-legal" 
                    className="block font-montserrat text-[#323232] hover:text-[#D8771A] transition-colors min-h-[44px] flex items-center py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#323232] focus:ring-offset-2"
                    style={{ fontSize: '14px' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Asesoramiento Legal
                  </Link>
                </div>
                
                <Link 
                  to="/about" 
                  className="font-montserrat font-medium text-[#323232] hover:text-[#D8771A] transition-colors min-h-[44px] flex items-center py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#323232] focus:ring-offset-2"
                  style={{ fontSize: '15px', letterSpacing: '-0.2px' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sobre Nosotros
                </Link>
                <Link 
                  to="/blog" 
                  className="font-montserrat font-medium text-[#323232] hover:text-[#D8771A] transition-colors min-h-[44px] flex items-center py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#323232] focus:ring-offset-2"
                  style={{ fontSize: '15px', letterSpacing: '-0.2px' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Liventy Insights
                </Link>
                <Link 
                  to="/contact" 
                  className="font-montserrat font-medium text-[#323232] hover:text-[#D8771A] transition-colors min-h-[44px] flex items-center py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#323232] focus:ring-offset-2"
                  style={{ fontSize: '15px', letterSpacing: '-0.2px' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contacto
                </Link>
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link
                    to="/login"
                    className="block font-montserrat font-medium px-4 py-3 min-h-[44px] flex items-center justify-center text-center bg-transparent text-[#323232] border-2 border-[#D8771A] rounded-[12px] hover:bg-[#D8771A] hover:text-white transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Acceder al área de clientes"
                  >
                    Acceso Clientes
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Mobile Sticky Bottom CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-4 shadow-lg">
        <Link 
          to="/propietarios#form"
          className="block w-full font-montserrat font-medium px-6 py-4 bg-primary text-white text-center rounded-lg hover:bg-primary/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          style={{ fontSize: '16px' }}
          aria-label="Comenzar proceso como propietario"
        >
          Empezar ahora
        </Link>
      </div>
    </>
  );
};

export default Header;