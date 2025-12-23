import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, 
  UserCheck, 
  FileSignature, 
  Key,
  CheckCircle,
  ArrowRight,
  Bell,
  ClipboardList,
  Search,
  Home
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const alertSchema = z.object({
  email: z.string().email("Email inválido"),
  consent: z.boolean().refine(val => val === true, "Debes aceptar recibir comunicaciones")
});

type AlertForm = z.infer<typeof alertSchema>;

const Inquilinos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<AlertForm>({
    resolver: zodResolver(alertSchema),
    defaultValues: { consent: false }
  });

  const consentValue = watch("consent");

  const onSubmitAlert = async (data: AlertForm) => {
    setIsSubmitting(true);
    try {
      await supabase.from('leads' as any).insert({
        email: data.email,
        origen: 'alerta_viviendas',
        source_tag: 'inquilino_alertas'
      });
      
      setIsSubscribed(true);
      toast({
        title: "¡Suscrito!",
        description: "Te avisaremos cuando haya nuevas viviendas disponibles."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo completar la suscripción.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const criterios = [
    { icon: FileText, title: "DNI/NIE válido", description: "Documento de identidad en vigor" },
    { icon: ClipboardList, title: "Contrato laboral o ingresos", description: "Demostración de estabilidad económica" },
    { icon: FileSignature, title: "Últimas nóminas", description: "Verificación de solvencia" }
  ];

  const proceso = [
    { number: "01", title: "Inscripción", description: "Regístrate y completa tu perfil" },
    { number: "02", title: "Visita", description: "Coordina una visita a la vivienda" },
    { number: "03", title: "Candidatura", description: "Presenta tu documentación" },
    { number: "04", title: "Contrato", description: "Firma digital del contrato" },
    { number: "05", title: "Entrada", description: "Recibe las llaves de tu nuevo hogar" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs 
        items={[
          { label: "Para Inquilinos" }
        ]} 
      />
      
      {/* HERO */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
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
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Encuentra tu próximo hogar
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-light">
            Proceso claro, viviendas verificadas y atención continua
          </p>
          
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white px-8 text-lg"
            onClick={() => navigate('/auth')}
          >
            Quiero inscribirme
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* CRITERIOS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Criterios de solvencia</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Para garantizar una buena experiencia, verificamos la documentación de todos los candidatos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {criterios.map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Proceso de alquiler</h2>
            <p className="text-lg text-muted-foreground">5 pasos sencillos hasta tu nuevo hogar</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
            {proceso.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center min-w-[140px]">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto mb-2 text-sm">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {index < proceso.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-primary/30 mx-2 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALERTAS */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Bell className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Quiero recibir avisos de nuevas viviendas
            </h2>
            <p className="text-muted-foreground mb-8">
              Sé el primero en enterarte cuando publiquemos nuevas viviendas en tu zona
            </p>

            {isSubscribed ? (
              <div className="flex items-center justify-center gap-3 bg-green-50 text-green-700 p-4 rounded-lg">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">¡Gracias! Te avisaremos de nuevas viviendas.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmitAlert)} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Tu email"
                    {...register("email")}
                    className="max-w-sm mx-auto"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="flex items-start gap-2 justify-center max-w-sm mx-auto">
                  <Checkbox 
                    id="consent"
                    checked={consentValue}
                    onCheckedChange={(checked) => setValue("consent", checked as boolean)}
                  />
                  <Label htmlFor="consent" className="text-xs text-muted-foreground text-left">
                    Acepto recibir comunicaciones sobre viviendas disponibles
                  </Label>
                </div>
                {errors.consent && (
                  <p className="text-sm text-destructive">{errors.consent.message}</p>
                )}

                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Activar alertas"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            ¿Listo para encontrar tu hogar?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Regístrate y accede a viviendas verificadas con gestión profesional
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            onClick={() => navigate('/auth')}
          >
            Quiero inscribirme
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Inquilinos;
