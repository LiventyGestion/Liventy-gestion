import { useState } from "react";
import { ArrowRight, AlertTriangle, Search, Clock, FileText, Calendar, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import maintenanceHero from "@/assets/maintenance-hero.jpg";
import repairTools from "@/assets/repair-tools.jpg";
import mobileNotification from "@/assets/mobile-notification.jpg";
import evaluationBoard from "@/assets/evaluation-board.jpg";
import trackingTimeline from "@/assets/tracking-timeline.jpg";
import maintenanceRecords from "@/assets/maintenance-records.jpg";
import maintenanceCalendar from "@/assets/maintenance-calendar.jpg";
import perfectMaintenance from "@/assets/perfect-maintenance.jpg";

const Mantenimiento = () => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const steps = [
    {
      id: "aviso-incidencia",
      icon: AlertTriangle,
      title: "Aviso de incidencia",
      description: "El inquilino notifica la avería desde su área privada o por WhatsApp.",
      image: mobileNotification,
      alt: "Notificación desde área privada"
    },
    {
      id: "evaluacion-asignacion",
      icon: Search,
      title: "Evaluación y asignación",
      description: "Nosotros la evaluamos y activamos al técnico correspondiente.",
      image: evaluationBoard,
      alt: "Evaluación y asignación del técnico"
    },
    {
      id: "seguimiento-tiempo-real",
      icon: Clock,
      title: "Seguimiento en tiempo real",
      description: "Te informamos en tiempo real del estado, el presupuesto y la solución.",
      image: trackingTimeline,
      alt: "Seguimiento en tiempo real"
    },
    {
      id: "registro-completo",
      icon: FileText,
      title: "Registro completo",
      description: "Todo queda registrado: fotos, informes, histórico de actuaciones.",
      image: maintenanceRecords,
      alt: "Registro de actuaciones"
    },
    {
      id: "preventivo-opcional",
      icon: Calendar,
      title: "Preventivo (opcional)",
      description: "Además, puedes optar por incluir revisiones periódicas o packs de mantenimiento preventivo, para anticiparte a los problemas.",
      image: maintenanceCalendar,
      alt: "Mantenimiento preventivo"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <Header />
      <Breadcrumbs 
        items={[
          { label: "Servicios", href: "/" },
          { label: "Mantenimiento e Incidencias" }
        ]} 
      />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${maintenanceHero})` }}
        />
        <div className="relative z-20 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              🔧 Mantenimiento
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-light">
              Reparamos como si la vivienda fuera nuestra.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Una gotera, una persiana rota o una caldera que falla no deberían convertirse en un problema para el propietario. En Liventy hemos creado un sistema ágil y automatizado de gestión de incidencias para que todo se repare antes de que se convierta en un conflicto.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Trabajamos con profesionales de confianza en Bizkaia y alrededores, con tiempos de respuesta rápidos y precios justos. Pero sobre todo, con criterio: solo intervenimos cuando es necesario, y siempre te informamos.
              </p>
            </div>
            <div className="relative">
              <img
                src={repairTools}
                alt="Herramientas de reparación profesionales"
                className="rounded-lg shadow-lg w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 lg:py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Cómo funciona?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step) => (
              <Card key={step.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <Collapsible 
                  open={openItems[step.id]} 
                  onOpenChange={() => toggleItem(step.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-secondary/20 transition-colors rounded-t-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <step.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                        <img
                          src={step.image}
                          alt={step.alt}
                          className="w-16 h-16 object-cover rounded-lg shadow-sm"
                          loading="lazy"
                        />
                      </div>
                      <CardTitle className="text-xl font-semibold text-left">
                        {step.title}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <CardDescription className="text-base leading-relaxed">
                        {step.description}
                      </CardDescription>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                👉 Para ti es invisible. Para el inquilino, impecable. Y para nosotros, una prioridad
              </h2>
            </div>
            <div className="relative">
              <img
                src={perfectMaintenance}
                alt="Resultado impecable tras mantenimiento"
                className="rounded-lg shadow-lg w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <Button 
              size="lg" 
              className="group text-lg px-8 py-4 mr-4"
              onClick={() => window.location.href = '/contacto?tipo=propietario&motivo=incidencias'}
            >
              Cómo gestionamos incidencias
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              size="lg" 
              className="group text-lg px-8 py-4"
              onClick={() => window.location.href = '/area-clientes/login'}
            >
              <LogIn className="mr-2 h-5 w-5" />
              Abrir incidencia (Área Clientes)
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Mantenimiento;