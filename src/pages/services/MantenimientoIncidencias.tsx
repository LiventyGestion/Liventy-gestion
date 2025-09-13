import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Wrench, Zap, Droplets, Thermometer, Paintbrush, Clock, CheckCircle2, AlertCircle, User, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const MantenimientoIncidencias = () => {
  const { user } = useAuth();
  const coverages = [
    {
      icon: Droplets,
      title: "Fontanería",
      description: "Atascos, grifos, cisternas, pequeñas fugas"
    },
    {
      icon: Zap,
      title: "Electricidad", 
      description: "Enchufes, interruptores, bombillas, cuadro eléctrico"
    },
    {
      icon: Wrench,
      title: "Persianas",
      description: "Reparación de mecanismos, cordones, lamas"
    },
    {
      icon: Thermometer,
      title: "Calefacción",
      description: "Radiadores, termostatos, pequeñas averías"
    },
    {
      icon: Paintbrush,
      title: "Albañilería menor",
      description: "Pintura de retoques, pequeños agujeros, rozas"
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "El inquilino reporta la incidencia",
      description: "Desde el Área de Clientes, el inquilino describe el problema, adjunta fotos y especifica la urgencia.",
      icon: UserCheck,
      image: "/src/assets/handyman-professional.jpg",
      imageAlt: "Inquilino reportando incidencia desde área de clientes"
    },
    {
      step: "2", 
      title: "Liventy recibe y valida la incidencia",
      description: "Nuestro equipo revisa la solicitud, evalúa el tipo de intervención necesaria y asigna la prioridad adecuada.",
      icon: Wrench,
      image: "/src/assets/electrician-professional.jpg",
      imageAlt: "Equipo de Liventy validando incidencia"
    },
    {
      step: "3",
      title: "Se coordina un profesional de confianza",
      description: "Contactamos con el especialista apropiado (fontanero, electricista, etc.) y coordinamos la cita con el inquilino.",
      icon: Thermometer,
      image: "/src/assets/plumber-professional.jpg",
      imageAlt: "Profesional especializado resolviendo incidencia"
    },
    {
      step: "4",
      title: "El propietario recibe el seguimiento",
      description: "Mantenemos informado al propietario del progreso, costes y resolución final de cada incidencia.",
      icon: User,
      image: "/src/assets/painter-professional.jpg",
      imageAlt: "Propietario recibiendo seguimiento de incidencia"
    }
  ];

  const mockIncidents = [
    { id: "INC-2024-001", description: "Grifo cocina gotea", status: "Resuelta", priority: "Media" },
    { id: "INC-2024-002", description: "Persiana dormitorio atascada", status: "En curso", priority: "Baja" },
    { id: "INC-2024-003", description: "Interruptor salón no funciona", status: "Pendiente", priority: "Alta" }
  ];

  const faqs = [
    {
      question: "¿Cuáles son los tiempos típicos de resolución?",
      answer: "Incidencias urgentes: 24-48h. Incidencias normales: 3-7 días laborables. Depende de la disponibilidad de profesionales."
    },
    {
      question: "¿Cuál es la disponibilidad del servicio?",
      answer: "Lunes a viernes 9:00-18:00. Para emergencias (fugas, cortes eléctricos), contacto 24/7 por teléfono."
    },
    {
      question: "¿Qué fotos debo adjuntar?",
      answer: "Foto general del problema, primer plano del desperfecto, y cualquier detalle relevante (modelo, marca, códigos de error)."
    },
    {
      question: "¿Cómo se priorizan las incidencias?",
      answer: "Alta: emergencias y seguridad. Media: funcionalidad afectada. Baja: mejoras y mantenimiento preventivo."
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Resuelta": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "En curso": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"; 
      case "Pendiente": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "Alta": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Media": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Baja": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getIncidentCTA = () => {
    if (user) {
      // Si está logado, redirigir directamente al área de incidencias  
      return (
        <Link to="/area-clientes/inquilino/incidencias">
          <Button variant="outline" size="lg" className="text-lg px-8 py-6">
            <UserCheck className="mr-2 h-5 w-5" />
            Abrir incidencia (Área Clientes)
          </Button>
        </Link>
      );
    } else {
      // Si no está logado, redirigir al login
      return (
        <Link to="/auth">
          <Button variant="outline" size="lg" className="text-lg px-8 py-6">
            <UserCheck className="mr-2 h-5 w-5" />
            Abrir incidencia (Área Clientes)
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
              Mantenimiento e incidencias exprés
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Un único canal, coordinación de profesionales y seguimiento en tiempo real
            </p>
            <div className="flex justify-center">
              {getIncidentCTA()}
            </div>
          </div>
        </section>

        {/* Cobertura */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
              ¿Qué tipo de incidencias gestionamos?
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Enfoque en pequeñas reparaciones y soluciones rápidas. Sin obras mayores ni sustitución de electrodomésticos.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {coverages.map((item, index) => (
                <Card key={index} className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <item.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="py-16 sm:py-20 bg-muted/50">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
              ¿Cómo funciona?
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

            {/* Beneficios clave */}
            <div className="mt-20">
              <h3 className="text-2xl sm:text-3xl font-bold text-center mb-12">
                ¿Por qué nuestro sistema funciona?
              </h3>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <Card className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-semibold mb-2">Profesionales verificados</h4>
                    <p className="text-muted-foreground text-sm">
                      Trabajamos solo con especialistas de confianza, verificados y con experiencia.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Wrench className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-semibold mb-2">Coordinación centralizada</h4>
                    <p className="text-muted-foreground text-sm">
                      Un único punto de contacto gestiona toda la comunicación y seguimiento.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h4 className="font-semibold mb-2">Transparencia total</h4>
                    <p className="text-muted-foreground text-sm">
                      Propietarios e inquilinos reciben actualizaciones en tiempo real del progreso.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Tipos de profesionales */}
            <div className="mt-20">
              <h3 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Nuestros profesionales especializados
              </h3>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                Contamos con una red de especialistas para cubrir todas las necesidades de mantenimiento en tu propiedad.
              </p>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                <Card className="text-center hover:shadow-md transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src="/src/assets/electrician-professional.jpg" 
                      alt="Electricista profesional"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Electricistas</h4>
                    <p className="text-muted-foreground text-sm">
                      Instalaciones, reparaciones y mantenimiento eléctrico
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-md transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src="/src/assets/plumber-professional.jpg" 
                      alt="Fontanero profesional"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Fontaneros</h4>
                    <p className="text-muted-foreground text-sm">
                      Tuberías, grifos, desagües y sistemas de agua
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-md transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src="/src/assets/painter-professional.jpg" 
                      alt="Pintor profesional"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Pintores</h4>
                    <p className="text-muted-foreground text-sm">
                      Pintura, retoques y acabados de calidad
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-md transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src="/src/assets/handyman-professional.jpg" 
                      alt="Técnico de mantenimiento"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Mantenimiento</h4>
                    <p className="text-muted-foreground text-sm">
                      Persianas, cerraduras y reparaciones generales
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Vista del Área Cliente */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Vista desde el Área Cliente
              </h2>
              <p className="text-muted-foreground text-center mb-12">
                Tanto propietarios como inquilinos pueden seguir el estado de las incidencias en tiempo real
              </p>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wrench className="h-5 w-5" />
                    <span>Mis Incidencias</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockIncidents.map((incident, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-medium text-sm">{incident.id}</span>
                            <Badge className={getStatusColor(incident.status)}>
                              {incident.status}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(incident.priority)}>
                              {incident.priority}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{incident.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {incident.status === "Resuelta" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                          {incident.status === "En curso" && <Clock className="h-5 w-5 text-blue-500" />}
                          {incident.status === "Pendiente" && <AlertCircle className="h-5 w-5 text-orange-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-20 bg-muted/50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
                Preguntas frecuentes
              </h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              ¿Quieres saber más sobre nuestro servicio de incidencias?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contacta con nosotros si eres propietario, o accede al área cliente si eres inquilino.
            </p>
            <div className="flex justify-center">
              {getIncidentCTA()}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MantenimientoIncidencias;