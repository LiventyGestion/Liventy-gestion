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

          {/* Diagonal Comparison - Desktop */}
          <div className="mb-16 hidden md:block">
            <h3 className="text-3xl font-bold text-center mb-12 text-foreground">La Diferencia Liventy</h3>
            <div className="relative w-full aspect-square max-w-4xl mx-auto">
              {/* Top Left Diagonal - Antes de Liventy */}
              <div 
                className="absolute top-0 left-0 w-full h-full transition-all duration-200 hover:scale-[1.02] cursor-pointer group"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 0 100%)'
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={worriedWoman} 
                    alt="Mujer preocupada con manos en la cabeza representando problemas al alquilar por tu cuenta" 
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                  />
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-white bg-opacity-85 group-hover:bg-opacity-80 transition-opacity duration-200"></div>
                
                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-start items-start">
                  <div className="max-w-sm">
                    <div className="mb-6">
                      <AlertTriangle className="h-8 w-8 text-muted-foreground mb-4" strokeWidth={1.5} />
                      <h4 className="text-2xl font-semibold mb-2 text-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Problemas al alquilar por tu cuenta
                      </h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <ArrowDown className="h-5 w-5 text-muted-foreground flex-shrink-0" strokeWidth={1.75} aria-label="Bajas ocupaciones" />
                        <span className="text-sm text-muted-foreground" style={{ fontFamily: 'Lato, sans-serif' }}>
                          Bajas ocupaciones
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Euro className="h-5 w-5 text-muted-foreground flex-shrink-0" strokeWidth={1.75} aria-label="Sin ingresos" />
                        <span className="text-sm text-muted-foreground" style={{ fontFamily: 'Lato, sans-serif' }}>
                          Meses sin ingresos
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-5 w-5 text-muted-foreground flex-shrink-0" strokeWidth={1.75} aria-label="Estrés" />
                        <span className="text-sm text-muted-foreground" style={{ fontFamily: 'Lato, sans-serif' }}>
                          Estrés continuo
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Right Diagonal - Con Liventy */}
              <div 
                className="absolute bottom-0 right-0 w-full h-full transition-all duration-200 hover:scale-[1.02] cursor-pointer group"
                style={{
                  clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={relaxedMan} 
                    alt="Hombre relajado disfrutando de la tranquilidad gracias a Liventy" 
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                  />
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-white bg-opacity-85 group-hover:bg-opacity-80 transition-opacity duration-200"></div>
                
                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end items-end">
                  <div className="max-w-sm text-right">
                    <div className="mb-6">
                      <Heart className="h-8 w-8 text-primary mb-4 ml-auto" strokeWidth={1.5} />
                      <h4 className="text-2xl font-semibold mb-2 text-primary" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Con Liventy, tranquilidad total
                      </h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-end space-x-3">
                        <span className="text-sm text-muted-foreground" style={{ fontFamily: 'Lato, sans-serif' }}>
                          Ocupación garantizada
                        </span>
                        <Shield className="h-5 w-5 text-primary flex-shrink-0" strokeWidth={1.75} aria-label="Ocupación garantizada" />
                      </div>
                      <div className="flex items-center justify-end space-x-3">
                        <span className="text-sm text-muted-foreground" style={{ fontFamily: 'Lato, sans-serif' }}>
                          Más rentabilidad
                        </span>
                        <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" strokeWidth={1.75} aria-label="Más rentabilidad" />
                      </div>
                      <div className="flex items-center justify-end space-x-3">
                        <span className="text-sm text-muted-foreground" style={{ fontFamily: 'Lato, sans-serif' }}>
                          Nosotros nos encargamos de todo
                        </span>
                        <Zap className="h-5 w-5 text-primary flex-shrink-0" strokeWidth={1.75} aria-label="Gestión completa" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diagonal Border Line */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, transparent 49%, #E67E0F 49%, #E67E0F 51%, transparent 51%)'
                }}
              ></div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-8">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Quiero tranquilidad con Liventy
              </Button>
            </div>
          </div>

          {/* Mobile Stack Version */}
          <div className="mb-16 md:hidden">
            <h3 className="text-3xl font-bold text-center mb-8 text-foreground">La Diferencia Liventy</h3>
            
            {/* Antes de Liventy - Mobile */}
            <div className="mb-8">
              <div className="relative overflow-hidden rounded-lg">
                <div className="aspect-video">
                  <img 
                    src={worriedWoman} 
                    alt="Mujer preocupada con manos en la cabeza representando problemas al alquilar por tu cuenta" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="p-6 bg-card rounded-b-lg">
                <div className="mb-4">
                  <AlertTriangle className="h-6 w-6 text-muted-foreground mb-3" strokeWidth={1.5} />
                  <h4 className="text-xl font-semibold text-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Problemas al alquilar por tu cuenta
                  </h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <ArrowDown className="h-4 w-4 text-muted-foreground flex-shrink-0" strokeWidth={1.75} />
                    <span className="text-sm text-muted-foreground" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Bajas ocupaciones
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Euro className="h-4 w-4 text-muted-foreground flex-shrink-0" strokeWidth={1.75} />
                    <span className="text-sm text-muted-foreground" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Meses sin ingresos
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground flex-shrink-0" strokeWidth={1.75} />
                    <span className="text-sm text-muted-foreground" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Estrés continuo
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Con Liventy - Mobile */}
            <div className="mb-8">
              <div className="relative overflow-hidden rounded-lg">
                <div className="aspect-video">
                  <img 
                    src={relaxedMan} 
                    alt="Hombre relajado disfrutando de la tranquilidad gracias a Liventy" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="p-6 bg-card rounded-b-lg border-2 border-primary/20">
                <div className="mb-4">
                  <Heart className="h-6 w-6 text-primary mb-3" strokeWidth={1.5} />
                  <h4 className="text-xl font-semibold text-primary" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Con Liventy, tranquilidad total
                  </h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 text-primary flex-shrink-0" strokeWidth={1.75} />
                    <span className="text-sm text-muted-foreground" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Ocupación garantizada
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" strokeWidth={1.75} />
                    <span className="text-sm text-muted-foreground" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Más rentabilidad
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="h-4 w-4 text-primary flex-shrink-0" strokeWidth={1.75} />
                    <span className="text-sm text-muted-foreground" style={{ fontFamily: 'Lato, sans-serif' }}>
                      Nosotros nos encargamos de todo
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button - Mobile */}
            <div className="text-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 w-full"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Quiero tranquilidad con Liventy
              </Button>
            </div>
          </div>

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