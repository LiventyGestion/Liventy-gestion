import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SellCTA = () => {
  return (
    <section className="py-8 bg-muted/30 border-t">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2 text-foreground/80">
            PENSANDO EN VENDER?
          </h2>
          <p className="text-muted-foreground mb-4">
            ¿Pensando en vender? Te asesoramos sin compromiso.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="hover:bg-primary hover:text-primary-foreground"
          >
            <Link to="/propietarios#form?origen=venta_home">
              Quiero información
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SellCTA;