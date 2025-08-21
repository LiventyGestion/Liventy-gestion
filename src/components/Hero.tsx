import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBackground from "@/assets/hero-modern-property.jpg";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-background via-accent/5 to-primary/5 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBackground} 
          alt="" 
          className="w-full h-full object-cover opacity-15"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/85"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight">
            Gestionamos tu alquiler con
            <span className="text-primary block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              eficiencia, estilo y tranquilidad.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Alquileres residenciales gestionados de principio a fin en Bizkaia. 
            <span className="block mt-2 text-primary font-semibold">100% digital y personalizado.</span>
          </p>

          <Button 
            size="lg" 
            className="text-lg px-8 py-6 h-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => navigate('/contact')}
            aria-label="Contactar para que gestionemos tu piso"
          >
            Quiero que gestionéis mi piso
            <ArrowRight className="ml-3 h-6 w-6" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;