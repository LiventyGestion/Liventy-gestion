import { useState, useCallback, useEffect, useRef } from "react";
import { ArrowRight, BarChart3, Camera, CheckCircle, FileText, Calendar, MessageCircle, Monitor, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import heroImage from "@/assets/long-term-rental-hero.jpg";
import modernLivingRoomVertical from "@/assets/modern-living-room-vertical.jpg";
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

      {/* Nueva sección de dos columnas con diseño moderno */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-[#FAFAFA] to-[#F3F3F3]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Columna izquierda - Contenido de texto */}
            <div className="max-w-[600px] mx-auto lg:mx-0 animate-fade-up">
              
              {/* Título principal */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 font-raleway">
                Alquiler de larga duración
              </h2>
              
              {/* Subtítulo */}
              <p className="text-lg md:text-xl text-foreground mb-8 font-raleway font-normal">
                Estabilidad con garantías. Y sin esfuerzo.
              </p>
              
              {/* Párrafos principales */}
              <div className="space-y-6 mb-10">
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-justify">
                  El alquiler tradicional sigue siendo una de las fórmulas más seguras y estables para obtener rentabilidad a largo plazo. Pero elegir al inquilino equivocado o no estar al día legalmente puede convertir esa estabilidad en una fuente constante de problemas.
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-justify">
                  En Liventy Gestión te acompañamos en todo el proceso, desde la publicación hasta el final del contrato, con foco en la protección jurídica, la previsión y la eficiencia.
                </p>
              </div>
              
              {/* Lista de 3 beneficios clave con iconos */}
              <div className="space-y-5">
                {/* Beneficio 1 */}
                <div className="flex items-start gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-primary/5 hover:translate-x-1">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#FFF3E0] rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-1 font-raleway">
                      Gestión jurídica completa
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Contratos adaptados, renovaciones y total cumplimiento legal
                    </p>
                  </div>
                </div>
                
                {/* Beneficio 2 */}
                <div className="flex items-start gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-primary/5 hover:translate-x-1">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#FFF3E0] rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-1 font-raleway">
                      Selección rigurosa de inquilinos
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Análisis de solvencia, referencias y verificación completa
                    </p>
                  </div>
                </div>
                
                {/* Beneficio 3 */}
                <div className="flex items-start gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-primary/5 hover:translate-x-1">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#FFF3E0] rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-1 font-raleway">
                      Estabilidad y previsión a largo plazo
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Rentas ajustadas al mercado y gestión profesional continua
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Columna derecha - Imagen vertical */}
            <div className="relative lg:h-[700px] animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative h-full rounded-2xl overflow-hidden shadow-lg">
                {/* Overlay degradado suave desde la izquierda */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/20 to-transparent z-10 pointer-events-none"></div>
                
                {/* Imagen vertical */}
                <img
                  src={modernLivingRoomVertical}
                  alt="Salón moderno luminoso con luz natural y diseño minimalista"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Bloque de indicadores visuales */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            
            {/* Card 1: Ocupación garantizada */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-all duration-300 animate-fade-up">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#FFF3E0] rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="w-8 h-8 text-primary" />
                </div>
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2 font-raleway">87%</p>
                <p className="text-base font-semibold text-foreground mb-1 font-raleway">Ocupación garantizada</p>
                <p className="text-sm text-muted-foreground">Media anual de nuestros inmuebles</p>
              </div>
            </div>
            
            {/* Card 2: Rentabilidad media */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-all duration-300 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#FFF3E0] rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2 font-raleway">+15%</p>
                <p className="text-base font-semibold text-foreground mb-1 font-raleway">Rentabilidad media</p>
                <p className="text-sm text-muted-foreground">Retorno anual optimizado</p>
              </div>
            </div>
            
            {/* Card 3: Gestión profesional */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-all duration-300 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#FFF3E0] rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2 font-raleway">100%</p>
                <p className="text-base font-semibold text-foreground mb-1 font-raleway">Gestión profesional</p>
                <p className="text-sm text-muted-foreground">Sin preocupaciones para ti</p>
              </div>
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

      {/* CTA final */}
      <section className="py-12 bg-gradient-to-b from-white to-[#FAFAFA]">
        <div className="container mx-auto px-4 text-center">
          <Button 
            size="lg" 
            className="group text-lg px-10 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            onClick={() => window.location.href = '/empezar-ahora'}
          >
            Quiero alquilar sin preocupaciones
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AlquilerLargaDuracion;