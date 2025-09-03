import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import professionalService from "@/assets/professional-service.jpg";

const contactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Por favor, introduce un email válido"),
  phone: z.string().min(9, "El teléfono debe tener al menos 9 dígitos"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres")
});

type ContactForm = z.infer<typeof contactSchema>;

const ContactFormSection = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    reset
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur"
  });

  const onSubmit = async (data: ContactForm) => {
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      reset();
      
      // GA4 tracking
      if (typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'form_submit', {
          location: 'home_contact',
          label: 'contacto_form',
          form_name: 'contact_form'
        });
      }
      
      toast({
        title: "¡Mensaje enviado!",
        description: "Gracias por contactarnos. Te responderemos en menos de 24 h.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const getFieldState = (fieldName: keyof ContactForm) => {
    const hasError = !!errors[fieldName];
    const isTouched = touchedFields[fieldName];
    const isValid = isTouched && !hasError;
    
    return { hasError, isValid, isTouched };
  };

  return (
    <section 
      id="contacto" 
      className="py-16 sm:py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground relative overflow-hidden scroll-mt-24"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={professionalService} 
          alt="" 
          className="w-full h-full object-cover opacity-10"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-primary-foreground">
              ¿Listo para empezar?
            </h2>
            <p className="text-lg sm:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Cuéntanos sobre tu propiedad y te contactaremos en menos de 24 horas
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl text-center">
                Solicita información sin compromiso
              </CardTitle>
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
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Tu nombre *
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

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Tu teléfono *
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Tu email *
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

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">
                      Mensaje *
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="message"
                        {...register("message")}
                        placeholder="Cuéntanos sobre tu propiedad y cómo podemos ayudarte..."
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

                  <Button 
                    type="submit" 
                    className="w-full min-h-[44px] text-base font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Solicitar información"}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    * Campos obligatorios - Te responderemos en menos de 24 horas
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;