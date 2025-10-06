import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CheckCircle2, TrendingUp, FileText, Clock, Shield, Users, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import sellHeroImage from "@/assets/sell-section-bg.jpg";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const formSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  telefono: z.string().trim().min(9, "Teléfono inválido").max(20),
  direccion: z.string().trim().min(5, "Dirección inválida").max(200),
  superficie: z.string().trim().optional(),
  habitaciones: z.string().trim().optional(),
  comentarios: z.string().trim().max(1000).optional(),
});

type FormData = z.infer<typeof formSchema>;

const Venta = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      direccion: "",
      superficie: "",
      habitaciones: "",
      comentarios: "",
    },
  });

  useEffect(() => {
    document.title = "Venta de vivienda en Bizkaia | Liventy Gestión";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Servicio opcional de venta con transparencia y acompañamiento. Valoración profesional, visitas filtradas y cierre en notaría. Sin exclusividad.');
    }
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Guardar en tabla de solicitudes
      const { error: dbError } = await supabase.from("solicitudes").insert({
        tipo_servicio: "venta",
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        direccion: data.direccion,
        detalles: {
          superficie: data.superficie,
          habitaciones: data.habitaciones,
          comentarios: data.comentarios,
        },
      });

      if (dbError) throw dbError;

      // Enviar email
      await supabase.functions.invoke("send-form-email", {
        body: {
          type: "venta",
          data: {
            nombre: data.nombre,
            email: data.email,
            telefono: data.telefono,
            direccion: data.direccion,
            superficie: data.superficie,
            habitaciones: data.habitaciones,
            comentarios: data.comentarios,
          },
        },
      });

      setIsSuccess(true);
      form.reset();
      
      // Analytics event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'submit_venta_form', {
          event_category: 'venta',
          event_label: 'Formulario valoración venta',
        });
      }

      toast({
        title: "¡Solicitud enviada!",
        description: "Te contactamos en menos de 24 horas.",
      });

    } catch (error) {
      console.error("Error al enviar formulario:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar el formulario. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative h-[400px] sm:h-[480px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${sellHeroImage})`,
            filter: 'saturate(0.7)'
          }}
          aria-hidden="true"
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.4) 100%)'
          }}
          aria-hidden="true"
        />
        <div className="relative container mx-auto px-4 sm:px-6 h-full flex items-center justify-center">
          <div className="text-center max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              Venta de tu vivienda con Liventy
            </h1>
            <p className="text-xl sm:text-2xl text-white/95 mb-4 leading-relaxed">
              Vende con calma, claridad y acompañamiento real
            </p>
            <p className="text-sm sm:text-base text-white/80 italic">
              Servicio opcional para propietarios. Sin exclusividad ni presión.
            </p>
          </div>
        </div>
      </section>

      {/* Por qué con Liventy */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16">
            Por qué con Liventy
          </h2>
          <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="flex gap-4 p-6 rounded-lg border border-border bg-card">
              <TrendingUp className="h-8 w-8 text-[#E67E0F] flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Valoración profesional</h3>
                <p className="text-muted-foreground">
                  Análisis de mercado preciso para fijar el precio justo de tu vivienda.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-lg border border-border bg-card">
              <Shield className="h-8 w-8 text-[#E67E0F] flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Sin exclusividad</h3>
                <p className="text-muted-foreground">
                  Mantienes tu libertad. Puedes vender por tu cuenta cuando quieras.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-lg border border-border bg-card">
              <Clock className="h-8 w-8 text-[#E67E0F] flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Proceso ágil</h3>
                <p className="text-muted-foreground">
                  Gestionamos todo el proceso para que vendas sin complicaciones.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-lg border border-border bg-card">
              <FileText className="h-8 w-8 text-[#E67E0F] flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Transparencia total</h3>
                <p className="text-muted-foreground">
                  Información clara en cada paso. Sin sorpresas ni letra pequeña.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo trabajamos */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16">
            Cómo trabajamos
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-[#E67E0F]/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#E67E0F]">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-3">Valoración inicial</h3>
              <p className="text-muted-foreground text-sm">
                Evaluamos tu vivienda y te damos un precio de mercado realista sin compromiso.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-[#E67E0F]/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#E67E0F]">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-3">Visitas filtradas</h3>
              <p className="text-muted-foreground text-sm">
                Organizamos las visitas con compradores cualificados para evitar pérdidas de tiempo.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-[#E67E0F]/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#E67E0F]">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-3">Cierre en notaría</h3>
              <p className="text-muted-foreground text-sm">
                Te acompañamos hasta la firma, revisando toda la documentación legal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Qué incluye */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16">
            Qué incluye el servicio
          </h2>
          <div className="max-w-3xl mx-auto">
            <ul className="space-y-4">
              {[
                "Valoración profesional de tu vivienda",
                "Reportaje fotográfico de calidad",
                "Publicación en portales inmobiliarios principales",
                "Gestión y filtrado de visitas",
                "Asesoramiento legal y documentación",
                "Acompañamiento hasta la firma en notaría"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 p-4 rounded-lg border border-border">
                  <CheckCircle2 className="h-6 w-6 text-[#E67E0F] flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Condiciones y honorarios */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16">
            Condiciones y honorarios
          </h2>
          <div className="max-w-3xl mx-auto p-8 rounded-lg border-2 border-border bg-card">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-[#E67E0F] flex-shrink-0 mt-0.5" />
                <span className="text-foreground">Sin contrato de exclusividad</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-[#E67E0F] flex-shrink-0 mt-0.5" />
                <span className="text-foreground">Sin permanencia mínima</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-[#E67E0F] flex-shrink-0 mt-0.5" />
                <span className="text-foreground">Honorarios solo a éxito: 3% + IVA sobre precio de venta</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-[#E67E0F] flex-shrink-0 mt-0.5" />
                <span className="text-foreground">Presupuesto cerrado sin costes ocultos</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16">
            Preguntas frecuentes
          </h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  ¿Tengo que firmar exclusividad?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  No. Trabajamos sin exclusividad, puedes vender por tu cuenta o con otra agencia cuando quieras.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  ¿Cuánto cuesta el servicio?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Solo cobramos si vendemos: 3% + IVA sobre el precio final de venta. Sin costes iniciales ni sorpresas.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  ¿Cuánto tarda el proceso?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Depende del mercado y del precio. En promedio, una vivienda bien valorada se vende en 2-4 meses.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Formulario de valoración */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <Home className="h-12 w-12 text-[#E67E0F] mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Solicita tu valoración gratuita
              </h2>
              <p className="text-muted-foreground">
                Completa el formulario y te contactamos en menos de 24 horas
              </p>
            </div>

            {isSuccess ? (
              <div className="text-center p-8 rounded-lg border-2 border-[#E67E0F] bg-card">
                <CheckCircle2 className="h-16 w-16 text-[#E67E0F] mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">¡Gracias!</h3>
                <p className="text-muted-foreground">Te contactamos en menos de 24 horas.</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 sm:p-8 rounded-lg border border-border">
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre completo *</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu nombre" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="tu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono *</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="600 000 000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="direccion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección de la vivienda *</FormLabel>
                        <FormControl>
                          <Input placeholder="Calle, número, ciudad" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="superficie"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Superficie (m²)</FormLabel>
                          <FormControl>
                            <Input placeholder="80" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="habitaciones"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Habitaciones</FormLabel>
                          <FormControl>
                            <Input placeholder="3" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="comentarios"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comentarios adicionales</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Cuéntanos más sobre tu vivienda..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <p className="text-xs text-muted-foreground">
                    Al enviar este formulario, aceptas nuestra{" "}
                    <a href="/politica-privacidad" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                      política de privacidad
                    </a>
                    . Tus datos serán tratados conforme al RGPD.
                  </p>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#E67E0F] hover:bg-[#E67E0F]/90 text-white font-semibold text-lg py-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Quiero una valoración de venta"}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Venta;
