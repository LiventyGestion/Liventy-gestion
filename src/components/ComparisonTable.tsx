import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGA4Tracking } from "@/hooks/useGA4Tracking";

const ComparisonTable = () => {
  const navigate = useNavigate();
  const { trackValoraTuPiso } = useGA4Tracking();

  const handleValoraCTA = () => {
    trackValoraTuPiso('comparison_table', '/recursos#calculadora-precio');
    navigate('/recursos#calculadora-precio');
  };

  const rows = [
    { feature: "Difusión", solo: "Limitada", liventy: "Multicanal" },
    { feature: "Papeleo", solo: "A tu cargo", liventy: "Nos encargamos" },
    { feature: "Tiempo", solo: "Horas/semana", liventy: "Delegado" },
    { feature: "Selección de inquilinos", solo: "Sin scoring", liventy: "Verificación y scoring" },
    { feature: "Firma", solo: "Presencial", liventy: "Digital" },
    { feature: "Atención incidencias", solo: "Reactiva", liventy: "Ágil y trazada" }
  ];

  return (
    <section className="py-16 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Comparativa: Tú solo vs. Liventy
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Descubre las ventajas de profesionalizar la gestión de tu alquiler
          </p>
        </div>

        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full border-collapse" role="table" aria-label="Comparativa de gestión de alquiler">
            <thead>
              <tr>
                <th className="text-left p-4 bg-gray-100 font-semibold text-foreground rounded-tl-lg" scope="col">
                  Aspecto
                </th>
                <th className="text-center p-4 bg-gray-100 font-semibold text-foreground" scope="col">
                  Tú solo
                </th>
                <th className="text-center p-4 bg-primary/10 font-semibold text-primary rounded-tr-lg" scope="col">
                  Con Liventy
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr 
                  key={row.feature} 
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="p-4 font-medium text-foreground border-b border-gray-200">
                    {row.feature}
                  </td>
                  <td className="p-4 text-center border-b border-gray-200">
                    <div className="flex items-center justify-center gap-2">
                      <X className="h-4 w-4 text-destructive flex-shrink-0" aria-hidden="true" />
                      <span className="text-muted-foreground text-sm">{row.solo}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center bg-primary/5 border-b border-primary/10">
                    <div className="flex items-center justify-center gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
                      <span className="text-foreground font-medium text-sm">{row.liventy}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Desktop CTA */}
        <div className="text-center mt-10 hidden sm:block">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={handleValoraCTA}
          >
            Valora tu piso gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg sm:hidden z-50">
        <Button 
          size="lg" 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg"
          onClick={handleValoraCTA}
        >
          Valora tu piso gratis
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};

export default ComparisonTable;
