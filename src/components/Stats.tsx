import { TrendingUp, Home, Users, Star, Euro, Clock, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";

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

// Circular progress component
const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, isVisible = false }: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  isVisible?: boolean;
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 500);
    
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
          className="opacity-20"
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
          className="transition-all duration-2000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold">{animatedPercentage}%</span>
      </div>
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

  const propertiesCount = useAnimatedCounter(500, 2000, isVisible);
  const clientsCount = useAnimatedCounter(1200, 2500, isVisible);
  const revenueCount = useAnimatedCounter(25, 3000, isVisible);
  const renewalCount = useAnimatedCounter(98, 2000, isVisible);

  const stats = [
    {
      icon: Home,
      value: propertiesCount,
      suffix: "+",
      label: "Propiedades Gestionadas",
      description: "En cartera activa",
      color: "text-blue-300"
    },
    {
      icon: Users,
      value: clientsCount,
      suffix: "+",
      label: "Clientes Satisfechos",
      description: "Propietarios e inquilinos",
      color: "text-green-300"
    }
  ];

  const percentageStats = [
    {
      icon: TrendingUp,
      percentage: 87,
      label: "Ocupación Media",
      description: "Último año",
      color: "text-yellow-300"
    },
    {
      icon: Star,
      percentage: 15,
      label: "Rentabilidad Media",
      description: "Incremento anual",
      color: "text-orange-300"
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Impact phrase animation */}
        <div className={`text-center mb-16 transition-all duration-1000 ${showImpactPhrase ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-block px-6 py-2 bg-primary-foreground/10 rounded-full mb-6 backdrop-blur-sm">
            <p className="text-sm font-medium text-primary-foreground/90">
              ✨ Comprometidos con la rentabilidad y tranquilidad de nuestros clientes
            </p>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text">
            Resultados que Hablan por Sí Solos
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Nuestros números reflejan el compromiso con la excelencia y la satisfacción de nuestros clientes
          </p>
        </div>

        {/* Main stats grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Counter stats */}
          {stats.map((stat, index) => (
            <Card key={index} className={`group bg-primary-foreground/5 border-primary-foreground/20 backdrop-blur-sm hover:bg-primary-foreground/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: `${index * 200}ms` }}>
              <CardContent className="p-6 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-primary-foreground/10 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 ${stat.color}`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-4xl font-bold mb-2">
                  {stat.value.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-xl font-semibold mb-1">{stat.label}</div>
                <div className="text-primary-foreground/70 text-sm">{stat.description}</div>
              </CardContent>
            </Card>
          ))}

          {/* Percentage stats with circular progress */}
          {percentageStats.map((stat, index) => (
            <Card key={index + 2} className={`group bg-primary-foreground/5 border-primary-foreground/20 backdrop-blur-sm hover:bg-primary-foreground/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: `${(index + 2) * 200}ms` }}>
              <CardContent className="p-6 text-center">
                <div className={`mb-4 ${stat.color}`}>
                  <CircularProgress percentage={stat.percentage} isVisible={isVisible} />
                </div>
                <div className="text-xl font-semibold mb-1">{stat.label}</div>
                <div className="text-primary-foreground/70 text-sm">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced secondary stats */}
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '1000ms' }}>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="group bg-gradient-to-br from-primary-foreground/10 to-primary-foreground/5 border-primary-foreground/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Euro className="h-6 w-6 text-green-300" />
                </div>
                <h3 className="text-3xl font-bold mb-2">€{revenueCount / 10}M+</h3>
                <p className="text-primary-foreground/80">Ingresos generados para propietarios</p>
                <Progress value={85} className="mt-4 h-2" />
              </CardContent>
            </Card>
            
            <Card className="group bg-gradient-to-br from-primary-foreground/10 to-primary-foreground/5 border-primary-foreground/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-6 w-6 text-blue-300" />
                </div>
                <h3 className="text-3xl font-bold mb-2">24/7</h3>
                <p className="text-primary-foreground/80">Soporte y atención al cliente</p>
                <div className="flex justify-center mt-4">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <div key={dot} className="w-2 h-2 bg-primary-foreground/60 rounded-full animate-pulse" style={{ animationDelay: `${dot * 200}ms` }} />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group bg-gradient-to-br from-primary-foreground/10 to-primary-foreground/5 border-primary-foreground/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-6 w-6 text-purple-300" />
                </div>
                <h3 className="text-3xl font-bold mb-2">{renewalCount}%</h3>
                <p className="text-primary-foreground/80">Tasa de renovación de contratos</p>
                <Progress value={renewalCount} className="mt-4 h-2" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;