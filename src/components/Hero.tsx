import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, FileText, Wrench, BarChart3, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import bilbaoImage from "@/assets/bilbao-guggenheim-hero.jpg";

const Hero = () => {
  const handleCTAClick = (location: string, label: string, dest: string) => {
    // GA4 tracking
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'cta_click', {
        location,
        label,
        dest
      });
    }
    
    // Handle navigation
    if (dest.startsWith('#')) {
      const element = document.querySelector(dest);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      window.location.href = dest;
    }
  };

  const benefits = [
    {
      icon: Shield,
      text: "Selección rigurosa de inquilinos"
    },
    {
      icon: FileText,
      text: "Contrato y trámites"
    },
    {
      icon: Wrench,
      text: "Incidencias y mantenimiento"
    },
    {
      icon: BarChart3,
      text: "Reportes claros"
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center bg-brand-white overflow-hidden section-spacing">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Title and Subtitle - Above everything */}
        <div className="text-center space-y-6 mb-16 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-montserrat font-bold text-brand-charcoal leading-heading tracking-heading">
            Gestión integral de alquileres en <span className="text-brand-orange">Bizkaia</span>.
          </h1>
          
          <p className="text-xl sm:text-2xl lg:text-3xl font-lato font-normal text-neutral-500 leading-relaxed">
            Tu vivienda, más rentable y sin preocupaciones.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          
          {/* Left Column - Content (40% width) */}
          <div className="space-y-8 lg:pr-8 lg:col-span-2">
            {/* Benefits List - 2x2 Grid Layout */}
            <div className="grid grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center text-center p-6 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-all duration-200 cursor-pointer group"
                  aria-label={`Servicio: ${benefit.text}`}
                  role="button"
                  tabIndex={0}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-orange/10 rounded-xl mb-4 group-hover:bg-brand-orange/20 transition-all duration-200">
                    <benefit.icon className="h-6 w-6 text-brand-orange group-hover:scale-110 transition-all duration-200" />
                  </div>
                  <span className="font-lato text-base font-semibold text-brand-charcoal leading-tight">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* CTAs - Larger and more prominent */}
            <div className="flex flex-col gap-4 items-stretch max-w-md">
              <Button 
                size="lg" 
                className="bg-brand-orange hover:bg-brand-orange/90 text-brand-white font-lato font-bold px-8 py-4 text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 w-full"
                onClick={() => handleCTAClick('home_hero', 'empezar_ahora', '/empezar-ahora')}
                role="button"
                aria-label="Empezar ahora – ir al formulario de contacto"
              >
                Empezar ahora
                <ArrowRight className="ml-3 h-5 w-5" aria-hidden="true" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-brand-white font-lato font-bold px-8 py-4 text-base rounded-xl transition-all duration-200 hover:shadow-lg w-full"
                onClick={() => handleCTAClick('home_hero', 'valora_gratis', '/herramientas?calc=precio')}
                aria-label="Valorar gratis mi piso – calculadora de precio recomendado"
                role="button"
              >
                Valora gratis mi piso
              </Button>
            </div>

            {/* Badge - Moved below CTAs */}
            <div className="flex justify-start">
              <Badge className="bg-brand-orange/10 text-brand-orange border-brand-orange/20 px-4 py-2 text-sm font-lato font-semibold rounded-full">
                <MapPin className="w-4 h-4 mr-2" />
                Empresa local en Bizkaia
              </Badge>
            </div>

            {/* Discrete line */}
            <p className="font-lato text-sm text-neutral-400 max-w-lg">
              También ofrecemos alquiler por meses y colaboración con empresas, si lo necesitas.
            </p>
          </div>

          {/* Right Column - Image (60% width) */}
          <div className="relative lg:order-last order-first lg:col-span-3">
            <div className="relative rounded-2xl overflow-hidden shadow-md">
              <img 
                src={bilbaoImage} 
                alt="Gestión de alquiler en Bilbao: Museo Guggenheim y ría al atardecer" 
                className="w-full h-[400px] lg:h-[600px] object-cover object-left-center"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                style={{ 
                  clipPath: 'ellipse(100% 95% at 50% 50%)'
                }}
              />
              <div 
                className="absolute inset-0 rounded-2xl" 
                style={{
                  background: 'linear-gradient(90deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.15) 45%, rgba(0,0,0,0) 70%)'
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;