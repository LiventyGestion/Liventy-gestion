import { Button } from "@/components/ui/button";
import { Calculator, Users, Download, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SecondaryCTAs = () => {
  const navigate = useNavigate();


  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          
          {/* Tools CTA */}
          <div className="text-center p-6 rounded-lg bg-gradient-to-br from-primary/5 to-accent/10 border border-primary/20">
            <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Herramientas gratuitas</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Precio, rentabilidad y comparador en 2 minutos
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/herramientas')}
              className="h-11"
            >
              Usar herramientas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Owner Area CTA */}
          <div className="text-center p-6 rounded-lg bg-gradient-to-br from-secondary/5 to-accent/10 border border-secondary/20">
            <Users className="h-12 w-12 text-secondary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Área de propietarios</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Accede a tu panel de gestión personalizado
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/login')}
              className="h-11"
            >
              Acceder al área
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Lead Magnet CTA */}
          <div className="text-center p-6 rounded-lg bg-gradient-to-br from-accent/5 to-primary/10 border border-accent/20">
            <Download className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Guía gratuita</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Descarga tu guía para alquilar sin preocupaciones
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/guia-gratuita')}
              className="h-11"
            >
              Descarga gratuita
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SecondaryCTAs;