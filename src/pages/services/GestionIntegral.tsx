import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronRight, Camera, Users, FileText, Wrench, Monitor, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const GestionIntegral = () => {
  const services = [
    {
      id: "publicacion",
      icon: Camera,
      title: "Publicación profesional",
      description: "Publicamos tu vivienda con imágenes profesionales en los portales más eficaces."
    },
    {
      id: "seleccion",
      icon: Users,
      title: "Selección rigurosa de inquilinos",
      description: "Seleccionamos inquilinos con un filtro riguroso: solvencia, estabilidad y responsabilidad."
    },
    {
      id: "contratos",
      icon: FileText,
      title: "Contratos con firma digital",
      description: "Firmamos digitalmente los contratos, adaptados a la normativa vigente."
    },
    {
      id: "incidencias",
      icon: Wrench,
      title: "Atención de incidencias",
      description: "Atendemos incidencias y necesidades del inquilino en tu nombre."
    },
    {
      id: "seguimiento",
      icon: Monitor,
      title: "Seguimiento online",
      description: "Te mantenemos informado a través de tu espacio privado online."
    },
    {
      id: "bizkaia",
      icon: MapPin,
      title: "Desde Bizkaia, con eficiencia",
      description: "Desde Bizkaia, trabajamos con procesos eficientes y visión de futuro."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Gestión de alquileres
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Vive tranquilo. Nosotros nos encargamos del resto.
            </p>
          </div>
        </section>

        {/* Intro */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <p className="text-lg leading-relaxed text-muted-foreground mb-8">
                Gestionar un piso en alquiler puede ser una carga silenciosa. Lo que comienza como una inversión, muchas veces acaba convirtiéndose en una fuente constante de estrés: llamadas de madrugada, reparaciones urgentes, retrasos en los pagos, papeleo sin fin. En Liventy Gestión hemos creado un modelo pensado para devolverte la tranquilidad.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Con una combinación inteligente de tecnología y atención humana, automatizamos lo que te resta tiempo y cuidamos personalmente lo que importa de verdad: tus intereses, tu propiedad y tu paz mental.
              </p>
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section className="py-16 sm:py-20 bg-muted/50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
                ¿Qué hacemos por ti?
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {services.map((service) => (
                  <Card key={service.id} className="h-fit">
                    <CardContent className="p-6">
                      <Accordion type="single" collapsible>
                        <AccordionItem value={service.id} className="border-none">
                          <AccordionTrigger 
                            className="py-0 hover:no-underline"
                            aria-expanded="false"
                            aria-controls={`content-${service.id}`}
                          >
                            <div className="flex items-center space-x-3 text-left">
                              <service.icon 
                                className="h-6 w-6 text-primary flex-shrink-0" 
                                aria-hidden="true"
                              />
                              <span className="font-semibold">{service.title}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent 
                            id={`content-${service.id}`}
                            className="pt-4 pb-0"
                          >
                            <p className="text-muted-foreground leading-relaxed">
                              {service.description}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cierre */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Tu alquiler, sin sobresaltos.
              </h2>
              <p className="text-xl text-muted-foreground">
                Tu tiempo, para ti.
              </p>
            </div>
            <Link to="/contacto?tipo=propietario&origen=gestion-alquileres">
              <Button size="lg" className="text-lg px-8 py-6">
                ¿Quieres vivir sin preocuparte por tu alquiler?
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GestionIntegral;