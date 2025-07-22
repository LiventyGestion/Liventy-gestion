import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Confía tu alquiler a profesionales.
          </h2>
          <h3 className="text-2xl lg:text-3xl font-semibold mb-8">
            Empieza ahora.
          </h3>
          <p className="text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
            Únete a cientos de propietarios que ya disfrutan de una gestión sin complicaciones 
            y una rentabilidad optimizada.
          </p>
          
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-4"
            onClick={() => navigate('/contact')}
          >
            Contactar con Liventy
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;