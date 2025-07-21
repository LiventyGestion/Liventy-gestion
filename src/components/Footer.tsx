import { Link } from "react-router-dom";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/8a8330ce-f5ff-4c18-9ac4-2d21db8b4d79.png" 
                alt="Liventy Gestión" 
                className="h-20 w-auto"
              />
            </div>
            <p className="text-muted-foreground mb-4">
              Maximiza la rentabilidad de tus propiedades. 
              Gestión completa, transparencia total y tecnología avanzada.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>610 835 611</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>liventygestion@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Gestión de alquileres</li>
              <li>Alquiler temporada</li>
              <li>Alquiler larga duración</li>
              <li>Mantenimiento</li>
              <li>Asesoría legal</li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Liventy Insights
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Área de Clientes
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Política de Privacidad</li>
              <li>Términos y Condiciones</li>
              <li>Cookies</li>
              <li>Aviso Legal</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 Liventy Gestión. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;