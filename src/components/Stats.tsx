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

          {/* Antes vs Después */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12 text-foreground">La Diferencia Liventy</h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-400 to-gray-500"></div>
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mb-4 shadow-inner">
                      <Frown className="h-10 w-10 text-gray-600" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-700 mb-2">Antes de Liventy</h4>
                    <p className="text-gray-500 text-sm">La realidad del mercado tradicional</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-3 bg-white/60 rounded-lg">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">70% ocupación media</p>
                        <p className="text-sm text-gray-500">Periodos largos sin inquilinos</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-3 bg-white/60 rounded-lg">
                      <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Meses vacíos sin ingresos</p>
                        <p className="text-sm text-gray-500">Pérdidas económicas frecuentes</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-3 bg-white/60 rounded-lg">
                      <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Wrench className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Gestión propia estresante</p>
                        <p className="text-sm text-gray-500">Problemas constantes sin resolver</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-3 bg-white/60 rounded-lg">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <PhoneOff className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Sin soporte especializado</p>
                        <p className="text-sm text-gray-500">Resuelve todo por tu cuenta</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/15 border border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/80"></div>
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full mb-4 shadow-lg">
                      <Smile className="h-10 w-10 text-primary" />
                    </div>
                    <h4 className="text-2xl font-bold text-primary mb-2">Con Liventy</h4>
                    <p className="text-primary/70 text-sm">La tranquilidad que mereces</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-3 bg-white/80 rounded-lg shadow-sm">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">87% ocupación garantizada</p>
                        <p className="text-sm text-muted-foreground">Tu propiedad siempre rentable</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-3 bg-white/80 rounded-lg shadow-sm">
                      <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Euro className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">+15% más rentabilidad</p>
                        <p className="text-sm text-muted-foreground">Optimización garantizada</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-3 bg-white/80 rounded-lg shadow-sm">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Heart className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Tranquilidad total</p>
                        <p className="text-sm text-muted-foreground">Nosotros nos ocupamos de todo</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-3 bg-white/80 rounded-lg shadow-sm">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Award className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Soporte experto 24/7</p>
                        <p className="text-sm text-muted-foreground">Atención profesional siempre</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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

    </div>;
};
export default Stats;