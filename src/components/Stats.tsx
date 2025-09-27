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

              {/* Top-right: Antes Copy */}
              <article className="before-after-card copy before">
                <h4 style={{ fontFamily: 'Montserrat, sans-serif' }}>Problemas al alquilar por tu cuenta</h4>
                <ul className="bullets">
                  <li>
                    <ArrowDown className="bullet-icon" strokeWidth={1.75} aria-label="Bajas ocupaciones" />
                    <span style={{ fontFamily: 'Lato, sans-serif' }}>Bajas ocupaciones</span>
                  </li>
                  <li>
                    <Euro className="bullet-icon" strokeWidth={1.75} aria-label="Sin ingresos" />
                    <span style={{ fontFamily: 'Lato, sans-serif' }}>Meses sin ingresos</span>
                  </li>
                  <li>
                    <AlertTriangle className="bullet-icon" strokeWidth={1.75} aria-label="Estrés" />
                    <span style={{ fontFamily: 'Lato, sans-serif' }}>Estrés continuo</span>
                  </li>
                </ul>
              </article>

              {/* Bottom-left: Con Liventy Copy */}
              <article className="before-after-card copy after">
                <h4 style={{ fontFamily: 'Montserrat, sans-serif' }}>Con Liventy, tranquilidad total</h4>
                <ul className="bullets">
                  <li>
                    <Shield className="bullet-icon accent" strokeWidth={1.75} aria-label="Ocupación garantizada" />
                    <span style={{ fontFamily: 'Lato, sans-serif' }}>Ocupación garantizada</span>
                  </li>
                  <li>
                    <TrendingUp className="bullet-icon accent" strokeWidth={1.75} aria-label="Más rentabilidad" />
                    <span style={{ fontFamily: 'Lato, sans-serif' }}>Más rentabilidad</span>
                  </li>
                  <li>
                    <Zap className="bullet-icon accent" strokeWidth={1.75} aria-label="Gestión completa" />
                    <span style={{ fontFamily: 'Lato, sans-serif' }}>Nosotros nos encargamos de todo</span>
                  </li>
                </ul>
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