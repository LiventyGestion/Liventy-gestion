import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Precios = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Start",
      description: "Alquila tu vivienda con éxito",
      price: "1 mensualidad",
      suffix: "+ IVA",
      highlight: false
    },
    {
      name: "Full",
      description: "Gestión mensual completa",
      price: "8% mensual",
      suffix: "+ IVA (mín. 80€)",
      highlight: true
    },
    {
      name: "Corporate",
      description: "Alquiler temporal para empresas",
      price: "10% mensual",
      suffix: "o por proyecto",
      highlight: false
    },
    {
      name: "Home",
      description: "Larga duración premium",
      price: "500€",
      suffix: "+ IVA",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs 
        items={[
          { label: "Precios" }
        ]} 
      />
      
      {/* HERO */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Precios claros y sin sorpresas
            </h1>
            <p className="text-xl text-muted-foreground">
              Elige el plan que mejor se adapte a tus necesidades
            </p>
          </div>
        </div>
      </section>

      {/* TABLA DE PRECIOS */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`text-center transition-all hover:shadow-lg ${
                  plan.highlight 
                    ? 'border-2 border-primary shadow-lg relative' 
                    : 'border border-gray-200'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Más popular
                  </div>
                )}
                <CardContent className="p-6 pt-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <p className="text-sm text-muted-foreground mt-1">{plan.suffix}</p>
                  </div>
                  <Button 
                    className={`w-full ${plan.highlight ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={plan.highlight ? 'default' : 'outline'}
                    onClick={() => navigate(`/contact?plan=${plan.name.toLowerCase()}`)}
                  >
                    Solicitar propuesta
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Avisos */}
          <div className="max-w-3xl mx-auto mt-12 space-y-3">
            <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-200">
              <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Importes sin IVA.
              </p>
            </div>
            <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-200">
              <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                El servicio incluye seguimiento del cobro y comunicación. No constituye garantía de pago salvo contratación y aceptación de coberturas externas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            ¿Tienes dudas sobre qué plan elegir?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Te asesoramos sin compromiso
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            onClick={() => navigate('/contact')}
          >
            Solicitar propuesta
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Precios;
