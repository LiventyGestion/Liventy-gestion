import { TrendingUp, TrendingDown, Euro, Heart, Award, AlertTriangle, Wrench, PhoneOff, ArrowDown, Zap, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import dataAnalytics from "@/assets/data-analytics.jpg";
import worriedWoman from "@/assets/worried-woman.jpg";
import relaxedMan from "@/assets/relaxed-man-park.jpg";
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
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0c0c0c 0%, #121212 50%, #1a1a1a 100%)' }}>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Impact phrase */}
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 bg-primary/10 rounded-full mb-6">
              <p className="text-sm font-medium text-primary">
                ✨ Comprometidos con la rentabilidad y tranquilidad de nuestros clientes
              </p>
            </div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 text-white">
              Resultados que Hablan por Sí Solos
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Nuestros datos y la experiencia de nuestros clientes demuestran el impacto real de trabajar con Liventy
            </p>
          </div>

          <section id="before-after" className="mb-16" aria-label="Con Liventy, tranquilidad total">
            <div className="before-after-container">
              {/* Bloque único - Hombre relajado con texto flotante */}
              <article className="before-after-block">
                <div className="before-after-image-bg">
                  <img 
                    src={relaxedMan} 
                    alt="Hombre tranquilo y sonriente que representa la tranquilidad con Liventy" 
                    loading="lazy" 
                  />
                </div>
                <div className="before-after-card-floating after">
                  <div className="content-wrapper">
                    <h4 className="modern-title">Con Liventy, tranquilidad total</h4>
                    <p className="subtitle">Tu inversión en las mejores manos</p>
                    <ul className="bullets modern-bullets">
                      <li className="bullet-item success">
                        <Shield className="bullet-icon accent" strokeWidth={2} aria-label="Ocupación garantizada" />
                        <div className="bullet-content">
                          <span className="bullet-text">Ocupación garantizada</span>
                          <span className="bullet-detail">Contratos seguros y estables</span>
                        </div>
                      </li>
                      <li className="bullet-item success">
                        <TrendingUp className="bullet-icon accent" strokeWidth={2} aria-label="Más rentabilidad" />
                        <div className="bullet-content">
                          <span className="bullet-text">Más rentabilidad</span>
                          <span className="bullet-detail">Hasta +15% de ingresos</span>
                        </div>
                      </li>
                      <li className="bullet-item success">
                        <Zap className="bullet-icon accent" strokeWidth={2} aria-label="Gestión completa" />
                        <div className="bullet-content">
                          <span className="bullet-text">Nosotros nos encargamos de todo</span>
                          <span className="bullet-detail">Gestión 100% profesional</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </article>
            </div>
          </section>

          {/* 5 Métricas adicionales como bonus */}
          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{propertiesCount}+</div>
                <p className="text-sm text-gray-300">Propiedades Gestionadas</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{clientsCount}+</div>
                <p className="text-sm text-gray-300">Propietarios Tranquilos</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">€{revenueCount / 10}M+</div>
                <p className="text-sm text-gray-300">Generados para Propietarios</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">5⭐</div>
                <p className="text-sm text-gray-300">Valoración Media</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">48h</div>
                <p className="text-sm text-gray-300">Tiempo Medio de Respuesta</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default Stats;