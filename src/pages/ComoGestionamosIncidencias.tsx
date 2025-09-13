import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, UserPlus, Settings, Users, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import electricianImage from "@/assets/electrician-professional.jpg";
import plumberImage from "@/assets/plumber-professional.jpg";
import painterImage from "@/assets/painter-professional.jpg";
import handymanImage from "@/assets/handyman-professional.jpg";

const ComoGestionamosIncidencias = () => {
  const { user } = useAuth();

  const processSteps = [
    {
      step: "1",
      title: "El inquilino reporta la incidencia",
      description: "Desde el Área de Clientes, el inquilino describe el problema, adjunta fotos y especifica la urgencia.",
      icon: UserPlus,
      image: handymanImage,
      imageAlt: "Inquilino reportando incidencia desde área de clientes"
    },
    {
      step: "2", 
      title: "Liventy recibe y valida la incidencia",
      description: "Nuestro equipo revisa la solicitud, evalúa el tipo de intervención necesaria y asigna la prioridad adecuada.",
      icon: FileCheck,
      image: electricianImage,
      imageAlt: "Equipo de Liventy validando incidencia"
    },
    {
      step: "3",
      title: "Se coordina un profesional de confianza",
      description: "Contactamos con el especialista apropiado (fontanero, electricista, etc.) y coordinamos la cita con el inquilino.",
      icon: Settings,
      image: plumberImage,
      imageAlt: "Profesional especializado resolviendo incidencia"
    },
    {
      step: "4",
      title: "El propietario recibe el seguimiento",
      description: "Mantenemos informado al propietario del progreso, costes y resolución final de cada incidencia.",
      icon: Users,
      image: painterImage,
      imageAlt: "Propietario recibiendo seguimiento de incidencia"
    }
  ];

  const getIncidentCTA = () => {
    if (user) {
      // Si está logado, redirigir directamente al área de incidencias
      return (
        <Link to="/area-clientes/inquilino/incidencias">
          <Button size="lg" className="text-lg px-8 py-6">
            <Settings className="mr-2 h-5 w-5" />
            Abrir incidencia (Área de clientes)
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      );
    } else {
      // Si no está logado, redirigir al login
      return (
        <Link to="/auth">
          <Button size="lg" className="text-lg px-8 py-6">
            <UserPlus className="mr-2 h-5 w-5" />
            Abrir incidencia (Área de clientes)
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-green-50/60 via-green-100/40 to-green-50/80 dark:from-green-950/10 dark:to-green-900/20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Cómo gestionamos incidencias
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Un proceso claro y eficiente que conecta inquilinos, propietarios y profesionales especializados para resolver cualquier incidencia de forma rápida.
            </p>
            
            {/* CTA Principal */}
            {getIncidentCTA()}
          </div>
        </section>

        {/* Proceso paso a paso */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
              Nuestro proceso paso a paso
            </h2>
            <p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
              Cada incidencia sigue un flujo estructurado que garantiza una resolución eficaz y un seguimiento completo para todas las partes.
            </p>

            <div className="space-y-16">
              {processSteps.map((step, index) => (
                <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-12`}>
                  {/* Contenido */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
                        {step.step}
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Imagen */}
                  <div className="flex-1">
                    <Card className="overflow-hidden shadow-lg">
                      <div className="aspect-video">
                        <img 
                          src={step.image} 
                          alt={step.imageAlt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Beneficios clave */}
        <section className="py-16 sm:py-20 bg-muted/50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
                ¿Por qué nuestro sistema funciona?
              </h2>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold mb-2">Profesionales verificados</h3>
                    <p className="text-muted-foreground text-sm">
                      Trabajamos solo con especialistas de confianza, verificados y con experiencia.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Settings className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold mb-2">Coordinación centralizada</h3>
                    <p className="text-muted-foreground text-sm">
                      Un único punto de contacto gestiona toda la comunicación y seguimiento.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="font-semibold mb-2">Transparencia total</h3>
                    <p className="text-muted-foreground text-sm">
                      Propietarios e inquilinos reciben actualizaciones en tiempo real del progreso.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Tipos de profesionales */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
              Nuestros profesionales especializados
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Contamos con una red de especialistas para cubrir todas las necesidades de mantenimiento en tu propiedad.
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card className="text-center hover:shadow-md transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={electricianImage} 
                    alt="Electricista profesional"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Electricistas</h3>
                  <p className="text-muted-foreground text-sm">
                    Instalaciones, reparaciones y mantenimiento eléctrico
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-md transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={plumberImage} 
                    alt="Fontanero profesional"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Fontaneros</h3>
                  <p className="text-muted-foreground text-sm">
                    Tuberías, grifos, desagües y sistemas de agua
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-md transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={painterImage} 
                    alt="Pintor profesional"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Pintores</h3>
                  <p className="text-muted-foreground text-sm">
                    Pintura, retoques y acabados de calidad
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-md transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={handymanImage} 
                    alt="Técnico de mantenimiento"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Mantenimiento</h3>
                  <p className="text-muted-foreground text-sm">
                    Persianas, cerraduras y reparaciones generales
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              ¿Necesitas reportar una incidencia?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Accede al área de clientes para abrir una nueva incidencia o consultar el estado de las existentes.
            </p>
            
            {getIncidentCTA()}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ComoGestionamosIncidencias;