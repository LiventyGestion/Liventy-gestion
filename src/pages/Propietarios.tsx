import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  CheckCircle, 
  Shield, 
  FileText, 
  BarChart3, 
  Calendar,
  ArrowRight,
  Home
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGA4Tracking } from "@/hooks/useGA4Tracking";
import { useUnifiedLeads, validateSpanishPhone } from "@/hooks/useUnifiedLeads";

const formSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  telefono: z.string().trim().min(9, "Teléfono inválido").max(20).refine(
    (val) => validateSpanishPhone(val),
    "El teléfono debe ser un número español válido de 9 dígitos"
  ),
  municipio: z.string().trim().min(2, "Introduce el municipio").max(100),
  barrio: z.string().trim().max(100).optional(),
  m2: z.string().trim().optional(),
  habitaciones: z.string().trim().optional(),
  estado_vivienda: z.enum(["Reformado", "Buen estado", "A actualizar", "Obra nueva"]).optional(),
  fecha_disponible: z.string().optional(),
  comentarios: z.string().trim().max(1000).optional(),
  consent: z.boolean().refine(val => val === true, "Debes aceptar la política de privacidad")
});

type FormData = z.infer<typeof formSchema>;

const Propietarios = () => {
  const navigate = useNavigate();
  const { trackEmpiezaAhora } = useGA4Tracking();
  const { submitLead, isSubmitting } = useUnifiedLeads();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      municipio: "",
      barrio: "",
      m2: "",
      habitaciones: "",
      estado_vivienda: undefined,
      fecha_disponible: "",
      comentarios: "",
      consent: false
    }
  });

  const onSubmit = async (data: FormData) => {
    await submitLead({
      source: 'owners_form',
      page: '/propietarios',
      persona_tipo: 'propietario',
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      municipio: data.municipio,
      barrio: data.barrio || undefined,
      m2: data.m2 ? parseFloat(data.m2) : undefined,
      habitaciones: data.habitaciones ? parseInt(data.habitaciones) : undefined,
      estado_vivienda: data.estado_vivienda,
      fecha_disponible: data.fecha_disponible || undefined,
      comentarios: data.comentarios || undefined,
      consent: data.consent
    });
    
    setIsSuccess(true);
    form.reset();
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'submit_propietarios_form', {
        event_category: 'propietarios',
        event_label: 'Formulario propietarios completo',
      });
    }
  };

  const handleEmpiezaAhora = (location: string, destination: string) => {
    trackEmpiezaAhora(location, destination);
    navigate(destination);
  };

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
                  onClick={() => {
                    const formSection = document.getElementById('formulario-propietarios');
                    formSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
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
                  onClick={() => {
                    const formSection = document.getElementById('formulario-propietarios');
                    formSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
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

      {/* FORMULARIO */}
      <section id="formulario-propietarios" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <Home className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Cuéntanos sobre tu propiedad
              </h2>
              <p className="text-muted-foreground">
                Completa el formulario y te contactamos en menos de 24 horas con una propuesta personalizada
              </p>
            </div>

            {isSuccess ? (
              <div className="text-center p-8 rounded-lg border-2 border-primary bg-card">
                <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">¡Gracias!</h3>
                <p className="text-muted-foreground">Te contactamos en menos de 24 horas con una propuesta adaptada a tu vivienda.</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 sm:p-8 rounded-lg border border-border shadow-sm">
                  
                  {/* Datos de contacto */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">Datos de contacto</h3>
                    
                    <FormField
                      control={form.control}
                      name="nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre completo *</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu nombre y apellidos" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
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
                    </div>
                  </div>

                  {/* Datos del inmueble */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">Datos del inmueble</h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="municipio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Municipio *</FormLabel>
                            <FormControl>
                              <Input placeholder="Bilbao, Getxo, Barakaldo..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="barrio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Barrio</FormLabel>
                            <FormControl>
                              <Input placeholder="Deusto, Algorta, Santutxu..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="m2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Superficie (m²)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="80" {...field} />
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
                              <Input type="number" placeholder="3" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="estado_vivienda"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado de la vivienda</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona estado" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Obra nueva">Obra nueva</SelectItem>
                                <SelectItem value="Reformado">Reformado</SelectItem>
                                <SelectItem value="Buen estado">Buen estado</SelectItem>
                                <SelectItem value="A actualizar">A actualizar</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fecha_disponible"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha disponible</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Comentarios */}
                  <FormField
                    control={form.control}
                    name="comentarios"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comentarios adicionales</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Cuéntanos más sobre tu vivienda, tus expectativas o cualquier detalle relevante..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Consentimiento */}
                  <FormField
                    control={form.control}
                    name="consent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/30">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            Acepto la{" "}
                            <a href="/politica-privacidad" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                              política de privacidad
                            </a>
                            {" "}y el tratamiento de mis datos conforme al RGPD para recibir información sobre los servicios de Liventy Gestión. *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg py-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Solicitar propuesta personalizada"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            ¿Prefieres que te llamemos?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contacta con nosotros directamente y te asesoramos sin compromiso
          </p>
          <Button 
            size="lg" 
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8"
            onClick={() => handleEmpiezaAhora('propietarios_cta_final', '/contacto')}
          >
            Contactar ahora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Propietarios;
