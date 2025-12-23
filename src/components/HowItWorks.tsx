import { Clock, Megaphone, FileSignature, CalendarCheck, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const navigate = useNavigate();
  
  const steps = [
    {
      icon: Clock,
      number: "01",
      title: "Valoración",
      subtitle: "48h",
      description: "Evaluamos tu propiedad y te ofrecemos un plan personalizado",
      image: "/lovable-uploads/b4a76387-69d3-4fa0-9e09-934dde585363.png",
      alt: "Casa de madera sobre una mano"
    },
    {
      icon: Megaphone,
      number: "02", 
      title: "Difusión",
      subtitle: "Multicanal",
      description: "Publicamos en los principales portales y redes",
      image: "/lovable-uploads/98990406-f523-46ea-a27a-6893ca3ad8c7.png",
      alt: "Pareja bailando durante mudanza"
    },
    {
      icon: FileSignature,
      number: "03",
      title: "Firma digital",
      subtitle: "",
      description: "Contrato seguro y 100% online",
      image: "/lovable-uploads/87c23692-794b-47a0-adb7-f4e7747cb435.png",
      alt: "Casa en mano y dinero"
    },
    {
      icon: CalendarCheck,
      number: "04",
      title: "Gestión mensual",
      subtitle: "",
      description: "Seguimiento, cobros e incidencias resueltas",
      image: "/lovable-uploads/b4a76387-69d3-4fa0-9e09-934dde585363.png",
      alt: "Gestión mensual de alquiler"
    }
  ];

  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Cómo trabajamos</h2>
          <p className="text-muted-foreground text-lg">
            Cuatro pasos para alquilar sin complicaciones
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto md:items-stretch">
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
                <CardContent className="p-6 flex-1 flex flex-col justify-between bg-white">
                  <div className="flex flex-col items-center text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-full text-primary-foreground text-xl font-bold mb-4 -mt-8 relative z-10 border-4 border-white shadow-lg">
                      {step.number}
                    </div>
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mb-4">
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                    {step.subtitle && (
                      <span className="text-sm text-primary font-medium mb-2">{step.subtitle}</span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm text-center">{step.description}</p>
                </CardContent>
              </Card>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-primary/20 transform -translate-y-1/2 z-10"></div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => navigate('/contact#empezar')}
          >
            Quiero empezar
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
