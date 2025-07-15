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
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">Liventy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Inicio
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
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t">
            <div className="flex flex-col space-y-4 pt-4">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                Inicio
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