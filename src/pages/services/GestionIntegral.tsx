import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, X, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const GestionIntegral = () => {
  const howItWorks = [
    {
      step: "1",
      title: "Publicación",
      description: "Anunciamos tu propiedad en múltiples portales y gestionamos las consultas"
    },
    {
      step: "2", 
      title: "Selección de inquilino",
      description: "Preseleccionamos candidatos, organizamos visitas y verificamos referencias"
    },
    {
      step: "3",
      title: "Contrato y firma digital",
      description: "Formalizamos el contrato con firma digital y toda la documentación legal"
    },
    {
      step: "4",
      title: "Gestión del día a día",
      description: "Coordinamos cobros, mantenimiento e incidencias desde el área cliente"
    }
  ];

  const included = [
    "Anuncios en múltiples portales inmobiliarios",
    "Visitas guiadas y preselección de inquilinos", 
    "Contratos estándar y documentación legal",
    "Coordinación de cobros mensuales",
    "Mantenimiento menor e incidencias",
    "Área cliente para propietario e inquilino"
  ];

  const notIncluded = [
    "No garantizamos cobros ni rentas",
    "No ofrecemos representación jurídica", 
    "No realizamos obras mayores ni sustitución de electrodomésticos"
  ];

  const faqs = [
    {
      question: "¿Cuáles son las comisiones?",
      answer: "Nuestras comisiones son transparentes y competitivas. Te informaremos de todos los costes antes de firmar cualquier acuerdo."
    },
    {
      question: "¿Cuánto tiempo tarda en alquilarse?",
      answer: "Depende del tipo de propiedad, ubicación y condiciones del mercado. Generalmente entre 2-6 semanas desde la publicación."
    },
    {
      question: "¿Gestionáis alquileres temporales y de larga duración?",
      answer: "Sí, gestionamos tanto alquileres temporales (menos de 11 meses) como contratos de larga duración."
    },
    {
      question: "¿Qué documentación necesito aportar?",
      answer: "Necesitarás escrituras, cédula de habitabilidad, certificados energéticos y de gas, y documentación fiscal de la propiedad."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Gestión integral del alquiler, sin complicaciones
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Desde la publicación hasta la gestión diaria, nos encargamos de todo para que tú no tengas que preocuparte.
            </p>
            <Link to="/contacto?tipo=propietario&origen=gestion-integral">
              <Button size="lg" className="text-lg px-8 py-6">
                Quiero gestionarlo con Liventy
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
              ¿Cómo funciona?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {howItWorks.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Qué incluye */}
        <section className="py-16 sm:py-20 bg-muted/50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
                ¿Qué incluye nuestro servicio?
              </h2>
              <Card>
                <CardContent className="p-8">
                  <div className="grid sm:grid-cols-2 gap-6">
                    {included.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Lo que no hacemos */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
                Transparencia: Lo que no hacemos
              </h2>
              <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    {notIncluded.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <X className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                        <span className="text-orange-700 dark:text-orange-300">{item}</span>
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
              ¿Listo para gestionar tu propiedad sin complicaciones?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contacta con nosotros y te explicaremos cómo podemos ayudarte con la gestión integral de tu alquiler.
            </p>
            <Link to="/contacto?tipo=propietario&origen=gestion-integral">
              <Button size="lg" className="text-lg px-8 py-6">
                Quiero gestionarlo con Liventy
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

export default GestionIntegral;