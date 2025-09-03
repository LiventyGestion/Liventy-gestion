import { CheckCircle, TrendingUp, Wrench, UserCheck, Monitor, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import happyHomeowner from "@/assets/happy-homeowner.jpg";

const OwnerBenefits = () => {
  const benefits = [
    {
      icon: CheckCircle,
      title: "Sin gestiones ni dolores de cabeza",
      description: "Nos ocupamos de todo el proceso administrativo y legal"
    },
    {
      icon: TrendingUp,
      title: "Mayor rentabilidad con menos riesgo",
      description: "Optimizamos tus ingresos mientras minimizamos los riesgos"
    },
    {
      icon: Wrench,
      title: "Mantenimiento exprés",
      description: "Red de profesionales para resolver cualquier incidencia rápidamente"
    },
    {
      icon: UserCheck,
      title: "Selección de inquilinos filtrados",
      description: "Proceso riguroso de verificación de solvencia y referencias"
    },
    {
      icon: Monitor,
      title: "Seguimiento online 24/7",
      description: "Plataforma digital para controlar todo en tiempo real"
    },
    {
      icon: Eye,
      title: "Transparencia total",
      description: "Informes detallados y comunicación clara en cada paso del proceso"
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-muted/30 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src={happyHomeowner} 
          alt="Happy homeowner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">¿Porqué los propietarios nos eligen?</h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Descubre las ventajas de confiar tu propiedad a Liventy Gestión
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto lg:items-stretch">
          {benefits.map((benefit, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow h-full flex flex-col">
              <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                      <benefit.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col">
                    <h3 className="font-semibold text-base sm:text-lg mb-2 leading-tight">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">{benefit.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OwnerBenefits;