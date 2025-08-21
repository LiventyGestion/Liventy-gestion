import { Link } from "react-router-dom";
import { Building2, Mail, Phone, MapPin } from "lucide-react";
import teamTrust from "@/assets/team-trust.jpg";

const Footer = () => {
  return (
    <footer className="bg-muted mt-16 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={teamTrust} 
          alt="" 
          className="w-full h-full object-cover opacity-5"
          aria-hidden="true"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-muted/95"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 py-12 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/8a8330ce-f5ff-4c18-9ac4-2d21db8b4d79.png" 
                alt="Liventy Gestión - Logo de la empresa" 
                className="h-16 sm:h-20 w-auto"
              />
            </div>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base leading-relaxed">
              Maximiza la rentabilidad de tus propiedades. 
              Gestión completa, transparencia total y tecnología avanzada.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
                <a href="tel:610835611" className="hover:text-primary transition-colors">
                  610 835 611
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                <a 
                  href="mailto:liventygestion@gmail.com" 
                  className="hover:text-primary transition-colors"
                  aria-label="Enviar email a Liventy Gestión"
                >
                  liventygestion@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                <span className="text-muted-foreground">
                  Bizkaia, País Vasco
                </span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4 text-sm sm:text-base">Servicios</h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>Gestión de alquileres</li>
              <li>Alquiler temporada</li>
              <li>Alquiler larga duración</li>
              <li>Mantenimiento</li>
              <li>Asesoría legal</li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm sm:text-base">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/about" 
                  className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded"
                >
                  Liventy Insights
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded"
                >
                  Área de Clientes
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-sm sm:text-base">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/politica-privacidad" 
                  className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded"
                >
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link 
                  to="/politica-cookies" 
                  className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded"
                >
                  Cookies
                </Link>
              </li>
              <li className="text-muted-foreground">Términos y Condiciones</li>
              <li className="text-muted-foreground">Aviso Legal</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 Liventy Gestión. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;