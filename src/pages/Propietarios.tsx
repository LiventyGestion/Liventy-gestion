import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Shield, 
  FileText, 
  BarChart3, 
  Calendar,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Propietarios = () => {
  const navigate = useNavigate();

  const valuePoints = [
    { icon: Shield, text: "Selección rigurosa" },
    { icon: FileText, text: "Contratos claros" },
    { icon: Calendar, text: "Gestión mensual" },
    { icon: BarChart3, text: "Reportes y trazabilidad" }
  ];

  const startFeatures = [
    "Reportaje fotográfico profesional",
    "Publicación multicanal",
    "Gestión de interesados",
    "Visitas coordinadas",
    "Filtrado de candidatos",
    "Contrato e inventario/entrega"
  ];

  const fullFeatures = [
    "Todo lo de Start",
    "Gestión mensual completa",
    "Control y seguimiento del cobro*",
    "Incidencias y coordinación de gremios",
    "Renovaciones y vencimientos",
    "Reporting y documentación"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs 
        items={[
          { label: "Para Propietarios" }
        ]} 
      />
      
      {/* HERO */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-background overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Para propietarios
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Tu alquiler, profesionalizado
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Delega la gestión de tu propiedad y obtén tranquilidad, control y rentabilidad.
            </p>

            {/* Value Points */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
              {valuePoints.map((point, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                >
                  <point.icon className="h-6 w-6 text-primary mb-2" />
                  <span className="text-sm font-medium text-foreground text-center">{point.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Elige tu plan</h2>
            <p className="text-lg text-muted-foreground">Dos opciones adaptadas a tus necesidades</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Plan Start */}
            <Card className="border-2 border-gray-200 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <Badge variant="outline" className="w-fit mx-auto mb-2">Plan básico</Badge>
                <CardTitle className="text-2xl font-bold">Start</CardTitle>
                <p className="text-muted-foreground text-sm mt-2">
                  Ideal si… quieres alquilar bien desde el inicio y gestionar el día a día.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {startFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => navigate('/contact?tipo=propietario&plan=start')}
                >
                  Solicitar propuesta
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Plan Full */}
            <Card className="border-2 border-primary shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                Recomendado
              </div>
              <CardHeader className="text-center pb-4">
                <Badge className="w-fit mx-auto mb-2 bg-primary text-primary-foreground">Plan completo</Badge>
                <CardTitle className="text-2xl font-bold">Full</CardTitle>
                <p className="text-muted-foreground text-sm mt-2">
                  Ideal si… buscas tranquilidad total.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {fullFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => navigate('/contact?tipo=propietario&plan=full')}
                >
                  Empieza ahora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-sm text-muted-foreground mt-8 max-w-3xl mx-auto bg-gray-100 p-4 rounded-lg">
            * El servicio incluye seguimiento del cobro y comunicación. No constituye garantía de pago salvo contratación y aceptación de coberturas externas.
          </p>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            ¿Listo para profesionalizar tu alquiler?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contacta con nosotros y te asesoramos sin compromiso
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            onClick={() => navigate('/contact#empezar')}
          >
            Empieza ahora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Propietarios;
