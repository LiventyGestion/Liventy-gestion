import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/20 py-16 sm:py-20 lg:py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBackground} 
          alt="" 
          className="w-full h-full object-cover opacity-10"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/80 to-background/90"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Gestión completa de tu alquiler,
            <span className="text-primary block">sin complicaciones.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Modernizamos el alquiler residencial para propietarios exigentes.
          </p>

          <Button 
            size="lg" 
            className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 min-h-[44px]"
            onClick={() => navigate('/contact')}
            aria-label="Contactar para gestionar mi alquiler"
          >
            Quiero gestionar mi alquiler
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;