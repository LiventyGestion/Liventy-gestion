import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronRight, Camera, Users, FileText, Wrench, Monitor, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import rentalHeroImage from "@/assets/rental-management-hero.jpg";
import propertyProfessionalImage from "@/assets/property-management-professional.jpg";
import digitalTechImage from "@/assets/digital-property-tech.jpg";
import peacefulHomeownerImage from "@/assets/peaceful-homeowner.jpg";

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
        <section className="relative py-20 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={rentalHeroImage} 
              alt="Gestión profesional de alquileres" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/90"></div>
          </div>
          <div className="relative z-10 container mx-auto px-6 text-center text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Gestión de alquileres
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-2xl mx-auto opacity-95">
              Vive tranquilo. Nosotros nos encargamos del resto.
            </p>
          </div>
        </section>

        {/* Intro */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                    Gestionar un piso en alquiler puede ser una carga silenciosa. Lo que comienza como una inversión, muchas veces acaba convirtiéndose en una fuente constante de estrés: llamadas de madrugada, reparaciones urgentes, retrasos en los pagos, papeleo sin fin. En Liventy Gestión hemos creado un modelo pensado para devolverte la tranquilidad.
                  </p>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Con una combinación inteligente de tecnología y atención humana, automatizamos lo que te resta tiempo y cuidamos personalmente lo que importa de verdad: tus intereses, tu propiedad y tu paz mental.
                  </p>
                </div>
                <div className="order-1 lg:order-2">
                  <div className="relative">
                    <img 
                      src={propertyProfessionalImage} 
                      alt="Profesional de gestión inmobiliaria trabajando" 
                      className="w-full h-80 object-cover rounded-2xl shadow-lg"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section className="py-16 sm:py-20 bg-muted/50">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  ¿Qué hacemos por ti?
                </h2>
                <div className="relative inline-block">
                  <img 
                    src={digitalTechImage} 
                    alt="Tecnología digital en gestión inmobiliaria" 
                    className="w-80 h-48 object-cover rounded-xl shadow-lg mx-auto"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {services.map((service) => (
                  <Card key={service.id} className="h-fit hover:shadow-lg transition-shadow">
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
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    Tu alquiler, sin sobresaltos.
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Tu tiempo, para ti.
                  </p>
                  <Link to="/contacto?tipo=propietario&origen=gestion-alquileres">
                    <Button size="lg" className="text-lg px-8 py-6">
                      ¿Quieres vivir sin preocuparte por tu alquiler?
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <div>
                  <div className="relative">
                    <img 
                      src={peacefulHomeownerImage} 
                      alt="Propietario relajado disfrutando de su tiempo libre" 
                      className="w-full h-80 object-cover rounded-2xl shadow-lg"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/10 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GestionIntegral;