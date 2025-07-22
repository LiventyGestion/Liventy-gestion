import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/20 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Gestión completa de tu alquiler,
            <span className="text-primary block">sin complicaciones.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Modernizamos el alquiler residencial para propietarios exigentes.
          </p>

          <Button 
            size="lg" 
            className="text-lg px-8"
            onClick={() => navigate('/contact')}
          >
            Empieza ahora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;