import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, ChevronRight, Scale, FileText, MessageSquare, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AsesoramientoLegal = () => {
  const coverages = [
    {
      icon: FileText,
      title: "Contratos estándar",
      description: "Revisión y redacción de contratos de arrendamiento estándar"
    },
    {
      icon: MessageSquare,
      title: "Comunicaciones al inquilino", 
      description: "Redacción de avisos, notificaciones y comunicaciones oficiales"
    },
    {
      icon: RefreshCw,
      title: "Prórrogas y renovaciones",
      description: "Gestión de renovaciones y prórroga de contratos existentes"
    },
    {
      icon: Scale,
      title: "Resolución de dudas",
      description: "Asesoramiento sobre normativa de alquileres y dudas frecuentes"
    }
  ];

  const limitations = [
    "Procedimientos judiciales y desahucios",
    "Informes periciales y valoraciones técnicas",
    "Representación legal en tribunales",
    "Dictámenes profesionales complejos"
  ];

  const faqs = [
    {
      question: "¿Cuál es el tiempo de respuesta?",
      answer: "Respondemos consultas básicas en 24-48 horas. Para revisiones de contratos, el plazo es de 3-5 días laborables."
    },
    {
      question: "¿Qué documentación debo enviar?",
      answer: "Envía el contrato actual, documentación de la propiedad y descripción detallada de tu consulta o situación."
    },
    {
      question: "¿Cuáles son los límites del servicio?",
      answer: "Ofrecemos asesoramiento orientativo, no representación legal. Para casos complejos, te derivamos a abogados colaboradores."
    },
    {
      question: "¿Tiene coste adicional?",
      answer: "El asesoramiento básico está incluido en nuestros servicios. Te informaremos de cualquier coste adicional antes de proceder."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50/60 via-blue-100/40 to-blue-50/80 dark:from-blue-950/10 dark:to-blue-900/20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Asesoramiento legal básico para tu alquiler
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Resolución de dudas frecuentes, contratos estándar, comunicaciones y avisos
            </p>
            
            {/* Aclaración visible */}
            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  <strong>Importante:</strong> Servicio orientativo. Sin representación jurídica ni dictamen profesional. 
                  En casos complejos, derivamos a abogados colaboradores.
                </p>
              </div>
            </div>

            <Link to="/consultar-mi-caso">
              <Button size="lg" className="text-lg px-8 py-6">
                Consultar mi caso
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Coberturas */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
              ¿En qué te podemos ayudar?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {coverages.map((item, index) => (
                <Card key={index} className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <item.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Dónde ponemos el límite */}
        <section className="py-16 sm:py-20 bg-muted/50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
                Dónde ponemos el límite
              </h2>
              <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
                <CardContent className="p-8">
                  <p className="text-center text-muted-foreground mb-6">
                    Para estos casos, te ponemos en contacto con abogados colaboradores especializados:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {limitations.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-red-700 dark:text-red-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-20">
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
        <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              ¿Tienes dudas legales sobre tu alquiler?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contacta con nosotros y te ayudaremos a resolver tus consultas de forma rápida y profesional.
            </p>
            <Link to="/consultar-mi-caso">
              <Button size="lg" className="text-lg px-8 py-6">
                Consultar mi caso
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AsesoramientoLegal;