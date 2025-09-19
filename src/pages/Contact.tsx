import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUnifiedLeads } from "@/hooks/useUnifiedLeads";
import { sanitizeName, sanitizeEmail, sanitizeInput, validateEmail } from '@/utils/security';

const contactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Por favor, introduce un email válido"),
  phone: z.string().min(9, "El teléfono debe tener al menos 9 dígitos"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
  // Additional fields for property owners
  tipo: z.string().optional(),
  origen: z.string().optional(),
  motivo: z.string().optional(),
  municipio: z.string().optional(),
  barrio: z.string().optional(),
  direccion: z.string().optional(),
  tipoAlquiler: z.string().optional(),
  superficie: z.string().optional(),
  habitaciones: z.string().optional(),
  estado: z.string().optional()
});

type ContactForm = z.infer<typeof contactSchema>;

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchParams] = useSearchParams();
  
  const { submitLead, isSubmitting } = useUnifiedLeads({
    onSuccess: () => {
      setIsSubmitted(true);
      reset();
    }
  });
  
  // Get URL parameters
  const urlTipo = searchParams.get('tipo');
  const urlOrigen = searchParams.get('origen');
  const urlMotivo = searchParams.get('motivo');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting, touchedFields },
    reset,
    setValue,
    watch
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: {
      tipo: urlTipo || '',
      origen: urlOrigen || '',
      motivo: urlMotivo || ''
    }
  });

  // Set default values from URL parameters
  useEffect(() => {
    if (urlTipo) setValue('tipo', urlTipo);
    if (urlOrigen) setValue('origen', urlOrigen);
    if (urlMotivo) setValue('motivo', urlMotivo);
  }, [urlTipo, urlOrigen, urlMotivo, setValue]);

  const watchedFields = watch();
  const isPropertyOwner = watchedFields.tipo === 'propietario';

  const onSubmit = async (data: ContactForm) => {
    try {
      console.log('Form data:', data); // For debugging
      
      // Determine form type based on tipo field
      const origen = isPropertyOwner ? 'captacion_propietarios' : 'contacto_general';
      
      // Split name into nombre and apellidos
      const nameParts = data.name?.split(' ') || [];
      const nombre = nameParts[0] || '';
      const apellidos = nameParts.slice(1).join(' ') || '';

      await submitLead({
        origen,
        nombre,
        apellidos,
        email: data.email,
        telefono: data.phone,
        mensaje: data.message,
        ubicacion: data.municipio && data.barrio ? `${data.municipio}, ${data.barrio}` : data.municipio,
        tipo_propiedad: data.tipo === 'propietario' ? 'propiedad_existente' : undefined,
        m2: data.superficie ? parseFloat(data.superficie) : undefined,
        habitaciones: data.habitaciones ? parseInt(data.habitaciones) : undefined,
        info_adicional: data.direccion ? `Dirección: ${data.direccion}${data.tipoAlquiler ? `, Tipo: ${data.tipoAlquiler}` : ''}${data.estado ? `, Estado: ${data.estado}` : ''}` : undefined,
        acepta_politica: true, // Implied consent by form submission
        payload: data
      });

    } catch (error) {
      console.error('Contact form error:', error);
    }
  };

  const getFieldState = (fieldName: keyof ContactForm) => {
    const hasError = !!errors[fieldName];
    const isTouched = touchedFields[fieldName];
    const isValid = isTouched && !hasError;
    
    return { hasError, isValid, isTouched };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              {isPropertyOwner ? 'Contacta con Nosotros - Propietarios' : 'Contacta con Nosotros'}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              {isPropertyOwner ? 
                'Cuéntanos más sobre tu propiedad y cómo podemos ayudarte' :
                'Estamos aquí para ayudarte en todo lo que necesites'
              }
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl">Envíanos un Mensaje</CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">¡Mensaje enviado!</h3>
                      <p className="text-muted-foreground">
                        Gracias por contactarnos. Te responderemos en menos de 24 h.
                      </p>
                      <Button 
                        onClick={() => setIsSubmitted(false)}
                        variant="outline"
                        className="mt-4 min-h-[44px]"
                      >
                        Enviar otro mensaje
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        {/* Nombre */}
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium">
                            Nombre y apellidos *
                          </Label>
                          <div className="relative">
                            <Input
                              id="name"
                              {...register("name")}
                              placeholder="Introduce tu nombre completo"
                              className={cn(
                                "min-h-[44px] pr-10",
                                getFieldState("name").hasError && "border-destructive focus-visible:ring-destructive",
                                getFieldState("name").isValid && "border-green-500 focus-visible:ring-green-500"
                              )}
                            />
                            {getFieldState("name").isValid && (
                              <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                            )}
                            {getFieldState("name").hasError && (
                              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
                            )}
                          </div>
                          {errors.name && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.name.message}
                            </p>
                          )}
                        </div>

                        {/* Email */}
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
                            {getFieldState("email").hasError && (
                              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
                            )}
                          </div>
                          {errors.email && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.email.message}
                            </p>
                          )}
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-medium">
                            Teléfono *
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
                            {getFieldState("phone").hasError && (
                              <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
                            )}
                          </div>
                          {errors.phone && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.phone.message}
                            </p>
                          )}
                        </div>

                        {/* Property Owner Fields */}
                        {isPropertyOwner && (
                          <>
                            {/* Municipio */}
                            <div className="space-y-2">
                              <Label htmlFor="municipio" className="text-sm font-medium">
                                Municipio
                              </Label>
                              <Input
                                id="municipio"
                                {...register("municipio")}
                                placeholder="Ej: Barakaldo, Getxo, Bilbao..."
                                className="min-h-[44px]"
                              />
                            </div>

                            {/* Barrio/Zona */}
                            <div className="space-y-2">
                              <Label htmlFor="barrio" className="text-sm font-medium">
                                Barrio/Zona
                              </Label>
                              <Input
                                id="barrio"
                                {...register("barrio")}
                                placeholder="Ej: Indautxu, Abando, Deusto, Santutxu..."
                                className="min-h-[44px]"
                              />
                            </div>

                            {/* Dirección */}
                            <div className="space-y-2">
                              <Label htmlFor="direccion" className="text-sm font-medium">
                                Dirección
                              </Label>
                              <Input
                                id="direccion"
                                {...register("direccion")}
                                placeholder="Ej: Gran Vía Don Diego López de Haro 45"
                                className="min-h-[44px]"
                              />
                            </div>

                            {/* Tipo de alquiler */}
                            <div className="space-y-2">
                              <Label htmlFor="tipoAlquiler" className="text-sm font-medium">
                                Tipo de alquiler
                              </Label>
                              <Select onValueChange={(value) => setValue('tipoAlquiler', value)}>
                                <SelectTrigger className="min-h-[44px]">
                                  <SelectValue placeholder="Selecciona el tipo de alquiler" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="temporal">Temporal</SelectItem>
                                  <SelectItem value="larga-duracion">Larga duración</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Property details grid */}
                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="superficie" className="text-sm font-medium">
                                  Superficie (m²)
                                </Label>
                                <Input
                                  id="superficie"
                                  {...register("superficie")}
                                  placeholder="80"
                                  className="min-h-[44px]"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="habitaciones" className="text-sm font-medium">
                                  Habitaciones
                                </Label>
                                <Input
                                  id="habitaciones"
                                  {...register("habitaciones")}
                                  placeholder="2"
                                  className="min-h-[44px]"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="estado" className="text-sm font-medium">
                                  Estado
                                </Label>
                                <Select onValueChange={(value) => setValue('estado', value)}>
                                  <SelectTrigger className="min-h-[44px]">
                                    <SelectValue placeholder="Estado" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="excelente">Excelente</SelectItem>
                                    <SelectItem value="bueno">Bueno</SelectItem>
                                    <SelectItem value="reforma">A reformar</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Mensaje */}
                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-sm font-medium">
                            {isPropertyOwner ? 'Comentarios' : 'Mensaje'} *
                          </Label>
                          <div className="relative">
                            <Textarea
                              id="message"
                              {...register("message")}
                              placeholder={isPropertyOwner ? 
                                "Cuéntanos más detalles sobre tu propiedad o cualquier pregunta que tengas..." :
                                "Cuéntanos en qué podemos ayudarte..."
                              }
                              rows={4}
                              className={cn(
                                "min-h-[100px] resize-none",
                                getFieldState("message").hasError && "border-destructive focus-visible:ring-destructive",
                                getFieldState("message").isValid && "border-green-500 focus-visible:ring-green-500"
                              )}
                            />
                          </div>
                          {errors.message && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.message.message}
                            </p>
                          )}
                        </div>

                        {/* Hidden fields for tracking */}
                        <input type="hidden" {...register("tipo")} />
                        <input type="hidden" {...register("origen")} />
                        <input type="hidden" {...register("motivo")} />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full min-h-[44px] text-base font-medium"
                        disabled={isSubmitting || isFormSubmitting}
                      >
                        {(isSubmitting || isFormSubmitting) ? "Enviando..." : "Enviar Mensaje"}
                      </Button>
                      
                      <p className="text-xs text-muted-foreground text-center">
                        * Campos obligatorios
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Teléfono</h3>
                       <a 
                        href="tel:944397330" 
                        className="text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center"
                        aria-label="Llamar al 944 397 330"
                      >
                        944 397 330
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <a 
                        href="mailto:contacto@liventygestion.com" 
                        className="text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center break-all"
                        aria-label="Enviar email a contacto@liventygestion.com"
                      >
                        contacto@liventygestion.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Horario</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Lunes - Viernes: 9:00 - 18:00</p>
                        <p>Sábados: 10:00 - 14:00</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;