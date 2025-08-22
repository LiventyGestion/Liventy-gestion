import { Phone, UserSearch, Banknote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import propertyConsultation from "@/assets/property-consultation.jpg";

const HowItWorks = () => {
  const steps = [
    {
      icon: Phone,
      number: "01",
      title: "Te contactamos y valoramos tu piso",
      description: "Evaluamos tu propiedad y te ofrecemos un plan personalizado de gestión"
    },
    {
      icon: UserSearch,
      number: "02", 
      title: "Encontramos al inquilino ideal",
      description: "Buscamos y seleccionamos inquilinos que cumplan todos nuestros criterios de calidad"
    },
    {
      icon: Banknote,
      number: "03",
      title: "Tú cobras sin preocuparte por nada",
      description: "Recibe tus ingresos puntualmente mientras nosotros gestionamos todo lo demás"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-bl from-background via-primary/5 to-accent/10 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={propertyConsultation} 
          alt="Property consultation" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-background/90 via-background/85 to-background/80"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">¿Cómo funciona?</h2>
          <p className="text-muted-foreground text-lg">
            Tres pasos sencillos para maximizar tu rentabilidad
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full text-primary-foreground text-2xl font-bold mb-6">
                    {step.number}
                  </div>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-6">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/20 transform -translate-y-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;