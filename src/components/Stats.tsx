import { TrendingUp, TrendingDown, Euro, Heart, Award, Frown, Smile, AlertTriangle, Wrench, PhoneOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import dataAnalytics from "@/assets/data-analytics.jpg";

const Stats = () => {
  // Static values without animations
  const occupancyRate = 87;
  const satisfactionRate = 98;
  const profitabilityRate = 15;
  const propertiesCount = 500;
  const clientsCount = 1200;
  const revenueCount = 25;
  return <div className="bg-background">
      {/* Main Stats Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-orange-50 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src={dataAnalytics} alt="" className="w-full h-full object-cover opacity-5" aria-hidden="true" loading="lazy" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Impact phrase */}
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 bg-primary/10 rounded-full mb-6">
              <p className="text-sm font-medium text-primary">
                ✨ Comprometidos con la rentabilidad y tranquilidad de nuestros clientes
              </p>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
              Resultados que Hablan por Sí Solos
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nuestros datos y la experiencia de nuestros clientes demuestran el impacto real de trabajar con Liventy
            </p>
          </div>

          {/* Removed comparison section - now in ComparisonTable component */}

          {/* 5 Métricas adicionales como bonus */}
          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{propertiesCount}+</div>
                <p className="text-sm text-muted-foreground">Propiedades Gestionadas</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{clientsCount}+</div>
                <p className="text-sm text-muted-foreground">Propietarios Tranquilos</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">€{revenueCount / 10}M+</div>
                <p className="text-sm text-muted-foreground">Generados para Propietarios</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">5⭐</div>
                <p className="text-sm text-muted-foreground">Valoración Media</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">48h</div>
                <p className="text-sm text-muted-foreground">Tiempo Medio de Respuesta</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>;
};
export default Stats;