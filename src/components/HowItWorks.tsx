import { Phone, UserSearch, Banknote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HowItWorks = () => {
  const steps = [
    {
      icon: Phone,
      number: "01",
      title: "Te contactamos y valoramos tu piso",
      description: "Evaluamos tu propiedad y te ofrecemos un plan personalizado de gestión",
      image: "/lovable-uploads/b4a76387-69d3-4fa0-9e09-934dde585363.png",
      alt: "Casa de madera sobre una mano"
    },
    {
      icon: UserSearch,
      number: "02", 
      title: "Encontramos al inquilino ideal",
      description: "Buscamos y seleccionamos inquilinos que cumplan todos nuestros criterios de calidad",
      image: "/lovable-uploads/98990406-f523-46ea-a27a-6893ca3ad8c7.png",
      alt: "Pareja bailando durante mudanza"
    },
    {
      icon: Banknote,
      number: "03",
      title: "Tú cobras sin preocuparte por nada",
      description: "Recibe tus ingresos puntualmente mientras nosotros gestionamos todo lo demás",
      image: "/lovable-uploads/87c23692-794b-47a0-adb7-f4e7747cb435.png",
      alt: "Casa en mano y dinero"
    }
  ];

  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">¿Cómo funciona?</h2>
          <p className="text-muted-foreground text-lg">
            Tres pasos sencillos para maximizar tu rentabilidad
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto md:items-stretch">
          {steps.map((step, index) => (
            <div key={index} className="relative flex">
              <Card className="w-full h-full flex flex-col hover:scale-[1.02] hover:shadow-xl transition-all duration-200 ease-out overflow-hidden rounded-2xl group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={step.image} 
                    alt={step.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <CardContent className="p-8 flex-1 flex flex-col justify-between bg-white">
                  <div className="flex flex-col items-center text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full text-primary-foreground text-2xl font-bold mb-6 -mt-8 relative z-10 border-4 border-white shadow-lg">
                      {step.number}
                    </div>
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-6">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-center">{step.description}</p>
                </CardContent>
              </Card>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/20 transform -translate-y-1/2 z-10"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;