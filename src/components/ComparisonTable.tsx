import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ComparisonTable = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const observer = new IntersectionObserver(
      ([entry]) => setIsFooterVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const footer = document.querySelector('footer');
    if (footer) observer.observe(footer);

    return () => {
      window.removeEventListener('resize', checkMobile);
      observer.disconnect();
    };
  }, []);

  const handleCTAClick = () => {
    // GA4 tracking
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'cta_click', {
        cta_id: 'cta_sticky_comparativa',
        page: location.pathname
      });
    }
    
    // Navigate to valuation page
    window.location.href = '/herramientas?calc=precio';
  };

  const comparisonData = [
    {
      label: "Difusión",
      soloYou: { text: "Limitada", status: false },
      liventy: { text: "Multicanal", status: true }
    },
    {
      label: "Papeleo",
      soloYou: { text: "A tu cargo", status: false },
      liventy: { text: "Nos encargamos", status: true }
    },
    {
      label: "Tiempo",
      soloYou: { text: "Horas/semana", status: false },
      liventy: { text: "Delegado", status: true }
    },
    {
      label: "Selección de inquilinos",
      soloYou: { text: "Sin scoring", status: false },
      liventy: { text: "Verificación y scoring", status: true }
    },
    {
      label: "Firma",
      soloYou: { text: "Presencial", status: false },
      liventy: { text: "Digital", status: true }
    },
    {
      label: "Atención incidencias",
      soloYou: { text: "Reactiva", status: false },
      liventy: { text: "Ágil y trazada", status: true }
    }
  ];

  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Comparativa
          </h2>
          <p className="text-sm text-muted-foreground">
            Tú solo vs. Liventy
          </p>
        </div>

        {/* Table */}
        <div className="max-w-4xl mx-auto">
          <Table className="w-full">
            <TableCaption className="sr-only">
              Comparativa entre gestionar tu propiedad tú solo versus con Liventy
            </TableCaption>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead 
                  scope="col"
                  className="text-left font-semibold text-foreground w-2/5"
                >
                  Aspecto
                </TableHead>
                <TableHead 
                  scope="col"
                  className="text-center font-semibold text-foreground w-1/4"
                >
                  Tú solo
                </TableHead>
                <TableHead 
                  scope="col"
                  className="text-center font-semibold text-foreground w-1/4"
                >
                  Liventy
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonData.map((row, index) => (
                <TableRow 
                  key={index}
                  className={`border-b border-border hover:bg-muted/30 transition-colors ${
                    index % 2 === 1 ? 'bg-muted/20' : 'bg-background'
                  }`}
                >
                  <TableHead 
                    scope="row"
                    className="text-left font-medium text-foreground py-6"
                    style={{ color: '#323232' }}
                  >
                    {row.label}
                  </TableHead>
                  <TableCell className="text-center py-6">
                    <div className="flex flex-col items-center gap-2">
                      <X 
                        className="h-5 w-5 text-destructive stroke-2" 
                        aria-label="No disponible"
                      />
                      <span className="text-sm text-muted-foreground">
                        <span className="sr-only">No: </span>
                        {row.soloYou.text}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-6">
                    <div className="flex flex-col items-center gap-2">
                      <Check 
                        className="h-5 w-5 text-green-600 stroke-2" 
                        aria-label="Disponible"
                      />
                      <span className="text-sm text-foreground font-medium">
                        <span className="sr-only">Sí: </span>
                        {row.liventy.text}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Sticky CTA for mobile */}
      {isMobile && (
        <div 
          className={`fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border shadow-lg transition-transform duration-300 ${
            isFooterVisible ? 'translate-y-full' : 'translate-y-0'
          }`}
          style={{ 
            paddingBottom: `calc(16px + env(safe-area-inset-bottom, 0px))`
          }}
        >
          <div className="p-4">
            <Button
              onClick={handleCTAClick}
              className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200"
              data-analytics="cta_sticky_comparativa"
              aria-label="Valora tu piso gratis - ir a calculadora de valoración"
            >
              Valora tu piso gratis
            </Button>
          </div>
        </div>
      )}
      
      {/* Add bottom padding when sticky CTA is visible */}
      {isMobile && !isFooterVisible && (
        <div className="h-20" aria-hidden="true" />
      )}
    </section>
  );
};

export default ComparisonTable;