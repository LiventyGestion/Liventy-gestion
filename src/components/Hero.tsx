import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, FileText, Wrench, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBackground from "@/assets/hero-modern-property.jpg";

const Hero = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Shield,
      text: "Selección rigurosa de inquilinos"
    },
    {
      icon: FileText,
      text: "Contrato y trámites"
    },
    {
      icon: Wrench,
      text: "Incidencias y mantenimiento"
    },
    {
      icon: BarChart3,
      text: "Reportes claros"
    }
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-background via-accent/5 to-primary/5 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBackground} 
          alt="" 
          className="w-full h-full object-cover opacity-60"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/85 to-background/90"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-montserrat text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
            Gestión integral de alquileres en
            <span className="text-primary block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Bizkaia
            </span>
          </h1>
          
          <p className="font-lato text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed">
            Tu vivienda, más rentable y sin preocupaciones.
          </p>

          {/* Benefits List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/20">
                <benefit.icon className="h-8 w-8 text-primary mb-3" />
                <span className="font-lato text-sm font-medium text-foreground">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 h-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/propietarios#form')}
              aria-label="Empezar proceso de gestión de alquiler"
            >
              Empezar ahora
              <ArrowRight className="ml-3 h-6 w-6" aria-hidden="true" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6 h-auto border-primary text-primary hover:bg-primary/5 transition-all duration-300"
              onClick={() => navigate('/herramientas')}
              aria-label="Valorar piso gratuitamente"
            >
              Valora gratis mi piso
            </Button>
          </div>

          {/* Discrete line */}
          <p className="font-lato text-sm text-muted-foreground opacity-75 max-w-2xl mx-auto">
            También ofrecemos alquiler por meses y colaboración con empresas, si lo necesitas.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;