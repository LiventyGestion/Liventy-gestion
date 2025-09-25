import { TrendingUp, TrendingDown, Euro, Heart, Award, AlertTriangle, Wrench, PhoneOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import dataAnalytics from "@/assets/data-analytics.jpg";
import emptyApartment from "@/assets/empty-apartment-worry.jpg";
import modernLivingroom from "@/assets/modern-bright-livingroom.jpg";

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

          {/* Antes vs Después */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12 text-foreground">La Diferencia Liventy</h3>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
              {/* Left Card - Neumorphic Style with Background */}
              <div 
                className="rounded-[30px] transition-all duration-200 hover:translate-y-[-2px] cursor-pointer relative overflow-hidden group"
                style={{
                  background: '#e0e0e0',
                  boxShadow: '15px 15px 30px #bebebe, -15px -15px 30px #ffffff'
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={emptyApartment} 
                    alt="Piso vacío con cajas" 
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                  />
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-white bg-opacity-85"></div>
                
                {/* Content */}
                <div className="relative z-10 p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{
                      background: '#e0e0e0',
                      boxShadow: 'inset 8px 8px 16px #bebebe, inset -8px -8px 16px #ffffff'
                    }}>
                      <AlertTriangle className="h-10 w-10 text-[#666666]" strokeWidth={1.5} />
                    </div>
                    <h4 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'Montserrat, sans-serif', color: '#323232' }}>
                      Antes de Liventy
                    </h4>
                    <p className="text-[#666666] text-sm" style={{ fontFamily: 'Lato, sans-serif' }}>
                      La realidad del mercado tradicional
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <TrendingDown className="h-6 w-6 text-[#666666] mt-1 flex-shrink-0" strokeWidth={1.5} aria-label="Tendencia negativa" />
                      <div>
                        <p className="font-medium text-[#323232]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          70% ocupación media
                        </p>
                        <p className="text-sm text-[#666666]" style={{ fontFamily: 'Lato, sans-serif' }}>
                          Periodos largos sin inquilinos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <AlertTriangle className="h-6 w-6 text-[#666666] mt-1 flex-shrink-0" strokeWidth={1.5} aria-label="Advertencia" />
                      <div>
                        <p className="font-medium text-[#323232]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Meses vacíos sin ingresos
                        </p>
                        <p className="text-sm text-[#666666]" style={{ fontFamily: 'Lato, sans-serif' }}>
                          Pérdidas económicas frecuentes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Wrench className="h-6 w-6 text-[#666666] mt-1 flex-shrink-0" strokeWidth={1.5} aria-label="Herramientas" />
                      <div>
                        <p className="font-medium text-[#323232]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Gestión propia estresante
                        </p>
                        <p className="text-sm text-[#666666]" style={{ fontFamily: 'Lato, sans-serif' }}>
                          Problemas constantes sin resolver
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <PhoneOff className="h-6 w-6 text-[#666666] mt-1 flex-shrink-0" strokeWidth={1.5} aria-label="Sin soporte" />
                      <div>
                        <p className="font-medium text-[#323232]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Sin soporte especializado
                        </p>
                        <p className="text-sm text-[#666666]" style={{ fontFamily: 'Lato, sans-serif' }}>
                          Resuelve todo por tu cuenta
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Card - Animated Border with Background */}
              <div 
                className="rounded-[30px] p-1 transition-all duration-200 hover:scale-[1.02] cursor-pointer relative animate-border-glow group overflow-hidden"
                style={{
                  background: 'linear-gradient(45deg, #E67E0F, #ff9500, #E67E0F, #ff9500)',
                  backgroundSize: '300% 300%',
                  animation: 'border-glow 4s ease-in-out infinite'
                }}
              >
                <div 
                  className="rounded-[26px] h-full relative overflow-hidden"
                  style={{
                    background: '#ffffff',
                    boxShadow: '0 8px 32px rgba(230, 126, 15, 0.15)'
                  }}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={modernLivingroom} 
                      alt="Salón moderno luminoso" 
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-white bg-opacity-85"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-7">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-[#E67E0F]/10 rounded-full mb-4 shadow-lg">
                        <Heart className="h-10 w-10 text-[#E67E0F]" strokeWidth={1.5} />
                      </div>
                      <h4 className="text-2xl font-semibold text-[#E67E0F] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Con Liventy
                      </h4>
                      <p className="text-[#E67E0F]/70 text-sm" style={{ fontFamily: 'Lato, sans-serif' }}>
                        La tranquilidad que mereces
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <TrendingUp className="h-6 w-6 text-[#E67E0F] mt-1 flex-shrink-0" strokeWidth={1.5} aria-label="Tendencia positiva" />
                        <div>
                          <p className="font-medium text-[#323232]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            87% ocupación garantizada
                          </p>
                          <p className="text-sm text-[#666666]" style={{ fontFamily: 'Lato, sans-serif' }}>
                            Tu propiedad siempre rentable
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <Euro className="h-6 w-6 text-[#E67E0F] mt-1 flex-shrink-0" strokeWidth={1.5} aria-label="Rentabilidad" />
                        <div>
                          <p className="font-medium text-[#323232]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            +15% más rentabilidad
                          </p>
                          <p className="text-sm text-[#666666]" style={{ fontFamily: 'Lato, sans-serif' }}>
                            Optimización garantizada
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <Heart className="h-6 w-6 text-[#E67E0F] mt-1 flex-shrink-0" strokeWidth={1.5} aria-label="Tranquilidad" />
                        <div>
                          <p className="font-medium text-[#323232]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Tranquilidad total
                          </p>
                          <p className="text-sm text-[#666666]" style={{ fontFamily: 'Lato, sans-serif' }}>
                            Nosotros nos ocupamos de todo
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <Award className="h-6 w-6 text-[#E67E0F] mt-1 flex-shrink-0" strokeWidth={1.5} aria-label="Soporte premium" />
                        <div>
                          <p className="font-medium text-[#323232]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Soporte experto 24/7
                          </p>
                          <p className="text-sm text-[#666666]" style={{ fontFamily: 'Lato, sans-serif' }}>
                            Atención profesional siempre
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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