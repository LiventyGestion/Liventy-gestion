import { Search, Shield, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import digitalManagement from "@/assets/digital-management.jpg";

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
    <section className="py-12 sm:py-16 bg-gradient-to-br from-orange-50/60 via-orange-100/40 to-orange-50/80 dark:from-orange-950/10 dark:to-orange-900/20 relative overflow-hidden">
      {/* Subtle diffused overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-100/20 to-transparent blur-3xl"></div>
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">¿Qué hacemos en Liventy Gestión?</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow bg-gray-700/80 dark:bg-gray-700/80 backdrop-blur-sm border-gray-600/50">
              <CardContent className="p-6 sm:p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/30 rounded-full mb-6">
                  <service.icon className="h-8 w-8 text-primary-foreground" aria-hidden="true" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white font-bold">{service.title}</h3>
                <p className="text-gray-100 text-sm sm:text-base leading-relaxed font-medium">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;