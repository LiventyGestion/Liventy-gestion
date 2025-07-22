import { CheckCircle, TrendingUp, Wrench, UserCheck, Monitor } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Beneficios para Propietarios</h2>
          <p className="text-muted-foreground text-lg">
            Descubre las ventajas de confiar tu propiedad a Liventy Gestión
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
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