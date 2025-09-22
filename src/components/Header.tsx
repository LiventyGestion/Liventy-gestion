import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img 
                src="/lovable-uploads/5b1ed236-dc4e-465f-a21e-7c3186a1ba0d.png" 
                alt="Liventy Gestión - Volver al inicio" 
                className="h-16 sm:h-18 lg:h-20 w-auto transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(230,126,15,0.6)]"
                style={{ transform: 'scale(1.15)' }}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link 
                to="/" 
                className="font-montserrat font-medium text-base text-gray-800 hover:text-primary transition-colors relative group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1 py-1" 
                style={{ fontSize: '16px', letterSpacing: '-0.02em' }}
              >
                Inicio
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/propietarios" 
                className="font-montserrat font-medium text-base text-gray-800 hover:text-primary transition-colors relative group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1 py-1" 
                style={{ fontSize: '16px', letterSpacing: '-0.02em' }}
              >
                Propietarios
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/herramientas" 
                className="font-montserrat font-medium text-base text-gray-800 hover:text-primary transition-colors relative group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1 py-1" 
                style={{ fontSize: '16px', letterSpacing: '-0.02em' }}
              >
                Herramientas
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/servicios/alquiler-larga-duracion" 
                className="font-montserrat font-medium text-base text-gray-800 hover:text-primary transition-colors relative group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1 py-1" 
                style={{ fontSize: '16px', letterSpacing: '-0.02em' }}
              >
                Alquiler por meses
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/empresas" 
                className="font-montserrat font-medium text-base text-gray-800 hover:text-primary transition-colors relative group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1 py-1" 
                style={{ fontSize: '16px', letterSpacing: '-0.02em' }}
              >
                Empresas
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/blog" 
                className="font-montserrat font-medium text-base text-gray-800 hover:text-primary transition-colors relative group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1 py-1" 
                style={{ fontSize: '16px', letterSpacing: '-0.02em' }}
              >
                Blog
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link 
                to="/contact" 
                className="font-montserrat font-medium text-base text-gray-800 hover:text-primary transition-colors relative group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1 py-1" 
                style={{ fontSize: '16px', letterSpacing: '-0.02em' }}
              >
                Contacto
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link 
                to="/login"
                className="font-montserrat font-medium px-5 py-2.5 text-gray-800 border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Abrir menú de navegación"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? 
                <X className="h-6 w-6 text-gray-800" aria-hidden="true" /> : 
                <Menu className="h-6 w-6 text-gray-800" aria-hidden="true" />
              }
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200" id="mobile-menu">
              <div className="flex flex-col space-y-4 pt-4">
                <Link 
                  to="/" 
                  className="font-montserrat font-medium text-gray-800 hover:text-primary transition-colors py-2 px-1 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link 
                  to="/propietarios" 
                  className="font-montserrat font-medium text-gray-800 hover:text-primary transition-colors py-2 px-1 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Propietarios
                </Link>
                <Link 
                  to="/herramientas" 
                  className="font-montserrat font-medium text-gray-800 hover:text-primary transition-colors py-2 px-1 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Herramientas
                </Link>
                <Link 
                  to="/servicios/alquiler-larga-duracion" 
                  className="font-montserrat font-medium text-gray-800 hover:text-primary transition-colors py-2 px-1 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Alquiler por meses
                </Link>
                <Link 
                  to="/empresas" 
                  className="font-montserrat font-medium text-gray-800 hover:text-primary transition-colors py-2 px-1 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Empresas
                </Link>
                <Link 
                  to="/blog" 
                  className="font-montserrat font-medium text-gray-800 hover:text-primary transition-colors py-2 px-1 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link 
                  to="/contact" 
                  className="font-montserrat font-medium text-gray-800 hover:text-primary transition-colors py-2 px-1 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contacto
                </Link>
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link 
                    to="/login"
                    className="block font-montserrat font-medium px-4 py-2.5 text-center text-gray-800 border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
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