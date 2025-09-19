import { useState } from "react";
import { ArrowRight, BarChart3, Camera, CheckCircle, FileText, Calendar, MessageCircle, Monitor, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroImage from "@/assets/long-term-rental-hero.jpg";
import interiorDetail from "@/assets/interior-detail.jpg";
import dataAnalytics from "@/assets/data-analytics.jpg";
import professionalService from "@/assets/professional-service.jpg";
import clientTestimonial from "@/assets/client-testimonial.jpg";
import digitalContract from "@/assets/digital-contract.jpg";
import digitalManagement from "@/assets/digital-management.jpg";
import customerSupport from "@/assets/customer-support.jpg";
import transparentModel from "@/assets/transparent-model.jpg";
import handymanProfessional from "@/assets/handyman-professional.jpg";

const AlquilerLargaDuracion = () => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const services = [
    {
      id: "renta-adecuada",
      icon: BarChart3,
      title: "Renta adecuada según mercado",
      description: "Asesoramiento para fijar la renta adecuada según mercado y perfil del inmueble.",
      image: dataAnalytics,
      alt: "Asesoramiento de renta"
    },
    {
      id: "publicacion-optimizada",
      icon: Camera,
      title: "Publicación optimizada + foto profesional",
      description: "Publicación con visibilidad optimizada y fotografía profesional.",
      image: professionalService,
      alt: "Fotografía profesional"
    },
    {
      id: "seleccion-inquilinos",
      icon: CheckCircle,
      title: "Selección fiable de inquilinos",
      description: "Selección de inquilinos fiables, con análisis de solvencia y referencias.",
      image: clientTestimonial,
      alt: "Análisis de solvencia"
    },
    {
      id: "contrato-legal",
      icon: FileText,
      title: "Contrato conforme a ley",
      description: "Contrato adaptado a la legislación autonómica y estatal.",
      image: digitalContract,
      alt: "Contrato y firma digital"
    },
    {
      id: "renovaciones",
      icon: Calendar,
      title: "Renovaciones y prórrogas",
      description: "Gestión de renovaciones, actualizaciones y prórrogas.",
      image: digitalManagement,
      alt: "Renovaciones"
    },
    {
      id: "atencion-inquilino",
      icon: MessageCircle,
      title: "Atención al inquilino",
      description: "Atención al inquilino para que no te llamen a ti.",
      image: customerSupport,
      alt: "Atención al inquilino"
    },
    {
      id: "area-privada",
      icon: Monitor,
      title: "Área privada y seguimiento",
      description: "Área privada para seguir en tiempo real todo lo que ocurre.",
      image: transparentModel,
      alt: "Área privada y seguimiento"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative z-20 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              📅 Alquiler de larga duración
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-light">
              Estabilidad con garantías. Y sin esfuerzo.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                El alquiler tradicional sigue siendo una de las fórmulas más seguras y estables para obtener rentabilidad a largo plazo. Pero elegir al inquilino equivocado o no estar al día legalmente puede convertir esa estabilidad en una fuente constante de problemas.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                En Liventy Gestión te acompañamos en todo el proceso, desde la publicación hasta el final del contrato, con foco en la protección jurídica, la previsión y la eficiencia.
              </p>
            </div>
            <div className="relative">
              <img
                src={interiorDetail}
                alt="Detalle interior de vivienda moderna"
                className="rounded-lg shadow-lg w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Con nosotros tendrás:</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <Collapsible 
                  open={openItems[service.id]} 
                  onOpenChange={() => toggleItem(service.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-secondary/20 transition-colors rounded-t-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <service.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                        <img
                          src={service.image}
                          alt={service.alt}
                          className="w-16 h-16 object-cover rounded-lg shadow-sm"
                          loading="lazy"
                        />
                      </div>
                      <CardTitle className="text-xl font-semibold text-left">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <CardDescription className="text-base leading-relaxed">
                        {service.description}
                      </CardDescription>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Incidents Management Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Si surge algo</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                ¿Y si surge una incidencia? La resolvemos. ¿Una duda legal? La aclaramos.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Tú solo ves resultados, nosotros lo gestionamos todo.
              </p>
            </div>
            <div className="relative">
              <img
                src={handymanProfessional}
                alt="Gestión de incidencias"
                className="rounded-lg shadow-lg w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              👉 Porque alquilar debe dar tranquilidad, no trabajo.
            </h2>
            <Button 
              size="lg" 
              className="group text-lg px-8 py-4"
              onClick={() => window.location.href = '/contacto?tipo=propietario&origen=alquiler-larga-duracion'}
            >
              Empezar ahora
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AlquilerLargaDuracion;