import { TrendingUp, Home, Users, Star, Euro, Clock, Award, Heart, Frown, Smile, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import dataAnalytics from "@/assets/data-analytics.jpg";

// Custom hook for animated counter
const useAnimatedCounter = (end: number, duration: number = 2000, isVisible: boolean = false) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!isVisible) return;
    
    let start = 0;
    const startTime = Date.now();
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(start + (end - start) * easeOutQuart));
      
      if (progress >= 1) clearInterval(timer);
    }, 16);
    
    return () => clearInterval(timer);
  }, [end, duration, isVisible]);
  
  return count;
};

// Circular progress component with enhanced visuals
const CircularProgress = ({ percentage, size = 140, strokeWidth = 10, isVisible = false, color = "text-primary" }: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  isVisible?: boolean;
  color?: string;
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [percentage, isVisible]);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="opacity-10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-all duration-3000 ease-out ${color}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground">{animatedPercentage}%</span>
      </div>
    </div>
  );
};

// Tooltip component
const Tooltip = ({ content, children }: { content: string; children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-10">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

const Stats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showImpactPhrase, setShowImpactPhrase] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowImpactPhrase(true);
          setTimeout(() => setIsVisible(true), 800);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animated counters
  const occupancyRate = useAnimatedCounter(87, 2000, isVisible);
  const satisfactionRate = useAnimatedCounter(98, 2500, isVisible);
  const profitabilityRate = useAnimatedCounter(15, 2200, isVisible);
  const propertiesCount = useAnimatedCounter(500, 2800, isVisible);
  const clientsCount = useAnimatedCounter(1200, 3000, isVisible);
  const revenueCount = useAnimatedCounter(25, 2600, isVisible);

  return (
    <div className="bg-background">
      {/* Main Stats Section */}
      <section ref={sectionRef} className="py-20 bg-gradient-to-br from-orange-50 via-white to-orange-50 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={dataAnalytics} 
            alt="" 
            className="w-full h-full object-cover opacity-5"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/90 via-white/80 to-orange-50/90"></div>
        </div>
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 z-0">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Impact phrase */}
          <div className={`text-center mb-16 transition-all duration-1000 ${showImpactPhrase ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-block px-6 py-2 bg-primary/10 rounded-full mb-6">
              <p className="text-sm font-medium text-primary">
                ✨ Comprometidos con la rentabilidad y tranquilidad de nuestros clientes
              </p>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
              Resultados que Hablan por Sí Solos
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Nuestros números reflejan el compromiso con la excelencia y la satisfacción de nuestros clientes
            </p>
          </div>

          {/* 1-3-9 Structure */}
          
          {/* 1 KPI Estrella */}
          <div className={`flex justify-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '300ms' }}>
            <Card className="bg-white shadow-xl border-none p-12 text-center max-w-md hover:scale-105 transition-all duration-300">
              <CardContent className="p-0">
                <Tooltip content="Porcentaje de tiempo que nuestras propiedades están ocupadas vs. la media del mercado (70%)">
                  <div className="text-primary mb-6">
                    <CircularProgress 
                      percentage={occupancyRate} 
                      size={160} 
                      strokeWidth={12}
                      isVisible={isVisible} 
                      color="text-primary"
                    />
                  </div>
                </Tooltip>
                <h3 className="text-2xl font-bold text-foreground mb-2">Ocupación Media</h3>
                <p className="text-muted-foreground">Tu piso, siempre alquilado</p>
              </CardContent>
            </Card>
          </div>

          {/* 3 KPIs Secundarios */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className={`bg-white shadow-lg border-none hover:shadow-xl hover:scale-105 transition-all duration-300 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '600ms' }}>
              <CardContent className="p-8 text-center">
                <Tooltip content="Propietarios que renuevan contrato año tras año - la media del sector es del 70%">
                  <div className="text-green-600 mb-4">
                    <CircularProgress 
                      percentage={satisfactionRate} 
                      size={120} 
                      isVisible={isVisible} 
                      color="text-green-600"
                    />
                  </div>
                </Tooltip>
                <h3 className="text-xl font-bold text-foreground mb-1">Retención de Clientes</h3>
                <p className="text-muted-foreground text-sm">Cuando prueban, repiten</p>
              </CardContent>
            </Card>

            <Card className={`bg-white shadow-lg border-none hover:shadow-xl hover:scale-105 transition-all duration-300 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '800ms' }}>
              <CardContent className="p-8 text-center">
                <Tooltip content="Incremento medio de rentabilidad vs. gestión propia - calculado sobre ingresos netos anuales">
                  <div className="text-orange-600 mb-4">
                    <CircularProgress 
                      percentage={profitabilityRate} 
                      size={120} 
                      isVisible={isVisible} 
                      color="text-orange-600"
                    />
                  </div>
                </Tooltip>
                <h3 className="text-xl font-bold text-foreground mb-1">+15% de Rentabilidad</h3>
                <p className="text-muted-foreground text-sm">Optimizamos tus ingresos</p>
              </CardContent>
            </Card>

            <Card className={`bg-white shadow-lg border-none hover:shadow-xl hover:scale-105 transition-all duration-300 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '1000ms' }}>
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                  <Clock className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-2">24/7</h3>
                <h4 className="text-xl font-bold text-foreground mb-1">Soporte Real</h4>
                <p className="text-muted-foreground text-sm">Siempre disponibles, sin excusas</p>
              </CardContent>
            </Card>
          </div>

          {/* Antes vs Después */}
          <div className={`mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '1200ms' }}>
            <h3 className="text-3xl font-bold text-center mb-12 text-foreground">La Diferencia Liventy</h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="bg-gray-50 border-2 border-gray-200">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
                    <Frown className="h-8 w-8 text-gray-500" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-700 mb-4">Antes de Liventy</h4>
                  <div className="space-y-3 text-gray-600">
                    <p>📉 70% ocupación media</p>
                    <p>😰 Meses vacíos sin ingresos</p>
                    <p>🔧 Gestión propia estresante</p>
                    <p>📞 Sin soporte especializado</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                    <Smile className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-primary mb-4">Con Liventy</h4>
                  <div className="space-y-3 text-foreground">
                    <p>📈 87% ocupación garantizada</p>
                    <p>💰 +15% más rentabilidad</p>
                    <p>😌 Tranquilidad total</p>
                    <p>🚀 Soporte experto 24/7</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 5 Métricas adicionales como bonus */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '1400ms' }}>
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

      {/* ¿Por qué los propietarios nos eligen? */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl font-bold mb-4 text-foreground">¿Por qué los propietarios nos eligen?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Cuatro razones clave que nos convierten en tu mejor opción
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                percentage: 87,
                title: "87% de Ocupación Media",
                subtitle: "Tu piso, siempre alquilado",
                icon: Home,
                color: "text-blue-600",
                tooltip: "17 puntos por encima de la media del mercado"
              },
              {
                percentage: 98,
                title: "98% de Retención",
                subtitle: "Cuando prueban, repiten",
                icon: Heart,
                color: "text-red-500",
                tooltip: "Los propietarios que trabajan con nosotros no se van"
              },
              {
                percentage: 15,
                title: "+15% de Rentabilidad",
                subtitle: "Optimizamos tus ingresos",
                icon: TrendingUp,
                color: "text-green-600",
                tooltip: "Incremento medio vs. gestión propia"
              },
              {
                value: "24/7",
                title: "Soporte Real",
                subtitle: "Siempre disponibles, sin excusas",
                icon: Clock,
                color: "text-purple-600",
                tooltip: "Atención personalizada cuando la necesites"
              }
            ].map((item, index) => (
              <Card key={index} className={`bg-white shadow-lg border-none hover:shadow-xl hover:scale-105 transition-all duration-300 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: `${1600 + index * 200}ms` }}>
                <CardContent className="p-8 text-center">
                  <Tooltip content={item.tooltip}>
                    <div className="mb-6">
                      {item.percentage ? (
                        <CircularProgress 
                          percentage={item.percentage} 
                          size={100} 
                          strokeWidth={8}
                          isVisible={isVisible} 
                          color={item.color}
                        />
                      ) : (
                        <div className="relative">
                          <div className={`inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-4 ${item.color}`}>
                            <item.icon className="h-12 w-12" />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-foreground">{item.value}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Tooltip>
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Stats;