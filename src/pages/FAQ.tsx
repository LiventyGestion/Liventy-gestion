import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  HelpCircle,
  FileText,
  Users,
  Shield,
  Wrench,
  Euro,
  Settings,
  Home,
  Link2,
  MessageCircle,
  Mail,
  Calculator,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  icon: any;
}

const categories = [
  { id: "servicio", label: "Servicio y proceso", icon: Settings },
  { id: "propietarios", label: "Propietarios", icon: Home },
  { id: "inquilinos", label: "Inquilinos", icon: Users },
  { id: "contratos", label: "Contratos y legal", icon: Shield },
  { id: "mantenimiento", label: "Mantenimiento e incidencias", icon: Wrench },
  { id: "rentabilidad", label: "Rentabilidad y precios", icon: Euro },
  { id: "cuenta", label: "Cuenta y privacidad", icon: FileText },
];

const faqs: FAQ[] = [
  // Servicio y proceso
  {
    id: "faq-1",
    category: "servicio",
    question: "¿Qué hace exactamente Liventy Gestión?",
    answer: "Nos encargamos de todo lo necesario para alquilar tu vivienda: valoración, preparación, selección de inquilinos, contratos, check-in/out, incidencias y seguimiento digital desde tu panel.",
    icon: Settings,
  },
  {
    id: "faq-2",
    category: "servicio",
    question: "¿En qué zonas trabajáis?",
    answer: "Bizkaia y alrededores (Bilbao, Barakaldo, Getxo, Leioa, Santurtzi, Derio, Sondika, Zamudio…). Si tu vivienda está cerca, consúltanos.",
    icon: Settings,
  },
  {
    id: "faq-3",
    category: "servicio",
    question: "¿Cómo empiezo?",
    answer: "Rellena el formulario de propietarios o usa las herramientas de cálculo. Te llamamos en <24 h para valorar la vivienda y proponerte un plan.",
    icon: Settings,
  },
  {
    id: "faq-4",
    category: "servicio",
    question: "¿Cuánto tardáis en alquilar?",
    answer: "Depende de zona, precio y temporada. Nuestro objetivo es cerrar en días/semanas con inquilinos verificados.",
    icon: Settings,
  },
  // Propietarios
  {
    id: "faq-5",
    category: "propietarios",
    question: "¿Puedo elegir el inquilino?",
    answer: "Sí. Te presentamos los candidatos verificados y decides con nuestra recomendación profesional.",
    icon: Home,
  },
  {
    id: "faq-6",
    category: "propietarios",
    question: "¿Qué pasa si el inquilino quiere prorrogar o irse antes?",
    answer: "Te avisamos con antelación, gestionamos la documentación y preparamos la siguiente estancia para minimizar vacíos.",
    icon: Home,
  },
  {
    id: "faq-7",
    category: "propietarios",
    question: "¿Tenéis panel para propietarios?",
    answer: "Sí. Podrás ver documentación, incidencias, calendario y reportes de tu vivienda.",
    icon: Home,
  },
  // Inquilinos
  {
    id: "faq-8",
    category: "inquilinos",
    question: "¿Qué perfil de inquilinos aceptáis?",
    answer: "Profesionales, empresas y particulares adultos con verificación documental y referencias.",
    icon: Users,
  },
  {
    id: "faq-9",
    category: "inquilinos",
    question: "¿Cómo gestionáis check-in y check-out?",
    answer: "Con protocolos claros: inventario, estado de la vivienda y soporte durante la estancia.",
    icon: Users,
  },
  {
    id: "faq-10",
    category: "inquilinos",
    question: "¿Se admiten mascotas?",
    answer: "Depende de la vivienda y del propietario. Lo indicamos en cada anuncio.",
    icon: Users,
  },
  // Contratos y legal
  {
    id: "faq-11",
    category: "contratos",
    question: "¿Qué tipo de contratos utilizáis?",
    answer: "El contrato adecuado según el caso (temporada, etc.) preparado por nuestro equipo con cláusulas claras y firma digital.",
    icon: Shield,
  },
  {
    id: "faq-12",
    category: "contratos",
    question: "¿Quién gestiona fianzas y garantías?",
    answer: "Lo coordinamos según la normativa aplicable y lo reflejamos en el contrato y en el inventario de entrega/recogida.",
    icon: Shield,
  },
  {
    id: "faq-13",
    category: "contratos",
    question: "¿Podéis asesorar sobre impuestos?",
    answer: "Ofrecemos orientación general y documentación ordenada. Para casos específicos, colaboramos con asesoría fiscal.",
    icon: Shield,
  },
  // Mantenimiento e incidencias
  {
    id: "faq-14",
    category: "mantenimiento",
    question: "¿Quién se ocupa de las incidencias?",
    answer: "Las filtramos, priorizamos y coordinamos con nuestra red de profesionales. Te mantenemos informado desde el panel.",
    icon: Wrench,
  },
  {
    id: "faq-15",
    category: "mantenimiento",
    question: "¿Puedo usar mi propio proveedor?",
    answer: "Sí, indícanoslo y coordinamos con él.",
    icon: Wrench,
  },
  {
    id: "faq-16",
    category: "mantenimiento",
    question: "¿Hacéis inventarios y reportes?",
    answer: "Sí. Inventario fotográfico y checklist de estado en entrada/salida.",
    icon: Wrench,
  },
  // Rentabilidad y precios
  {
    id: "faq-17",
    category: "rentabilidad",
    question: "¿Cómo definís el precio de alquiler?",
    answer: "Analizamos comparables, demanda por zona, estado y equipamiento, y usamos datos reales para recomendar un rango óptimo.",
    icon: Euro,
  },
  {
    id: "faq-18",
    category: "rentabilidad",
    question: "¿Tenéis herramientas para estimar ingresos?",
    answer: "Sí, en /herramientas puedes calcular precio recomendado, rentabilidad neta y comparador.",
    icon: Euro,
  },
  // Cuenta y privacidad
  {
    id: "faq-19",
    category: "cuenta",
    question: "¿Cómo tratáis mis datos?",
    answer: "Cumplimos RGPD. Solo usamos tu información para prestar el servicio. Más en /politica-privacidad.",
    icon: FileText,
  },
  {
    id: "faq-20",
    category: "cuenta",
    question: "¿Cómo contacto con soporte?",
    answer: "Desde el panel, por WhatsApp o en el formulario de contacto. Respondemos en horario laboral y urgencias priorizadas.",
    icon: FileText,
  },
];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // SEO Meta tags
  useEffect(() => {
    document.title = "Preguntas frecuentes | Liventy Gestión";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Resuelve tus dudas sobre la gestión de alquileres con Liventy: proceso, propietarios, inquilinos, contratos, mantenimiento y más."
      );
    }

    // GA4 page view event
    if (typeof (window as any).gtag !== "undefined") {
      (window as any).gtag("event", "page_view", {
        page_title: "FAQ",
        page_path: "/faq",
      });
    }

    // Schema.org FAQPage JSON-LD
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Handle deep-linking with hash
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash && hash.startsWith("faq-")) {
      setOpenItem(hash);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 200);
    }
  }, [location.hash]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        // GA4 search event
        if (typeof (window as any).gtag !== "undefined") {
          (window as any).gtag("event", "faq_search", {
            query: searchQuery,
            results_count: filteredFaqs.length,
          });
        }
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter FAQs
  const filteredFaqs = useMemo(() => {
    let filtered = faqs;

    if (selectedCategory) {
      filtered = filtered.filter((faq) => faq.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    
    // GA4 category filter event
    if (typeof (window as any).gtag !== "undefined") {
      (window as any).gtag("event", "faq_view", {
        category: categoryId,
      });
    }
  };

  const handleCopyLink = (faqId: string, question: string) => {
    const url = `${window.location.origin}/faq#${faqId}`;
    navigator.clipboard.writeText(url);
    
    toast({
      title: "Enlace copiado",
      description: "El enlace a esta pregunta se ha copiado al portapapeles.",
    });

    // GA4 copy link event
    if (typeof (window as any).gtag !== "undefined") {
      (window as any).gtag("event", "faq_copy_link", {
        id: faqId,
      });
    }
  };

  const handleAccordionChange = (value: string) => {
    setOpenItem(value);
    if (value) {
      navigate(`#${value}`, { replace: true });
      
      // GA4 open event
      const faq = faqs.find((f) => f.id === value);
      if (faq && typeof (window as any).gtag !== "undefined") {
        (window as any).gtag("event", "faq_open", {
          id: value,
          question: faq.question,
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/8a8330ce-f5ff-4c18-9ac4-2d21db8b4d79.png')] bg-cover bg-center opacity-5" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <HelpCircle className="h-10 w-10 text-primary" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Preguntas frecuentes
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-10">
              Resuelve tus dudas sobre la gestión de tu alquiler con Liventy Gestión.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Busca por contrato, inquilinos, mantenimiento…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-base rounded-xl border-2 focus:border-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Chips */}
      <section className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b py-4">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <Button
                  key={category.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryClick(category.id)}
                  className="flex-shrink-0 rounded-full transition-all duration-200"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-12 flex-1">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8 max-w-7xl mx-auto">
          {/* FAQ List */}
          <div>
            {searchQuery || selectedCategory ? (
              <p className="text-sm text-muted-foreground mb-6">
                Mostrando {filteredFaqs.length} resultado{filteredFaqs.length !== 1 ? "s" : ""}
              </p>
            ) : null}

            {filteredFaqs.length === 0 ? (
              <Card className="p-12 text-center">
                <HelpCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No encontramos resultados</h3>
                <p className="text-muted-foreground mb-6">
                  No hemos encontrado preguntas que coincidan con tu búsqueda.
                </p>
                <Button asChild variant="outline">
                  <Link to="/contact">Contacta con nosotros</Link>
                </Button>
              </Card>
            ) : (
              <Accordion
                type="single"
                collapsible
                value={openItem || undefined}
                onValueChange={handleAccordionChange}
                className="space-y-4"
              >
                {filteredFaqs.map((faq) => {
                  const Icon = faq.icon;
                  
                  return (
                    <AccordionItem
                      key={faq.id}
                      id={faq.id}
                      value={faq.id}
                      className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200 px-6"
                    >
                      <AccordionTrigger className="text-left font-semibold hover:no-underline py-6">
                        <div className="flex items-start gap-4 pr-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <span className="flex-1">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-14 pr-4 pb-6">
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {faq.answer}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyLink(faq.id, faq.question)}
                          className="text-xs"
                        >
                          <Link2 className="h-3 w-3 mr-1" />
                          Copiar enlace
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Contact Card */}
            <Card className="rounded-2xl border-2">
              <CardHeader>
                <CardTitle className="text-lg">¿No encuentras tu respuesta?</CardTitle>
                <CardDescription>
                  Estamos aquí para ayudarte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    if (typeof (window as any).gtag !== "undefined") {
                      (window as any).gtag("event", "faq_cta_contact_click", {
                        location: "sidebar",
                      });
                    }
                  }}
                >
                  <a
                    href="https://wa.me/34688828290"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    if (typeof (window as any).gtag !== "undefined") {
                      (window as any).gtag("event", "faq_cta_contact_click", {
                        location: "sidebar",
                      });
                    }
                  }}
                >
                  <a href="mailto:info@liventygestion.com">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </a>
                </Button>
                
                <Button asChild variant="default" className="w-full">
                  <Link
                    to="/contact"
                    onClick={() => {
                      if (typeof (window as any).gtag !== "undefined") {
                        (window as any).gtag("event", "faq_cta_contact_click", {
                          location: "sidebar",
                        });
                      }
                    }}
                  >
                    Formulario de contacto
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Tools Card */}
            <Card className="rounded-2xl border-2 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Herramientas para propietarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Calcula tu rentabilidad, precio recomendado y compara opciones
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/herramientas">Ver herramientas</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              ¿No has encontrado lo que buscabas?
            </h2>
            <p className="text-muted-foreground mb-8">
              Estamos aquí para resolver cualquier duda que tengas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="rounded-xl"
                onClick={() => {
                  if (typeof (window as any).gtag !== "undefined") {
                    (window as any).gtag("event", "faq_cta_contact_click", {
                      location: "footer",
                    });
                  }
                }}
              >
                <Link to="/contact">Escríbenos</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl">
                <Link to="/herramientas">Ver herramientas</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
