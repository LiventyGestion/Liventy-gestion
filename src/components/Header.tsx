import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useGA4Tracking } from "@/hooks/useGA4Tracking";

const navItems = [
  { label: "Propietarios", href: "/propietarios" },
  { label: "Inquilinos", href: "/inquilinos" },
  { label: "Precios", href: "/precios" },
  { label: "Recursos", href: "/recursos" },
  { label: "Sobre", href: "/about" },
  { label: "Contacto", href: "/contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { trackValoraTuPiso } = useGA4Tracking();

  const isActive = (href: string) => location.pathname === href;

  const handleValoraCTA = () => {
    trackValoraTuPiso('header', '/recursos#calculadora-precio');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - Left */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/5b1ed236-dc4e-465f-a21e-7c3186a1ba0d.png" 
                alt="Liventy Gestión - Volver al inicio" 
                className="h-12 sm:h-14 w-auto"
                onError={(e) => {
                  e.currentTarget.src = "/icons/logo-source.svg";
                }}
              />
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center justify-center space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                to={item.href} 
                className={`relative text-brand-charcoal hover:text-brand-orange transition-colors duration-200 font-lato font-semibold text-sm tracking-wide py-2 group ${
                  isActive(item.href) ? "text-brand-orange" : ""
                }`}
              >
                {item.label}
                <span 
                  className={`absolute bottom-0 left-0 h-0.5 bg-brand-orange transition-all duration-200 ${
                    isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`} 
                  style={{ transform: 'translateY(2px)' }}
                />
              </Link>
            ))}
          </div>

          {/* CTA Buttons - Right */}
          <div className="flex items-center gap-3">
            {/* Primary CTA - Valora tu piso gratis */}
            <Link to="/recursos#calculadora-precio" className="hidden sm:block" onClick={handleValoraCTA}>
              <Button className="bg-brand-orange hover:bg-brand-orange/90 text-brand-white font-lato font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2">
                Valora tu piso gratis
              </Button>
            </Link>
            
            {/* Secondary CTA - Área Clientes */}
            <Link to="/login" className="hidden md:block">
              <Button variant="outline" className="border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal hover:text-white font-lato font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-charcoal focus:ring-offset-2">
                Área Clientes
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
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  to={item.href} 
                  className={`text-brand-charcoal hover:text-brand-orange transition-colors duration-200 py-3 px-3 rounded-xl hover:bg-neutral-50 font-lato font-semibold text-base focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 ${
                    isActive(item.href) ? "text-brand-orange bg-orange-50" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile CTAs */}
              <div className="pt-4 space-y-3">
                <Link to="/recursos#calculadora-precio" onClick={() => { setIsMenuOpen(false); handleValoraCTA(); }}>
                  <Button className="w-full bg-brand-orange hover:bg-brand-orange/90 text-brand-white font-lato font-semibold py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2">
                    Valora tu piso gratis
                  </Button>
                </Link>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal hover:text-white font-lato font-semibold py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-charcoal focus:ring-offset-2">
                    Área Clientes
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