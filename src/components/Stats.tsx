import { TrendingUp, TrendingDown, Euro, Heart, Award, AlertTriangle, Wrench, PhoneOff, ArrowDown, Zap, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import dataAnalytics from "@/assets/data-analytics.jpg";
import worriedWoman from "@/assets/worried-woman.jpg";
import relaxedMan from "@/assets/relaxed-man.jpg";

const Stats = () => {
  // Static values without animations
  const occupancyRate = 87;
  const satisfactionRate = 98;
  const profitabilityRate = 15;
  const propertiesCount = 500;
  const clientsCount = 1200;
  const revenueCount = 25;
  
  return (
    <div className="bg-background">
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

          {/* Before After Section - 2x2 Grid */}
          <section id="before-after" className="mb-16" aria-label="Antes de Liventy frente a Con Liventy">
            <h3 className="text-3xl font-bold text-center mb-12 text-foreground">La Diferencia Liventy</h3>
            <div className="before-after-grid">
              {/* Top-left: Con Liventy Image */}
              <article className="before-after-card image after" aria-hidden="false">
                <img 
                  src={relaxedMan}
                  alt="Hombre tranquilo y sonriente que representa la tranquilidad con Liventy"
                  loading="lazy"
                />
              </article>

              {/* Top-right: Problems Copy */}
              <article className="before-after-card copy before">
                <div className="content-wrapper">
                  <h4 className="modern-title problems-title">Problemas al alquilar por tu cuenta</h4>
                  <p className="subtitle problems-subtitle">La realidad de gestionar solo</p>
                  <ul className="bullets modern-bullets">
                    <li className="bullet-item problem">
                      <ArrowDown className="bullet-icon problem-icon" strokeWidth={2} aria-label="Bajas ocupaciones" />
                      <div className="bullet-content">
                        <span className="bullet-text">Bajas ocupaciones</span>
                        <span className="bullet-detail">Periodos largos vacío</span>
                      </div>
                    </li>
                    <li className="bullet-item problem">
                      <Euro className="bullet-icon problem-icon" strokeWidth={2} aria-label="Sin ingresos" />
                      <div className="bullet-content">
                        <span className="bullet-text">Meses sin ingresos</span>
                        <span className="bullet-detail">Pérdidas económicas</span>
                      </div>
                    </li>
                    <li className="bullet-item problem">
                      <AlertTriangle className="bullet-icon problem-icon" strokeWidth={2} aria-label="Estrés" />
                      <div className="bullet-content">
                        <span className="bullet-text">Estrés continuo</span>
                        <span className="bullet-detail">Preocupación constante</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </article>

              {/* Bottom-left: Con Liventy Copy */}
              <article className="before-after-card copy after">
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
              </article>

              {/* Bottom-right: Antes Image */}
              <article className="before-after-card image before" aria-hidden="false">
                <img 
                  src={worriedWoman}
                  alt="Mujer preocupada con las manos en la cabeza, representa problemas al alquilar por tu cuenta"
                  loading="lazy"
                />
              </article>
            </div>
          </section>

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
    </div>
  );
};

export default Stats;