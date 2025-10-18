import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle2, AlertTriangle, ChevronRight, Scale, FileText, MessageSquare, RefreshCw, Search, Calendar, BookOpen, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import heroImage from "@/assets/property-consultation.jpg";
import sideImage from "@/assets/property-guide.jpg";
import contractImage from "@/assets/legal-contract-review.jpg";
import reviewImage from "@/assets/contract-review.jpg";
import balanceImage from "@/assets/legal-balance.jpg";
import timelineImage from "@/assets/legal-timeline.jpg";
import rightsImage from "@/assets/rights-infographic.jpg";
import consultationImage from "@/assets/friendly-consultation.jpg";

const AsesoramientoLegal = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (value: string) => {
    setOpenItems(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const services = [
    {
      id: "contratos",
      icon: FileText,
      title: "Contratos ajustados a tu caso",
      description: "Redacción y personalización de contratos de vivienda y de temporada conforme a la normativa vigente.",
      image: contractImage,
      alt: "Redacción y personalización de contratos"
    },
    {
      id: "revision",
      icon: Search,
      title: "Revisión legal de contratos",
      description: "Si ya tienes inquilino/contrato, revisamos cláusulas clave y riesgos habituales.",
      image: reviewImage,
      alt: "Revisión legal de contratos"
    },
    {
      id: "conflictos",
      icon: Scale,
      title: "Asesoría ante impagos o conflictos",
      description: "Orientación de primeros pasos, comunicaciones y pruebas; derivación a abogado si procede.",
      image: balanceImage,
      alt: "Asesoría ante impagos o conflictos"
    },
    {
      id: "plazos",
      icon: Calendar,
      title: "Finalización, prórrogas y preavisos",
      description: "Calendario de plazos, modelos de comunicación y checklists de entrega.",
      image: timelineImage,
      alt: "Prórrogas y preavisos"
    },
    {
      id: "derechos",
      icon: BookOpen,
      title: "Derechos y obligaciones",
      description: "Información clara y actualizada en lenguaje comprensible, sin tecnicismos.",
      image: rightsImage,
      alt: "Información clara y actualizada"
    }
  ];


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs 
        items={[
          { label: "Servicios", href: "/" },
          { label: "Asesoramiento Legal" }
        ]} 
      />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={heroImage} 
              alt="Asesoría legal básica en alquiler residencial — Liventy Gestión"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="relative container mx-auto px-6 text-center text-white">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              ⚖️ Asesoría legal
            </h1>
            <p className="text-xl sm:text-2xl font-medium mb-8">
              Claridad jurídica, sin complicaciones.
            </p>

            <Link to="/contacto?tipo=propietario&motivo=asesoria-legal">
              <Button size="lg" className="text-lg px-8 py-6 bg-white text-black hover:bg-white/90">
                Consultar mi caso
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  El mundo legal del alquiler puede parecer una jungla: normativas autonómicas, derechos del inquilino, límites a la renta, prórrogas, plazos de preaviso… En Liventy lo convertimos en claridad.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  Contamos con experiencia jurídica práctica en alquiler residencial para anticipar riesgos, redactar contratos sólidos y actuar con rapidez si surgen imprevistos.
                </p>
              </div>
              <div className="text-center">
                <img 
                  src={sideImage} 
                  alt="Libro legal con laptop mostrando documentos"
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Aviso de alcance */}
        <section className="py-8 bg-muted/50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                  <p className="text-orange-700 dark:text-orange-300">
                    <strong>Servicio de asesoría básica/orientativa.</strong> No prestamos representación jurídica ni emitimos dictámenes profesionales. En casos complejos, derivamos a abogados colaboradores de confianza.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Te ofrecemos */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
              Te ofrecemos:
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {services.map((service) => (
                <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-[3/2] overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <service.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-semibold">{service.title}</h3>
                    </div>
                    
                    <Collapsible>
                      <CollapsibleTrigger 
                        className="flex items-center justify-between w-full text-left"
                        onClick={() => toggleItem(service.id)}
                        aria-expanded={openItems.includes(service.id)}
                        aria-controls={`content-${service.id}`}
                      >
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {service.description}
                        </p>
                        <ChevronDown 
                          className={`h-4 w-4 ml-2 flex-shrink-0 transition-transform ${
                            openItems.includes(service.id) ? 'rotate-180' : ''
                          }`}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent 
                        id={`content-${service.id}`}
                        className="pt-2"
                      >
                        <p className="text-muted-foreground text-sm">
                          {service.description}
                        </p>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Cierre */}
        <section className="py-16 sm:py-20 bg-muted/50">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                  Siempre disponibles, online o presencialmente
                </h2>
                <p className="text-lg text-muted-foreground">
                  Tu decisión, con seguridad y claridad.
                </p>
              </div>
              <div className="text-center">
                <img 
                  src={consultationImage} 
                  alt="Atención cercana y clara"
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
          <div className="container mx-auto px-6 text-center">
            <p className="text-2xl sm:text-3xl font-bold mb-8">
              👉 Consultar mi caso
            </p>
            <Link to="/contacto?tipo=propietario&motivo=asesoria-legal">
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