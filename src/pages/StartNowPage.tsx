import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, AlertCircle, ArrowLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedLeads } from "@/hooks/useUnifiedLeads";

const startNowSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Por favor, introduce un email válido"),
  phone: z.string().min(9, "El teléfono debe tener al menos 9 dígitos"),
  propertyType: z.string().min(1, "Selecciona el tipo de propiedad"),
  propertyLocation: z.string().min(2, "Indica la ubicación de tu propiedad"),
  propertySize: z.string().min(1, "Indica el tamaño aproximado"),
  currentSituation: z.string().min(1, "Selecciona tu situación actual"),
  serviceInterest: z.array(z.string()).min(1, "Selecciona al menos un servicio"),
  monthlyRent: z.string().optional(),
  timeline: z.string().min(1, "Selecciona cuándo quieres empezar"),
  additionalInfo: z.string().optional(),
  hasAgreedToTerms: z.boolean().refine(val => val === true, "Debes aceptar los términos")
});

type StartNowForm = z.infer<typeof startNowSchema>;

const StartNowPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serviceInterests, setServiceInterests] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { submitLead, isSubmitting: isEmailSubmitting } = useUnifiedLeads();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, touchedFields },
    reset
  } = useForm<StartNowForm>({
    resolver: zodResolver(startNowSchema),
    mode: "onBlur"
  });

  const handleServiceInterestChange = (service: string, checked: boolean) => {
    let updatedInterests;
    if (checked) {
      updatedInterests = [...serviceInterests, service];
    } else {
      updatedInterests = serviceInterests.filter(s => s !== service);
    }
    setServiceInterests(updatedInterests);
    setValue("serviceInterest", updatedInterests);
  };

  const onSubmit = async (data: StartNowForm) => {
    try {
      // Split name into nombre and apellidos
      const nameParts = data.name?.split(' ') || [];
      const nombre = nameParts[0] || '';
      const apellidos = nameParts.slice(1).join(' ') || '';

      await submitLead({
        source: 'owners_form',
        page: '/empezar',
        persona_tipo: 'propietario',
        nombre: `${nombre} ${apellidos}`.trim(),
        email: data.email,
        telefono: data.phone,
        municipio: data.propertyLocation,
        m2: data.propertySize ? parseFloat(data.propertySize.replace(/\D/g, '')) : undefined,
        presupuesto_renta: data.monthlyRent ? parseFloat(data.monthlyRent.replace(/\D/g, '')) : undefined,
        comentarios: `Tipo: ${data.propertyType}. Situación: ${data.currentSituation}. Servicios: ${data.serviceInterest.join(', ')}. Timeline: ${data.timeline}. ${data.additionalInfo || ''}`,
        consent: data.hasAgreedToTerms
      });
      
      setIsSubmitted(true);
      reset();
      setServiceInterests([]);
      
      // GA4 tracking
      if (typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'form_submit', {
          location: 'start_now_page',
          label: 'detailed_contact_form',
          form_name: 'start_now_form'
        });
      }
      
    } catch (error) {
      console.error('Error sending form:', error);
    }
  };

  const getFieldState = (fieldName: keyof StartNowForm) => {
    const hasError = !!errors[fieldName];
    const isTouched = touchedFields[fieldName];
    const isValid = isTouched && !hasError;
    
    return { hasError, isValid, isTouched };
  };

  const services = [
    { id: "gestion-completa", label: "Gestión completa de alquiler" },
    { id: "seleccion-inquilinos", label: "Selección de inquilinos" },
    { id: "contratos", label: "Elaboración de contratos" },
    { id: "mantenimiento", label: "Mantenimiento y reparaciones" },
    { id: "gestion-pagos", label: "Gestión de cobros" },
    { id: "asesoria-legal", label: "Asesoría legal" },
    { id: "otros", label: "Otros servicios" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section con imagen de fondo */}
      <section className="relative h-[350px] sm:h-[400px] lg:h-[500px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ 
            backgroundImage: 'url(/src/assets/hero-modern-property.jpg)',
          }}
        />
        
        {/* Overlay degradado */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800/85 via-slate-700/70 to-white" />
        
        {/* Contenido del Hero */}
        <div className="relative container mx-auto px-4 sm:px-6 h-full flex flex-col justify-start items-center text-center pt-[60px] sm:pt-[70px] lg:pt-[80px] pb-[80px] sm:pb-[90px] lg:pb-[120px]">
          {/* Botón Volver */}
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 text-white hover:text-white hover:bg-white/10 self-start"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Button>
          
          {/* Icono y títulos */}
          <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-full mb-6">
            <Home className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white drop-shadow-lg">
            Empezar con Liventy Gestión
          </h1>
          <p className="text-lg sm:text-xl text-white/95 max-w-2xl mx-auto drop-shadow">
            Cuéntanos sobre tu propiedad y necesidades para ofrecerte la mejor solución personalizada
          </p>
        </div>
      </section>

      <main className="relative container mx-auto px-4 sm:px-6 -mt-8 sm:-mt-12 lg:-mt-16 pb-16 bg-gradient-to-b from-transparent via-background to-background">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl text-center">
                Formulario detallado de contacto
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Completa la información para recibir un presupuesto personalizado
              </p>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold mb-4">¡Solicitud recibida!</h3>
                  <p className="text-muted-foreground mb-6 text-lg">
                    Gracias por confiar en nosotros. Nuestro equipo revisará tu información y te contactará 
                    en las próximas 2 horas para ofrecerte la mejor solución para tu propiedad.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="min-h-[44px]"
                    >
                      Enviar otra solicitud
                    </Button>
                    <Button 
                      onClick={() => navigate('/')}
                      className="min-h-[44px]"
                    >
                      Volver al inicio
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Información Personal */}
                  <div className="space-y-6">
                    <h3 className="text-xl sm:text-2xl font-semibold text-primary border-b pb-2">
                      1. Información personal
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Nombre completo *
                        </Label>
                        <div className="relative">
                          <Input
                            id="name"
                            {...register("name")}
                            placeholder="Tu nombre y apellidos"
                            className={cn(
                              "min-h-[44px] pr-10",
                              getFieldState("name").hasError && "border-destructive focus-visible:ring-destructive",
                              getFieldState("name").isValid && "border-green-500 focus-visible:ring-green-500"
                            )}
                          />
                          {getFieldState("name").isValid && (
                            <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                          )}
                        </div>
                        {errors.name && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Teléfono de contacto *
                        </Label>
                        <div className="relative">
                          <Input
                            id="phone"
                            type="tel"
                            {...register("phone")}
                            placeholder="+34 688 123 456"
                            className={cn(
                              "min-h-[44px] pr-10",
                              getFieldState("phone").hasError && "border-destructive focus-visible:ring-destructive",
                              getFieldState("phone").isValid && "border-green-500 focus-visible:ring-green-500"
                            )}
                          />
                          {getFieldState("phone").isValid && (
                            <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                          )}
                        </div>
                        {errors.phone && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email *
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          placeholder="propietario@liventygestion.com"
                          className={cn(
                            "min-h-[44px] pr-10",
                            getFieldState("email").hasError && "border-destructive focus-visible:ring-destructive",
                            getFieldState("email").isValid && "border-green-500 focus-visible:ring-green-500"
                          )}
                        />
                        {getFieldState("email").isValid && (
                          <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                      </div>
                      {errors.email && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Información de la Propiedad */}
                  <div className="space-y-6">
                    <h3 className="text-xl sm:text-2xl font-semibold text-primary border-b pb-2">
                      2. Información de tu propiedad
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="propertyType" className="text-sm font-medium">
                          Tipo de propiedad *
                        </Label>
                        <Select onValueChange={(value) => setValue("propertyType", value)}>
                          <SelectTrigger className="min-h-[44px]">
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="piso">Piso</SelectItem>
                            <SelectItem value="casa">Casa</SelectItem>
                            <SelectItem value="estudio">Estudio</SelectItem>
                            <SelectItem value="duplex">Dúplex</SelectItem>
                            <SelectItem value="atico">Ático</SelectItem>
                            <SelectItem value="local">Local comercial</SelectItem>
                            <SelectItem value="otros">Otros</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.propertyType && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.propertyType.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="propertySize" className="text-sm font-medium">
                          Tamaño aproximado *
                        </Label>
                        <Select onValueChange={(value) => setValue("propertySize", value)}>
                          <SelectTrigger className="min-h-[44px]">
                            <SelectValue placeholder="Selecciona el tamaño" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="menos-40">Menos de 40 m²</SelectItem>
                            <SelectItem value="40-60">40-60 m²</SelectItem>
                            <SelectItem value="60-80">60-80 m²</SelectItem>
                            <SelectItem value="80-100">80-100 m²</SelectItem>
                            <SelectItem value="100-150">100-150 m²</SelectItem>
                            <SelectItem value="mas-150">Más de 150 m²</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.propertySize && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.propertySize.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="propertyLocation" className="text-sm font-medium">
                        Ubicación de la propiedad *
                      </Label>
                      <Input
                        id="propertyLocation"
                        {...register("propertyLocation")}
                        placeholder="Ej: Bilbao, Getxo, Barakaldo..."
                        className="min-h-[44px]"
                      />
                      {errors.propertyLocation && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.propertyLocation.message}
                        </p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentSituation" className="text-sm font-medium">
                          Situación actual *
                        </Label>
                        <Select onValueChange={(value) => setValue("currentSituation", value)}>
                          <SelectTrigger className="min-h-[44px]">
                            <SelectValue placeholder="¿Cómo está ahora?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vacia">Vacía, lista para alquilar</SelectItem>
                            <SelectItem value="ocupada-propietario">Ocupada por mí</SelectItem>
                            <SelectItem value="ocupada-inquilino">Con inquilino actual</SelectItem>
                            <SelectItem value="reforma">En proceso de reforma</SelectItem>
                            <SelectItem value="nueva">Propiedad nueva</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.currentSituation && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.currentSituation.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="monthlyRent" className="text-sm font-medium">
                          Precio de alquiler esperado (opcional)
                        </Label>
                        <Input
                          id="monthlyRent"
                          {...register("monthlyRent")}
                          placeholder="Ej: 1.100 €/mes"
                          className="min-h-[44px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Servicios de Interés */}
                  <div className="space-y-6">
                    <h3 className="text-xl sm:text-2xl font-semibold text-primary border-b pb-2">
                      3. Servicios de interés *
                    </h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      {services.map((service) => (
                        <div key={service.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={service.id}
                            checked={serviceInterests.includes(service.id)}
                            onCheckedChange={(checked) => handleServiceInterestChange(service.id, checked as boolean)}
                          />
                          <Label htmlFor={service.id} className="text-sm cursor-pointer">
                            {service.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.serviceInterest && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.serviceInterest.message}
                      </p>
                    )}
                  </div>

                  {/* Cronología */}
                  <div className="space-y-6">
                    <h3 className="text-xl sm:text-2xl font-semibold text-primary border-b pb-2">
                      4. Cronología
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timeline" className="text-sm font-medium">
                        ¿Cuándo te gustaría empezar? *
                      </Label>
                      <Select onValueChange={(value) => setValue("timeline", value)}>
                        <SelectTrigger className="min-h-[44px]">
                          <SelectValue placeholder="Selecciona cuándo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inmediato">Inmediatamente</SelectItem>
                          <SelectItem value="1-mes">En el próximo mes</SelectItem>
                          <SelectItem value="2-3-meses">En 2-3 meses</SelectItem>
                          <SelectItem value="mas-3-meses">Más de 3 meses</SelectItem>
                          <SelectItem value="solo-info">Solo quiero información</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.timeline && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.timeline.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="additionalInfo" className="text-sm font-medium">
                        Información adicional (opcional)
                      </Label>
                      <Textarea
                        id="additionalInfo"
                        {...register("additionalInfo")}
                        placeholder="Cuéntanos cualquier detalle adicional que consideres importante..."
                        rows={4}
                        className="min-h-[100px] resize-none"
                      />
                    </div>
                  </div>

                  {/* Términos y condiciones */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="hasAgreedToTerms"
                        checked={watch("hasAgreedToTerms") || false}
                        onCheckedChange={(checked) => setValue("hasAgreedToTerms", Boolean(checked))}
                        className="mt-1"
                      />
                      <Label htmlFor="hasAgreedToTerms" className="text-sm cursor-pointer leading-relaxed">
                        Acepto el tratamiento de mis datos para recibir información comercial y acepto la{" "}
                        <button
                          type="button"
                          onClick={() => navigate('/politica-privacidad')}
                          className="text-primary hover:underline"
                        >
                          política de privacidad
                        </button>
                        . *
                      </Label>
                    </div>
                    {errors.hasAgreedToTerms && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.hasAgreedToTerms.message}
                      </p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full min-h-[52px] text-lg font-medium"
                    disabled={isEmailSubmitting}
                  >
                    {isEmailSubmitting ? "Enviando solicitud..." : "Enviar solicitud detallada"}
                  </Button>
                  
                  <p className="text-sm text-muted-foreground text-center">
                    * Campos obligatorios - Nos pondremos en contacto contigo en las próximas 2 horas
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default StartNowPage;