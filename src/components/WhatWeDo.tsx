import { Home, Scale, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const WhatWeDo = () => {
  const services = [
    {
      icon: Home,
      title: "Gestión integral del alquiler",
      description: "Publicamos tu vivienda, preseleccionamos inquilinos, formalizamos contratos con firma digital, coordinamos cobros y atención diaria, y resolvemos mantenimiento menor e incidencias.",
      note: "No garantizamos el cobro de rentas; actuamos como intermediarios para el propietario.",
      cta: "Quiero gestionarlo con Liventy",
      link: "/contacto?tipo=propietario"
    },
    {
      icon: Scale,
      title: "Asesoramiento legal",
      description: "Redacción y revisión de contratos estándar, comunicaciones y avisos. Resolución de dudas frecuentes sobre el alquiler.",
      note: "En casos complejos, te ponemos en contacto con abogados colaboradores de confianza.",
      cta: "Consultar mi caso",
      link: "/contacto?tipo=propietario"
    },
    {
      icon: Wrench,
      title: "Mantenimiento e incidencias",
      description: "Canal único para incidencias, coordinación de profesionales (fontanería, electricidad, persianas, calefacción…) y seguimiento en tiempo real para propietario e inquilino.",
      note: "Enfoque en pequeñas reparaciones y soluciones rápidas.",
      cta: "Cómo gestionamos incidencias",
      link: "/contacto?tipo=propietario"
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
            <Card key={index} className="text-center hover:shadow-lg transition-shadow bg-gray-700/80 dark:bg-gray-700/80 backdrop-blur-sm border-gray-600/50 flex flex-col h-full">
              <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/30 rounded-full mb-6 mx-auto">
                  <service.icon className="h-8 w-8 text-primary-foreground" aria-hidden="true" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white font-bold">{service.title}</h3>
                <p className="text-gray-100 text-sm sm:text-base leading-relaxed font-medium mb-4 flex-grow">{service.description}</p>
                <p className="text-gray-300 text-xs sm:text-sm italic mb-6">{service.note}</p>
                <Link to={service.link} className="mt-auto">
                  <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30">
                    {service.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;