import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Camera, Users, FileText, Wrench, Monitor, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import rentalHeroImage from "@/assets/rental-management-hero.jpg";
import propertyProfessionalImage from "@/assets/property-management-professional.jpg";
import peacefulHomeownerImage from "@/assets/peaceful-homeowner.jpg";
import cozyHomeImage from "@/assets/cozy-home-detail.jpg";
import interiorDetailImage from "@/assets/interior-detail.jpg";
import modernLivingroomImage from "@/assets/modern-bright-livingroom.jpg";

const GestionIntegral = () => {
  // Carousel state and configuration
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'start',
      slidesToScroll: 1
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

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
            <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/60 to-primary/70"></div>
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
                  <p className="text-lg leading-relaxed text-muted-foreground mb-6 text-justify">
                    Gestionar un piso en alquiler puede ser una carga silenciosa. Lo que comienza como una inversión, muchas veces acaba convirtiéndose en una fuente constante de estrés: llamadas de madrugada, reparaciones urgentes, retrasos en los pagos, papeleo sin fin. En Liventy Gestión hemos creado un modelo pensado para devolverte la tranquilidad.
                  </p>
                  <p className="text-lg leading-relaxed text-muted-foreground text-justify">
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

        {/* Servicios - Estilo Carrusel */}
        <section className="py-16 sm:py-20 relative overflow-hidden">
          {/* Collage de imágenes de fondo */}
          <div className="absolute inset-0 z-0 grid grid-cols-3">
            <div className="relative w-full h-full">
              <img src={cozyHomeImage} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative w-full h-full">
              <img src={interiorDetailImage} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative w-full h-full">
              <img src={modernLivingroomImage} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          
          {/* Overlay oscuro */}
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 to-black/70"></div>
          
          {/* Contenido del carrusel */}
          <div className="container mx-auto px-4 sm:px-6 relative z-20">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                ¿Qué hacemos por ti?
              </h2>
            </div>

            {/* Carrusel con Embla */}
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

              {/* Botones de navegación */}
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

              {/* Dots de navegación */}
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
                  <Link to="/empezar-ahora">
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