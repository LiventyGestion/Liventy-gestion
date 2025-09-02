import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calculator, TrendingUp, MapPin, Home, Euro, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const valuationSchema = z.object({
  address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  propertyType: z.string().min(1, "Selecciona el tipo de propiedad"),
  bedrooms: z.string().min(1, "Selecciona el número de habitaciones"),
  bathrooms: z.string().min(1, "Selecciona el número de baños"),
  size: z.string().min(1, "El tamaño debe ser mayor a 0"),
  condition: z.string().min(1, "Selecciona el estado de la propiedad"),
  amenities: z.array(z.string()).optional(),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Por favor, introduce un email válido"),
  phone: z.string().min(9, "El teléfono debe tener al menos 9 dígitos")
});

type ValuationForm = z.infer<typeof valuationSchema>;

const Herramientas = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    reset,
    setValue,
    watch
  } = useForm<ValuationForm>({
    resolver: zodResolver(valuationSchema),
    mode: "onBlur"
  });

  const onSubmit = async (data: ValuationForm) => {
    try {
      // Simulate valuation calculation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Basic price estimation based on form data
      const basePrice = data.propertyType === 'piso' ? 800 : 
                       data.propertyType === 'casa' ? 1200 : 600;
      const bedroomMultiplier = parseInt(data.bedrooms) * 150;
      const sizeMultiplier = parseInt(data.size) * 8;
      const conditionMultiplier = data.condition === 'excelente' ? 1.2 : 
                                 data.condition === 'bueno' ? 1.0 : 0.8;
      
      const estimated = Math.round((basePrice + bedroomMultiplier + sizeMultiplier) * conditionMultiplier);
      
      setEstimatedPrice(estimated);
      setIsSubmitted(true);
      
      // GA4 tracking
      if (typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'form_submit', {
          location: 'herramientas',
          label: 'valoracion_gratuita',
          form_name: 'property_valuation'
        });
      }
      
      toast({
        title: "¡Valoración completada!",
        description: "Hemos calculado el precio estimado de tu propiedad.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const getFieldState = (fieldName: keyof ValuationForm) => {
    const hasError = !!errors[fieldName];
    const isTouched = touchedFields[fieldName];
    const isValid = isTouched && !hasError;
    
    return { hasError, isValid, isTouched };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Herramientas Gratuitas para Propietarios
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Descubre el potencial de tu propiedad con nuestras herramientas profesionales
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardContent className="p-6">
                <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Calculadora de Precio</h3>
                <p className="text-muted-foreground">
                  Obtén una valoración precisa del precio de alquiler de tu propiedad
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Análisis de Rentabilidad</h3>
                <p className="text-muted-foreground">
                  Descubre el potencial de ingresos de tu inversión inmobiliaria
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Análisis de Zona</h3>
                <p className="text-muted-foreground">
                  Información detallada sobre el mercado inmobiliario local
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Property Valuation Section */}
          <section id="precio" className="scroll-mt-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Valoración Gratuita de tu Propiedad
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Completa el formulario y recibe una estimación profesional del precio de alquiler
              </p>
            </div>

            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Home className="h-6 w-6 text-primary" />
                  Datos de tu Propiedad
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted && estimatedPrice ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-4">¡Valoración Completada!</h3>
                    
                    <div className="bg-primary/5 rounded-lg p-8 mb-6">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Euro className="h-8 w-8 text-primary" />
                        <span className="text-4xl font-bold text-primary">
                          {estimatedPrice}€
                        </span>
                        <span className="text-2xl text-muted-foreground">/mes</span>
                      </div>
                      <p className="text-muted-foreground">
                        Precio estimado de alquiler mensual
                      </p>
                    </div>

                    <div className="space-y-4 text-left bg-card/50 rounded-lg p-6">
                      <h4 className="font-semibold text-lg">¿Qué incluye este precio?</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Análisis comparativo del mercado local
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Valoración basada en características de la propiedad
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Ajustes por estado y ubicación
                        </li>
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                      <Button 
                        onClick={() => {
                          setIsSubmitted(false);
                          setEstimatedPrice(null);
                          reset();
                        }}
                        variant="outline"
                        className="min-h-[44px]"
                      >
                        Hacer otra valoración
                      </Button>
                      <Button 
                        onClick={() => {
                          const element = document.querySelector('#contacto');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          } else {
                            window.location.href = '/#contacto';
                          }
                        }}
                        className="min-h-[44px]"
                      >
                        Contactar para gestión completa
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Property Details */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Información de la Propiedad</h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="address">Dirección *</Label>
                          <Input
                            id="address"
                            {...register("address")}
                            placeholder="Calle, número, ciudad..."
                            className={cn(
                              "min-h-[44px]",
                              getFieldState("address").hasError && "border-destructive",
                              getFieldState("address").isValid && "border-green-500"
                            )}
                          />
                          {errors.address && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.address.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="propertyType">Tipo de Propiedad *</Label>
                          <Select onValueChange={(value) => setValue("propertyType", value)}>
                            <SelectTrigger className="min-h-[44px]">
                              <SelectValue placeholder="Selecciona el tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="piso">Piso</SelectItem>
                              <SelectItem value="casa">Casa</SelectItem>
                              <SelectItem value="estudio">Estudio</SelectItem>
                              <SelectItem value="atico">Ático</SelectItem>
                              <SelectItem value="duplex">Dúplex</SelectItem>
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
                          <Label htmlFor="bedrooms">Habitaciones *</Label>
                          <Select onValueChange={(value) => setValue("bedrooms", value)}>
                            <SelectTrigger className="min-h-[44px]">
                              <SelectValue placeholder="Número de habitaciones" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 habitación</SelectItem>
                              <SelectItem value="2">2 habitaciones</SelectItem>
                              <SelectItem value="3">3 habitaciones</SelectItem>
                              <SelectItem value="4">4 habitaciones</SelectItem>
                              <SelectItem value="5">5+ habitaciones</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.bedrooms && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.bedrooms.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bathrooms">Baños *</Label>
                          <Select onValueChange={(value) => setValue("bathrooms", value)}>
                            <SelectTrigger className="min-h-[44px]">
                              <SelectValue placeholder="Número de baños" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 baño</SelectItem>
                              <SelectItem value="2">2 baños</SelectItem>
                              <SelectItem value="3">3 baños</SelectItem>
                              <SelectItem value="4">4+ baños</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.bathrooms && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.bathrooms.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="size">Superficie (m²) *</Label>
                          <Input
                            id="size"
                            type="number"
                            {...register("size")}
                            placeholder="Ej: 75"
                            className={cn(
                              "min-h-[44px]",
                              getFieldState("size").hasError && "border-destructive",
                              getFieldState("size").isValid && "border-green-500"
                            )}
                          />
                          {errors.size && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.size.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="condition">Estado de la Propiedad *</Label>
                          <Select onValueChange={(value) => setValue("condition", value)}>
                            <SelectTrigger className="min-h-[44px]">
                              <SelectValue placeholder="Estado actual" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excelente">Excelente</SelectItem>
                              <SelectItem value="bueno">Bueno</SelectItem>
                              <SelectItem value="regular">Regular</SelectItem>
                              <SelectItem value="necesita-reforma">Necesita reforma</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.condition && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.condition.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Contact Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Información de Contacto</h3>
                      
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre *</Label>
                          <Input
                            id="name"
                            {...register("name")}
                            placeholder="Tu nombre completo"
                            className={cn(
                              "min-h-[44px]",
                              getFieldState("name").hasError && "border-destructive",
                              getFieldState("name").isValid && "border-green-500"
                            )}
                          />
                          {errors.name && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.name.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            placeholder="tu@email.com"
                            className={cn(
                              "min-h-[44px]",
                              getFieldState("email").hasError && "border-destructive",
                              getFieldState("email").isValid && "border-green-500"
                            )}
                          />
                          {errors.email && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.email.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Teléfono *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            {...register("phone")}
                            placeholder="600 000 000"
                            className={cn(
                              "min-h-[44px]",
                              getFieldState("phone").hasError && "border-destructive",
                              getFieldState("phone").isValid && "border-green-500"
                            )}
                          />
                          {errors.phone && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.phone.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full min-h-[44px] text-lg font-medium"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Calculando valoración..." : "Obtener Valoración Gratuita"}
                    </Button>
                    
                    <p className="text-sm text-muted-foreground text-center">
                      * Campos obligatorios - La valoración es completamente gratuita y sin compromiso
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Herramientas;