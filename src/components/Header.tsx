import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/5b1ed236-dc4e-465f-a21e-7c3186a1ba0d.png" 
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