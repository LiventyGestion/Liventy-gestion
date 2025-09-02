import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import professionalService from "@/assets/professional-service.jpg";

const FinalCTA = () => {
  const handleCTAClick = () => {
    // GA4 tracking
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'cta_click', {
        location: 'home_band',
        label: 'gestionar_alquiler',
        dest: '#contacto'
      });
    }
    
    // Smooth scroll to contact form
    const element = document.querySelector('#contacto');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={professionalService} 
          alt="" 
          className="w-full h-full object-cover opacity-10"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Confía tu alquiler a profesionales.
          </h2>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-8">
            Empieza ahora.
          </h3>
          <p className="text-lg sm:text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Únete a cientos de propietarios que ya disfrutan de una gestión sin complicaciones 
            y una rentabilidad optimizada.
          </p>
          
          <Button 
            size="lg" 
            variant="secondary"
            className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 min-h-[44px]"
            onClick={handleCTAClick}
            aria-label="Quiero gestionar mi alquiler"
          >
            Quiero gestionar mi alquiler
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;