import { CheckCircle, TrendingUp, Wrench, UserCheck, Monitor, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import videoPoster from "@/assets/video-poster.jpg";

const OwnerBenefits = () => {
  const benefits = [
    {
      icon: CheckCircle,
      title: "Sin gestiones ni dolores de cabeza",
      description: "Nos ocupamos de todo el proceso administrativo y legal"
    },
    {
      icon: TrendingUp,
      title: "Mayor rentabilidad con menos riesgo",
      description: "Optimizamos tus ingresos mientras minimizamos los riesgos"
    },
    {
      icon: Wrench,
      title: "Mantenimiento exprés",
      description: "Red de profesionales para resolver cualquier incidencia rápidamente"
    },
    {
      icon: UserCheck,
      title: "Selección de inquilinos filtrados",
      description: "Proceso riguroso de verificación de solvencia y referencias"
    },
    {
      icon: Monitor,
      title: "Seguimiento online 24/7",
      description: "Plataforma digital para controlar todo en tiempo real"
    },
    {
      icon: Eye,
      title: "Transparencia total",
      description: "Informes detallados y comunicación clara en cada paso del proceso"
    }
  ];

  const autoplayRef = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      align: 'start',
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 768px)': { slidesToScroll: 2 },
        '(min-width: 1024px)': { slidesToScroll: 3 }
      }
    },
    [autoplayRef.current]
  );

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
    // Analytics event
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'why_slide_change', {
        index: selectedIndex - 1,
        direction: 'prev'
      });
    }
  }, [emblaApi, selectedIndex]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
    // Analytics event
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'why_slide_change', {
        index: selectedIndex + 1,
        direction: 'next'
      });
    }
  }, [emblaApi, selectedIndex]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
    // Analytics event
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'why_slide_change', {
        index,
        direction: 'dot'
      });
    }
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Video intersection observer
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    
    if (!video || !section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Check for reduced motion preference
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          
          if (!prefersReducedMotion && video.paused) {
            video.play().catch(() => {
              // Video play failed, fallback to poster
            });
            
            // Analytics event
            if (typeof window !== 'undefined' && 'gtag' in window) {
              (window as any).gtag('event', 'why_video_loaded', {
                format: 'mp4',
                resolution: '1920x1080'
              });
            }
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-24 sm:py-32 relative overflow-hidden"
      role="region"
      aria-label="Ventajas de Liventy Gestión"
    >
      {/* Background Video */}
      <div className="why-bg-video absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          autoPlay
          muted
          loop
          preload="metadata"
          poster={"/videos/property-management-poster.jpg"}
          style={{ filter: 'brightness(0.7)' }}
        >
          <source src="/videos/property-management.mp4" type="video/mp4" />
          {/* Fallback for older browsers */}
        </video>
      </div>
      
      {/* Overlay */}
      <div className="why-overlay absolute inset-0 z-10 bg-gradient-to-b from-black/20 to-black/35"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 relative z-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            ¿Por qué los propietarios nos eligen?
          </h2>
          <p className="text-white/90 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
            Descubre las ventajas de confiar tu propiedad a Liventy Gestión
          </p>
        </div>

        {/* Carousel */}
        <div className="why-slider relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex-none w-full sm:w-1/2 lg:w-1/3 min-w-0"
                >
                  <Card className="h-full hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 bg-white border-0 shadow-lg">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors duration-200">
                            <benefit.icon 
                              className="h-7 w-7 text-primary transition-all duration-200 hover:text-[#E67E0F] hover:scale-110" 
                              aria-hidden="true" 
                            />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 flex flex-col">
                          <h3 className="font-semibold text-lg mb-3 leading-tight text-foreground">
                            {benefit.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed flex-1">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-0 shadow-lg z-10 w-12 h-12 rounded-full"
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            aria-label="Ventaja anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-0 shadow-lg z-10 w-12 h-12 rounded-full"
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            aria-label="Siguiente ventaja"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Dots Navigation */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: benefits.length }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === selectedIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                onClick={() => scrollTo(index)}
                aria-label={`Ir a ventaja ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OwnerBenefits;