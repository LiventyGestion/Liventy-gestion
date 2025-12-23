import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Euro, TrendingUp, FileText, Shield, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useGA4Tracking } from "@/hooks/useGA4Tracking";

const Herramientas = () => {
  const navigate = useNavigate();
  const { trackAgendaLlamada } = useGA4Tracking();

  const recursos = [
    {
      icon: Euro,
      title: "Calculadora de rentabilidad",
      description: "Calcula el retorno real de tu inversión inmobiliaria",
      link: "/herramientas/calculadora-rentabilidad",
      action: () => navigate('/herramientas/calculadora-rentabilidad')
    },
    {
      icon: FileText,
      title: "Guía del propietario",
      description: "Todo lo que necesitas saber para alquilar tu vivienda",
      link: "/guia-propietario.pdf",
      isPdf: true
    },
    {
      icon: TrendingUp,
      title: "Checklist de entrega",
      description: "Lista de comprobación para la entrega de llaves",
      link: "/checklist-entrega.pdf",
      isPdf: true
    },
    {
      icon: Shield,
      title: "Simulador seguro de impago",
      description: "Compara opciones de protección ante impagos",
      link: "/herramientas/simulador-seguro",
      action: () => navigate('/herramientas/simulador-seguro')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs 
        items={[
          { label: "Recursos" }
        ]} 
      />
      
      {/* HERO */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Recursos para propietarios
            </h1>
            <p className="text-xl text-muted-foreground">
              Herramientas y guías para tomar mejores decisiones
            </p>
          </div>
        </div>
      </section>

      {/* RECURSOS - Grid 2x2 */}
      <section id="calculadora-precio" className="py-16 bg-gray-50 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {recursos.map((recurso, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
                onClick={recurso.action}
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <recurso.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{recurso.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{recurso.description}</p>
                  
                  {recurso.isPdf ? (
                    <a 
                      href={recurso.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="outline" className="w-full">
                        Ver recurso
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  ) : (
                    <Button variant="outline" className="w-full">
                      Ver recurso
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            ¿Necesitas ayuda personalizada?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Nuestro equipo está disponible para asesorarte
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            onClick={() => { trackAgendaLlamada('recursos_cta', '/contact'); navigate('/contact'); }}
          >
            Agenda una llamada de 15'
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Herramientas;
