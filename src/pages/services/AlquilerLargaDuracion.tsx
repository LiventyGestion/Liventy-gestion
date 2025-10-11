import { useState, useCallback, useEffect, useRef } from "react";
import { ArrowRight, BarChart3, Camera, CheckCircle, FileText, Calendar, MessageCircle, Monitor, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import heroImage from "@/assets/long-term-rental-hero.jpg";
import interiorDetail from "@/assets/interior-detail.jpg";
import peacefulOwnerLifestyle from "@/assets/peaceful-owner-lifestyle.jpg";
import cozyHomeImage from "@/assets/cozy-home-detail.jpg";
import modernLivingroomImage from "@/assets/modern-bright-livingroom.jpg";
import propertyInspectionImage from "@/assets/property-inspection.jpg";

const AlquilerLargaDuracion = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);
  
  const autoplay = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: 'start',
      slidesToScroll: 1,
    },
    [autoplay.current]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const services = [
    {
      id: "renta-adecuada",
      icon: BarChart3,
      title: "Renta adecuada según mercado",
      description: "Asesoramiento para fijar la renta adecuada según mercado y perfil del inmueble."
    },
    {
      id: "publicacion-optimizada",
      icon: Camera,
      title: "Publicación optimizada + foto profesional",
      description: "Publicación con visibilidad optimizada y fotografía profesional."
    },
    {
      id: "seleccion-inquilinos",
      icon: CheckCircle,
      title: "Selección fiable de inquilinos",
      description: "Selección de inquilinos fiables, con análisis de solvencia y referencias."
    },
    {
      id: "contrato-legal",
      icon: FileText,
      title: "Contrato conforme a ley",
      description: "Contrato adaptado a la legislación autonómica y estatal."
    },
    {
      id: "renovaciones",
      icon: Calendar,
      title: "Renovaciones y prórrogas",
      description: "Gestión de renovaciones, actualizaciones y prórrogas."
    },
    {
      id: "atencion-inquilino",
      icon: MessageCircle,
      title: "Atención al inquilino",
      description: "Atención al inquilino para que no te llamen a ti."
    },
    {
      id: "area-privada",
      icon: Monitor,
      title: "Área privada y seguimiento",
      description: "Área privada para seguir en tiempo real todo lo que ocurre."
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
              Alquiler de larga duración
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

      {/* Services Section - Carousel Style */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        {/* Background image collage */}
        <div className="absolute inset-0 z-0 grid grid-cols-3 gap-[2px]">
          <div className="relative w-full h-full bg-white">
            <img src={cozyHomeImage} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative w-full h-full bg-white">
            <img src={modernLivingroomImage} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative w-full h-full bg-white">
            <img src={propertyInspectionImage} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
        
        {/* Dark overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 to-black/70"></div>
        
        {/* Carousel content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-20">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              Con nosotros tendrás:
            </h2>
          </div>

          {/* Carousel with Embla */}
          <div className="relative max-w-7xl mx-auto">
            <div className="overflow-hidden px-4" ref={emblaRef}>
              <div className="flex gap-4 sm:gap-6">
                {services.map((service) => (
                  <div 
                    key={service.id} 
                    className="flex-none w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] min-w-0"
                  >
                    <Card className="h-full hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 bg-white border-0 shadow-lg">
                      <CardContent className="p-6 h-full flex flex-col">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="flex-shrink-0">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl">
                              <service.icon className="h-7 w-7 text-primary" aria-hidden="true" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1 flex flex-col">
                            <h3 className="font-semibold text-lg mb-3 leading-tight text-foreground">
                              {service.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed flex-1">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute -left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-0 shadow-lg z-10 w-12 h-12 rounded-full"
              onClick={scrollPrev}
              disabled={prevBtnDisabled}
              aria-label="Servicio anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute -right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-0 shadow-lg z-10 w-12 h-12 rounded-full"
              onClick={scrollNext}
              disabled={nextBtnDisabled}
              aria-label="Siguiente servicio"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Navigation dots */}
            <div className="flex justify-center mt-8 gap-2">
              {services.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === selectedIndex
                      ? 'bg-white scale-125'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  onClick={() => scrollTo(index)}
                  aria-label={`Ir a servicio ${index + 1}`}
                />
              ))}
            </div>
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
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Tú solo ves resultados, nosotros lo gestionamos todo.
              </p>
              <Button 
                size="lg" 
                className="group text-lg px-8 py-4"
                onClick={() => window.location.href = '/contacto?tipo=propietario&origen=alquiler-larga-duracion'}
              >
                Empezar ahora
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="relative">
              <img
                src={peacefulOwnerLifestyle}
                alt="Propietario relajado disfrutando tranquilidad mientras Liventy gestiona su alquiler"
                className="rounded-lg shadow-lg w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AlquilerLargaDuracion;