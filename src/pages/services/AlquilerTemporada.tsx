import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronRight, FileText, Key, Eye, MessageCircle, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import seasonalHeroImage from "@/assets/seasonal-rental-hero.jpg";
import interiorDetailImage from "@/assets/interior-detail.jpg";
import bizkaiaUrbanImage from "@/assets/bizkaia-urban.jpg";
import digitalContractImage from "@/assets/digital-contract.jpg";
import keysCheckinImage from "@/assets/keys-checkin.jpg";
import propertyInspectionImage from "@/assets/property-inspection.jpg";
import customerSupportImage from "@/assets/customer-support.jpg";
import transparentModelImage from "@/assets/transparent-model.jpg";
import cozyHomeImage from "@/assets/cozy-home-detail.jpg";

const AlquilerTemporada = () => {
  const services = [
    {
      id: "contratos",
      icon: FileText,
      title: "Contratos temporada",
      description: "Contratos específicos para estancias de 1 a 11 meses, adaptados a la normativa vigente.",
      image: digitalContractImage,
      alt: "Contratos digitales para alquiler de temporada"
    },
    {
      id: "entradas",
      icon: Key,
      title: "Entradas y salidas",
      description: "Gestionamos el check-in y check-out, coordinar llaves y realizar inventarios detallados.",
      image: keysCheckinImage,
      alt: "Gestión de entradas y salidas en alquiler temporal"
    },
    {
      id: "supervision",
      icon: Eye,
      title: "Supervisión inmueble",
      description: "Revisiones periódicas del estado del inmueble durante la estancia del inquilino.",
      image: propertyInspectionImage,
      alt: "Supervisión y mantenimiento de la propiedad"
    },
    {
      id: "atencion",
      icon: MessageCircle,
      title: "Atención durante la estancia",
      description: "Soporte continuo tanto al propietario como al inquilino durante toda la estancia.",
      image: customerSupportImage,
      alt: "Atención al cliente durante el alquiler"
    },
    {
      id: "modelo",
      icon: BarChart3,
      title: "Modelo flexible y transparente",
      description: "Tarifas claras sin sorpresas, adaptadas a cada caso específico.",
      image: transparentModelImage,
      alt: "Modelo de precios transparente y flexible"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs 
        items={[
          { label: "Servicios", href: "/" },
          { label: "Alquiler de Temporada" }
        ]} 
      />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={seasonalHeroImage} 
              alt="Alquiler de temporada en Bizkaia con Liventy Gestión" 
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/90"></div>
          </div>
          <div className="relative z-10 container mx-auto px-6 text-center text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              🕐 Alquiler de temporada
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-2xl mx-auto opacity-95">
              Flexibilidad rentable. Sin complicaciones.
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
                    El alquiler de temporada (de 1 a 11 meses) es una modalidad cada vez más demandada en Bizkaia. Profesionales en traslado temporal, estudiantes, personas en procesos de separación o simplemente quienes buscan flexibilidad encuentran en esta fórmula la solución perfecta.
                  </p>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Como propietario, esta modalidad te ofrece mayor rentabilidad que el alquiler tradicional, pero requiere una gestión más especializada. En Liventy Gestión nos encargamos de todo el proceso para que tú solo te preocupes de los ingresos.
                  </p>
                </div>
                <div className="order-1 lg:order-2">
                  <div className="relative">
                    <img 
                      src={interiorDetailImage} 
                      alt="Detalle interior de vivienda para alquiler temporal" 
                      className="w-full h-80 object-cover rounded-2xl shadow-lg"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contexto */}
        <section className="py-16 sm:py-20 relative">
          <div className="absolute inset-0 z-0">
            <img 
              src={bizkaiaUrbanImage} 
              alt="Vista urbana de Bizkaia para contexto geográfico" 
              className="w-full h-full object-cover opacity-10"
              loading="lazy"
            />
          </div>
          <div className="relative z-10 container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Especialistas en estancias de 1 a 11 meses
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                En zonas como Indautxu, Abando, Deusto, Barakaldo y Getxo, donde la demanda de alquiler temporal es especialmente alta, nuestro conocimiento local marca la diferencia.
              </p>
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section className="py-16 sm:py-20 bg-muted/50">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Te aportamos
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {services.map((service) => (
                  <Card key={service.id} className="h-fit hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="aspect-[3/2] overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
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

        {/* Nota Legal */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-muted/30 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4">
                  Información importante
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  El alquiler de temporada está regulado por normativas específicas que varían según el municipio. Nuestro equipo se mantiene actualizado sobre todos los requisitos legales en Bizkaia.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Ofrecemos asesoramiento básico sobre aspectos legales y fiscales, derivando a especialistas en casos que requieren consulta específica.
                </p>
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
                  <Link to="/contacto?tipo=propietario&origen=alquiler-temporada">
                    <Button size="lg" className="text-lg px-8 py-6">
                      ¿Te gustaría alquilar por meses sin perder tiempo ni tranquilidad?
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <div>
                  <div className="relative">
                    <img 
                      src={cozyHomeImage} 
                      alt="Tu alquiler sin sobresaltos, tu tiempo para ti" 
                      className="w-full h-80 object-cover rounded-2xl shadow-lg"
                      loading="lazy"
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

export default AlquilerTemporada;