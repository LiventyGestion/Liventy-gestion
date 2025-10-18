import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  MessageCircle, 
  CheckCircle, 
  Smartphone,
  ShieldCheck,
  Star,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Inquilinos = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* HERO SECTION */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Opción 1: Video de fondo (comentado por defecto) */}
        {/* <video 
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src="/videos/inquilinos-hero.mp4" type="video/mp4" />
        </video> */}
        
        {/* Opción 2: Imagen de fondo (activa por defecto) */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&h=900&fit=crop&auto=format&q=80')",
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <Badge className="mb-4 bg-primary text-white px-4 py-2">
            Para inquilinos
          </Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            Tu alquiler, más fácil con Liventy
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light">
            Nos ocupamos de todo para que tú solo disfrutes de tu hogar
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 text-lg btn-hover-lift"
              onClick={() => navigate('/contact?type=inquilino')}
            >
              Ver viviendas disponibles
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 border-white text-white hover:bg-white/20 backdrop-blur-sm px-8 text-lg"
              onClick={() => navigate('/auth')}
            >
              Registrarme como inquilino
            </Button>
          </div>
        </div>
      </section>

      {/* BLOQUE 1 - QUÉ OFRECEMOS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Qué ofrecemos al inquilino
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Alquilar con Liventy significa tranquilidad, transparencia y soporte humano
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[hsl(var(--primary-light))] flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Transparencia total</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Sin letra pequeña, firma y gestión 100% digital. Sabes exactamente qué firmas y cuáles son tus derechos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[hsl(var(--primary-light))] flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Asistencia continua</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Incidencias y mantenimiento con atención personalizada. Resolvemos tus dudas cuando las tengas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[hsl(var(--primary-light))] flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Viviendas verificadas</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Revisadas y preparadas antes de tu entrada. Todo listo para que te mudes con tranquilidad.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* BLOQUE 2 - TU EXPERIENCIA LIVENTY */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="animate-fade-up">
              <Badge className="mb-4 bg-primary text-white">
                Área de inquilinos
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Tu experiencia Liventy
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Consulta tu contrato, tus documentos y comunica incidencias desde un solo lugar.
              </p>
              <p className="text-xl font-semibold text-primary mb-8">
                Tu alquiler, siempre bajo control.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Acceso 24/7</h4>
                    <p className="text-muted-foreground">A todos tus documentos desde cualquier dispositivo</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Comunicación directa</h4>
                    <p className="text-muted-foreground">Reporta incidencias y recibe actualizaciones al instante</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Portal intuitivo</h4>
                    <p className="text-muted-foreground">Diseñado para ser simple y fácil de usar</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop" 
                  alt="Mockup del área de clientes"
                  className="rounded-lg shadow-2xl w-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg border-2 border-primary">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Disponible en móvil</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE 3 - TESTIMONIOS */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Lo que dicen nuestros inquilinos
            </h2>
            <p className="text-lg text-muted-foreground">
              Experiencias reales de personas que confían en Liventy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "Todo el proceso fue transparente y rápido. Desde el primer contacto hasta la firma, todo estuvo claro."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-semibold text-primary">M</span>
                  </div>
                  <div>
                    <p className="font-semibold">María González</p>
                    <p className="text-sm text-muted-foreground">Bilbao</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "Nos ayudaron con la mudanza y resolvieron cualquier duda al momento. Muy profesionales."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-semibold text-primary">J</span>
                  </div>
                  <div>
                    <p className="font-semibold">Javier Ruiz</p>
                    <p className="text-sm text-muted-foreground">Getxo</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "La vivienda estaba perfectamente preparada. Se nota que cuidan los detalles."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-semibold text-primary">A</span>
                  </div>
                  <div>
                    <p className="font-semibold">Ana Martínez</p>
                    <p className="text-sm text-muted-foreground">Barakaldo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* BLOQUE 4 - CTA FINAL */}
      <section className="py-20 bg-gradient-to-br from-[#FFF3E0] via-[#FFECCC] to-[#FFE0B2]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Encuentra tu próxima vivienda con la tranquilidad de Liventy
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Únete a cientos de inquilinos que ya confían en nosotros para su alquiler
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white px-10 text-lg btn-hover-lift"
            onClick={() => navigate('/contact?type=inquilino')}
          >
            Ver pisos disponibles
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Inquilinos;
