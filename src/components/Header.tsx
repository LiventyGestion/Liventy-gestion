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
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Logo - Left */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/icons/logo-source.svg" 
                alt="Liventy Gestión - Volver al inicio" 
                className="h-12 sm:h-14 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center justify-center space-x-8">
            <Link 
              to="/" 
              className="relative text-brand-charcoal hover:text-brand-orange transition-colors duration-200 font-raleway font-semibold text-sm tracking-wide py-2 group"
            >
              Inicio
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-200 group-hover:w-full" style={{ transform: 'translateY(2px)' }}></span>
            </Link>
            <Link 
              to="/herramientas" 
              className="relative text-brand-charcoal hover:text-brand-orange transition-colors duration-200 font-raleway font-semibold text-sm tracking-wide py-2 group"
            >
              Herramientas
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-200 group-hover:w-full" style={{ transform: 'translateY(2px)' }}></span>
            </Link>
            
            {/* Services Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="relative text-brand-charcoal hover:text-brand-orange transition-colors duration-200 bg-transparent hover:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent focus:bg-transparent font-raleway font-semibold text-sm tracking-wide h-auto p-0 py-2 group">
                    Servicios
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-200 group-hover:w-full group-data-[state=open]:w-full" style={{ transform: 'translateY(2px)' }}></span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4">
                      <div className="grid gap-3">
                        <NavigationMenuLink asChild>
                          <Link 
                            to="/servicios/gestion-de-alquileres"
                            className="block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-neutral-50 hover:text-brand-charcoal focus:bg-neutral-50 focus:text-brand-charcoal"
                          >
                            <div className="text-sm font-semibold leading-none text-brand-charcoal">Gestión Integral</div>
                            <p className="line-clamp-2 text-sm leading-snug text-neutral-500">
                              Servicio completo de gestión de alquileres
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link 
                            to="/servicios/alquiler-larga-duracion"
                            className="block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-neutral-50 hover:text-brand-charcoal focus:bg-neutral-50 focus:text-brand-charcoal"
                          >
                            <div className="text-sm font-semibold leading-none text-brand-charcoal">Alquiler Larga Duración</div>
                            <p className="line-clamp-2 text-sm leading-snug text-neutral-500">
                              Gestión de alquileres residenciales
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link 
                            to="/servicios/alquiler-temporada"
                            className="block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-neutral-50 hover:text-brand-charcoal focus:bg-neutral-50 focus:text-brand-charcoal"
                          >
                            <div className="text-sm font-semibold leading-none text-brand-charcoal">Alquiler Temporada</div>
                            <p className="line-clamp-2 text-sm leading-snug text-neutral-500">
                              Gestión de alquileres vacacionales
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link 
                            to="/servicios/mantenimiento"
                            className="block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-neutral-50 hover:text-brand-charcoal focus:bg-neutral-50 focus:text-brand-charcoal"
                          >
                            <div className="text-sm font-semibold leading-none text-brand-charcoal">Mantenimiento</div>
                            <p className="line-clamp-2 text-sm leading-snug text-neutral-500">
                              Gestión de incidencias y reparaciones
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link 
                            to="/servicios/asesoria-legal"
                            className="block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-neutral-50 hover:text-brand-charcoal focus:bg-neutral-50 focus:text-brand-charcoal"
                          >
                            <div className="text-sm font-semibold leading-none text-brand-charcoal">Asesoría Legal</div>
                            <p className="line-clamp-2 text-sm leading-snug text-neutral-500">
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
            
            <Link 
              to="/about" 
              className="relative text-brand-charcoal hover:text-brand-orange transition-colors duration-200 font-raleway font-semibold text-sm tracking-wide py-2 group"
            >
              Sobre Nosotros
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-200 group-hover:w-full" style={{ transform: 'translateY(2px)' }}></span>
            </Link>
            <Link 
              to="/blog" 
              className="relative text-brand-charcoal hover:text-brand-orange transition-colors duration-200 font-raleway font-semibold text-sm tracking-wide py-2 group"
            >
              Liventy Insights
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-200 group-hover:w-full" style={{ transform: 'translateY(2px)' }}></span>
            </Link>
            <Link 
              to="/contact" 
              className="relative text-brand-charcoal hover:text-brand-orange transition-colors duration-200 font-raleway font-semibold text-sm tracking-wide py-2 group"
            >
              Contacto
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-200 group-hover:w-full" style={{ transform: 'translateY(2px)' }}></span>
            </Link>
          </div>

          {/* CTA Button - Right */}
          <div className="flex items-center justify-end">
            <Link to="/login" className="hidden sm:block">
              <Button className="bg-brand-orange hover:bg-opacity-90 text-brand-white font-raleway font-semibold px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2">
                Área de Clientes
              </Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-neutral-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Abrir menú de navegación"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? 
                <X className="h-6 w-6 text-brand-charcoal" aria-hidden="true" /> : 
                <Menu className="h-6 w-6 text-brand-charcoal" aria-hidden="true" />
              }
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-4 pb-6 border-t border-neutral-200 mt-4" id="mobile-menu">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-brand-charcoal hover:text-brand-orange transition-colors duration-200 py-3 px-2 rounded-xl hover:bg-neutral-50 font-raleway font-semibold text-base focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                to="/herramientas" 
                className="text-brand-charcoal hover:text-brand-orange transition-colors duration-200 py-3 px-2 rounded-xl hover:bg-neutral-50 font-raleway font-semibold text-base focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Herramientas
              </Link>
              
              {/* Services Mobile Menu */}
              <div className="space-y-2">
                <div className="text-brand-charcoal font-raleway font-bold text-base py-3 px-2">Servicios</div>
                <div className="pl-4 space-y-2">
                  <Link 
                    to="/servicios/gestion-de-alquileres"
                    className="block text-neutral-500 hover:text-brand-orange transition-colors duration-200 py-2 px-2 rounded-lg hover:bg-neutral-50 font-raleway text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Gestión Integral
                  </Link>
                  <Link 
                    to="/servicios/alquiler-larga-duracion"
                    className="block text-neutral-500 hover:text-brand-orange transition-colors duration-200 py-2 px-2 rounded-lg hover:bg-neutral-50 font-raleway text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Alquiler Larga Duración
                  </Link>
                  <Link 
                    to="/servicios/alquiler-temporada"
                    className="block text-neutral-500 hover:text-brand-orange transition-colors duration-200 py-2 px-2 rounded-lg hover:bg-neutral-50 font-raleway text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Alquiler Temporada
                  </Link>
                  <Link 
                    to="/servicios/mantenimiento"
                    className="block text-neutral-500 hover:text-brand-orange transition-colors duration-200 py-2 px-2 rounded-lg hover:bg-neutral-50 font-raleway text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mantenimiento
                  </Link>
                  <Link 
                    to="/servicios/asesoria-legal"
                    className="block text-neutral-500 hover:text-brand-orange transition-colors duration-200 py-2 px-2 rounded-lg hover:bg-neutral-50 font-raleway text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Asesoría Legal
                  </Link>
                </div>
              </div>
              
              <Link 
                to="/about" 
                className="text-brand-charcoal hover:text-brand-orange transition-colors duration-200 py-3 px-2 rounded-xl hover:bg-neutral-50 font-raleway font-semibold text-base focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre Nosotros
              </Link>
              <Link 
                to="/blog" 
                className="text-brand-charcoal hover:text-brand-orange transition-colors duration-200 py-3 px-2 rounded-xl hover:bg-neutral-50 font-raleway font-semibold text-base focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Liventy Insights
              </Link>
              <Link 
                to="/contact" 
                className="text-brand-charcoal hover:text-brand-orange transition-colors duration-200 py-3 px-2 rounded-xl hover:bg-neutral-50 font-raleway font-semibold text-base focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
              
              {/* Mobile CTA */}
              <div className="pt-4">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-brand-orange hover:bg-opacity-90 text-brand-white font-raleway font-semibold py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2">
                    Área de Clientes
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;