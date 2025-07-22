import { Search, Shield, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const WhatWeDo = () => {
  const services = [
    {
      icon: Search,
      title: "Búsqueda de inquilinos",
      description: "Encontramos y filtramos a los mejores inquilinos para tu propiedad"
    },
    {
      icon: Shield,
      title: "Gestión legal y cobros",
      description: "Nos encargamos de todos los aspectos legales y garantizamos los pagos"
    },
    {
      icon: Settings,
      title: "Atención 360°",
      description: "Servicio integral que abarca desde el mantenimiento hasta la atención al cliente"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">¿Qué hacemos en Liventy Gestión?</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;