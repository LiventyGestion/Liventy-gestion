import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import sellBgImage from "@/assets/sell-section-bg.jpg";

const SellCTA = () => {
  return (
    <section 
      id="venta-liventy" 
      className="relative h-[380px] sm:h-[420px] overflow-hidden animate-fade-in"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${sellBgImage})`,
          filter: 'saturate(0.7)'
        }}
        aria-hidden="true"
      />
      
      {/* Overlay Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)'
        }}
        aria-hidden="true"
      />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 h-full flex items-center justify-center">
        <div className="text-center max-w-3xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            ¿Pensando en vender?
          </h2>
          <p className="text-lg sm:text-xl text-white/95 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            Te acompañamos para que vendas con la misma transparencia, calma y confianza que nos define.
          </p>
          
          {/* Benefits List - Hidden on mobile */}
          <ul className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8 text-white">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#E67E0F] flex-shrink-0" aria-hidden="true" />
              <span className="text-sm sm:text-base font-semibold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Valoración justa y profesional</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#E67E0F] flex-shrink-0" aria-hidden="true" />
              <span className="text-sm sm:text-base font-semibold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Asesoramiento integral hasta la firma</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#E67E0F] flex-shrink-0" aria-hidden="true" />
              <span className="text-sm sm:text-base font-semibold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Sin presión ni exclusividad</span>
            </li>
          </ul>
          
          {/* CTA Button */}
          <Button 
            asChild
            size="lg"
            className="bg-[#E67E0F] hover:bg-[#E67E0F]/90 text-white font-semibold px-8 py-6 text-base sm:text-lg shadow-lg hover:shadow-[0_0_30px_rgba(230,126,15,0.4)] transition-all duration-300 hover:scale-105"
          >
            <Link to="/contact#empezar">
              Empieza ahora
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SellCTA;