import { TrendingUp, TrendingDown, Home, Users, Star, Euro, Clock, Award, Heart, Frown, Smile, Info, AlertTriangle, Wrench, PhoneOff } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import dataAnalytics from "@/assets/data-analytics.jpg";

// Optimized custom hook for animated counter
const useAnimatedCounter = (end: number, duration: number = 1500, isVisible: boolean = false) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!isVisible) return;
    
    let start = 0;
    const startTime = Date.now();
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(start + (end - start) * easeOutCubic));
      
      if (progress >= 1) {
        clearInterval(timer);
        setCount(end); // Ensure final value is exact
      }
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
    }, 200);
    
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
          className={`transition-all duration-1500 ease-out ${color}`}
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
          setTimeout(() => setIsVisible(true), 300);
        }
      },
      { threshold: 0.2, rootMargin: '50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Optimized animated counters with faster duration
  const occupancyRate = useAnimatedCounter(87, 1500, isVisible);
  const satisfactionRate = useAnimatedCounter(98, 1600, isVisible);
  const profitabilityRate = useAnimatedCounter(15, 1400, isVisible);
  const propertiesCount = useAnimatedCounter(500, 1800, isVisible);
  const clientsCount = useAnimatedCounter(1200, 1900, isVisible);
  const revenueCount = useAnimatedCounter(25, 1700, isVisible);

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
            loading="lazy"
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

    </div>
  );
};

export default Stats;