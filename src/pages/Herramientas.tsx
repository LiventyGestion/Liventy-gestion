import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useSearchParams } from "react-router-dom";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, TrendingUp, BarChart3, Home, Euro, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/herramientas-hero-bg.jpg";

// Schemas for each calculator
const precioSchema = z.object({
  barrio: z.string().min(2, "Introduce el barrio"),
  metros: z.string().min(1, "Introduce los metros cuadrados"),
  habitaciones: z.string().min(1, "Selecciona las habitaciones"),
  banos: z.string().min(1, "Selecciona los baños"),
  estado: z.string().min(1, "Selecciona el estado"),
  email: z.string().email("Email inválido").optional().or(z.literal(""))
});

const rentabilidadSchema = z.object({
  ingresosMensuales: z.string().min(1, "Introduce los ingresos mensuales"),
  gastosMensuales: z.string().min(1, "Introduce los gastos mensuales"),
  comision: z.string().min(1, "Introduce la comisión"),
  diasVacios: z.string().min(1, "Introduce días vacíos anuales"),
  email: z.string().email("Email inválido").optional().or(z.literal(""))
});

const comparadorSchema = z.object({
  precioCompra: z.string().min(1, "Introduce el precio de compra"),
  alquilerLargo: z.string().min(1, "Introduce alquiler largo plazo"),
  alquilerTemporal: z.string().min(1, "Introduce alquiler temporal"),
  ocupacionTemporal: z.string().min(1, "Introduce ocupación temporal"),
  gastosLargo: z.string().min(1, "Introduce gastos largo plazo"),
  gastosTemporal: z.string().min(1, "Introduce gastos temporal"),
  email: z.string().email("Email inválido").optional().or(z.literal(""))
});

type PrecioForm = z.infer<typeof precioSchema>;
type RentabilidadForm = z.infer<typeof rentabilidadSchema>;
type ComparadorForm = z.infer<typeof comparadorSchema>;

const Herramientas = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { scrollToCalculator } = useScrollRestoration();
  
  // SEO Meta tags
  useEffect(() => {
    document.title = "Herramientas para propietarios | Calcula tu rentabilidad | Liventy Gestión";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Calcula el precio ideal, la rentabilidad de tu vivienda y compara opciones. Herramientas interactivas y visuales de Liventy Gestión.');
    }
    
    // GA4 page view event
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'page_view', { 
        page_title: 'Herramientas',
        page_path: '/herramientas'
      });
    }
  }, []);
  
  // Estado único para controlar qué calculadora está abierta
  const [openCalc, setOpenCalc] = useState<"precio" | "rentabilidad" | "comparador" | null>(null);
  
  // Función para alternar calculadoras
  const toggleCalculator = (calcType: "precio" | "rentabilidad" | "comparador") => {
    const isOpening = openCalc !== calcType;
    
    setOpenCalc(prev => prev === calcType ? null : calcType);
    
    // Si estamos abriendo una calculadora, hacer scroll a su sección
    if (isOpening) {
      setTimeout(() => {
        const calculatorId = `#calc-${calcType}`;
        scrollToCalculator(calculatorId);
      }, 100);
    }
    // Si estamos cerrando, no hacer scroll (mantener posición actual)
  };

  // Efecto para abrir calculadora automáticamente basado en query params
  useEffect(() => {
    const calcParam = searchParams.get('calc');
    if (calcParam && (calcParam === 'precio' || calcParam === 'rentabilidad' || calcParam === 'comparador')) {
      setOpenCalc(calcParam);
      
      // Scroll to the calculator section after it opens
      setTimeout(() => {
        const calculatorId = `#calc-${calcParam}`;
        scrollToCalculator(calculatorId);
      }, 200);
    }
  }, [searchParams, scrollToCalculator]);
  
  // Estados para cada calculadora
  const [precioResult, setPrecioResult] = useState<{ min: number; max: number; recomendado: number } | null>(null);
  const [rentabilidadResult, setRentabilidadResult] = useState<{ cashflow: number; rentabilidad: number } | null>(null);
  const [comparadorResult, setComparadorResult] = useState<{ largo: number; temporal: number; recomendacion: string } | null>(null);

  // Forms para cada calculadora
  const precioForm = useForm<PrecioForm>({
    resolver: zodResolver(precioSchema),
    mode: "onBlur"
  });

  const rentabilidadForm = useForm<RentabilidadForm>({
    resolver: zodResolver(rentabilidadSchema),
    mode: "onBlur"
  });

  const comparadorForm = useForm<ComparadorForm>({
    resolver: zodResolver(comparadorSchema),
    mode: "onBlur"
  });

  // Función para guardar en base de datos
  const saveCalculatorResult = async (toolType: string, inputs: any, outputs: any, email?: string) => {
    try {
      // Guardar resultado en calculadora_resultados
      const { error: calcError } = await supabase
        .from('calculadora_resultados' as any)
        .insert({
          tool_type: toolType,
          inputs,
          outputs,
          email: email || null,
          user_id: null
        });

      if (calcError) {
        console.error('Error saving calculator result:', calcError);
      }

      // Si hay email, crear lead en tabla unificada Leads
      if (email) {
        const urlParams = new URLSearchParams(window.location.search);
        
        const { error: leadError } = await supabase
          .from('Leads' as any)
          .insert({
            source: 'contact_form',
            page: '/herramientas',
            persona_tipo: 'propietario',
            email: email.trim().toLowerCase(),
            comentarios: `Uso de herramienta: ${toolType}. Resultado: ${JSON.stringify(outputs)}`,
            utm_source: urlParams.get('utm_source') || null,
            utm_medium: urlParams.get('utm_medium') || null,
            utm_campaign: urlParams.get('utm_campaign') || null,
            consent: true, // User provided email voluntarily
            status: 'new'
          });

        if (leadError) {
          console.error('Error saving lead:', leadError);
        }
      }
    } catch (error) {
      console.error('Error saving calculator result:', error);
    }
  };

  // Submit handlers
  const onSubmitPrecio = async (data: PrecioForm) => {
    try {
      // Simular cálculo
      const metros = parseInt(data.metros);
      const base = metros * 12;
      const habitacionesMultiplier = parseInt(data.habitaciones) * 50;
      const estadoMultiplier = data.estado === 'excelente' ? 1.2 : data.estado === 'bueno' ? 1.0 : 0.8;
      
      const recomendado = Math.round((base + habitacionesMultiplier) * estadoMultiplier);
      const min = Math.round(recomendado * 0.85);
      const max = Math.round(recomendado * 1.15);

      const result = { min, max, recomendado };
      setPrecioResult(result);

      // Guardar en BD
      await saveCalculatorResult('precio', data, result, data.email);

      // GA4
      if (typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'calc_submit', { tool: 'precio' });
      }

      toast({
        title: "¡Cálculo completado!",
        description: "Hemos calculado el precio recomendado para tu propiedad."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  const onSubmitRentabilidad = async (data: RentabilidadForm) => {
    try {
      const ingresos = parseFloat(data.ingresosMensuales);
      const gastos = parseFloat(data.gastosMensuales);
      const comision = parseFloat(data.comision) / 100;
      const diasVacios = parseInt(data.diasVacios);
      
      const ingresosAnuales = (ingresos * 12) * (1 - diasVacios / 365);
      const gastosAnuales = gastos * 12;
      const comisionAnual = ingresosAnuales * comision;
      
      const cashflow = Math.round((ingresosAnuales - gastosAnuales - comisionAnual) / 12);
      const rentabilidad = Math.round(((ingresosAnuales - gastosAnuales - comisionAnual) / (ingresos * 12)) * 100);

      const result = { cashflow, rentabilidad };
      setRentabilidadResult(result);

      await saveCalculatorResult('rentabilidad', data, result, data.email);

      if (typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'calc_submit', { tool: 'rentabilidad' });
      }

      toast({
        title: "¡Análisis completado!",
        description: "Hemos calculado la rentabilidad de tu inversión."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  const onSubmitComparador = async (data: ComparadorForm) => {
    try {
      const precioCompra = parseFloat(data.precioCompra);
      const alquilerLargo = parseFloat(data.alquilerLargo);
      const alquilerTemporal = parseFloat(data.alquilerTemporal);
      const ocupacion = parseFloat(data.ocupacionTemporal) / 100;
      const gastosLargo = parseFloat(data.gastosLargo);
      const gastosTemporal = parseFloat(data.gastosTemporal);

      const ingresoLargo = (alquilerLargo - gastosLargo) * 12;
      const ingresoTemporal = (alquilerTemporal * ocupacion - gastosTemporal) * 12;
      
      const rentabilidadLargo = (ingresoLargo / precioCompra) * 100;
      const rentabilidadTemporal = (ingresoTemporal / precioCompra) * 100;

      const recomendacion = rentabilidadTemporal > rentabilidadLargo 
        ? "Te conviene más el alquiler temporal" 
        : "Te conviene más el alquiler de larga duración";

      const result = { 
        largo: Math.round(rentabilidadLargo), 
        temporal: Math.round(rentabilidadTemporal), 
        recomendacion 
      };
      setComparadorResult(result);

      await saveCalculatorResult('comparador', data, result, data.email);

      if (typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'calc_submit', { tool: 'comparador' });
      }

      toast({
        title: "¡Comparación completada!",
        description: "Hemos analizado qué modalidad te conviene más."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section with Background Image */}
        <section className="relative h-[500px] flex items-center justify-center overflow-hidden mb-16">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroBg})`,
              filter: 'brightness(0.5)'
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/5" />
          
          {/* Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              Herramientas inteligentes para propietarios
            </h1>
            <p className="text-xl sm:text-2xl text-white/95 leading-relaxed mb-8 drop-shadow-md">
              Calcula tu rentabilidad, compara opciones y descubre el potencial de tu vivienda
            </p>
            
            {/* Icon Row */}
            <div className="flex justify-center gap-8 mt-12">
              <div className="group cursor-pointer transition-transform hover:scale-110 duration-200">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30">
                  <Euro className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="group cursor-pointer transition-transform hover:scale-110 duration-200">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="group cursor-pointer transition-transform hover:scale-110 duration-200">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30">
                  <BarChart3 className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6">{/* Breadcrumb moved inside container */}
        <nav aria-label="breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Inicio</Link></li>
            <li><ChevronDown className="h-4 w-4 rotate-[-90deg]" /></li>
            <li aria-current="page" className="text-foreground">Herramientas</li>
          </ol>
        </nav>

        {/* Grid de 3 tarjetas - Modern Glass Design */}
        <section className="mb-20">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Precio Card */}
            <div 
              className="group relative overflow-hidden rounded-[24px] border border-border bg-gradient-to-br from-white to-neutral-50 hover:shadow-[0_10px_40px_rgba(230,126,15,0.15)] transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              onClick={() => toggleCalculator("precio")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardContent className="relative p-10 text-center">
                {/* Animated Icon Container */}
                <div className="relative mb-6 mx-auto w-20 h-20 flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform duration-300" />
                  <Euro className="relative h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-foreground">Precio recomendado</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Descubre el rango óptimo para publicar tu propiedad
                </p>
                
                <Button 
                  onClick={(e) => { e.stopPropagation(); toggleCalculator("precio"); }} 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                  aria-expanded={openCalc === "precio"}
                  size="lg"
                >
                  Calcular ahora
                </Button>
              </CardContent>
            </div>

            {/* Rentabilidad Card */}
            <div 
              className="group relative overflow-hidden rounded-[24px] border border-border bg-gradient-to-br from-white to-neutral-50 hover:shadow-[0_10px_40px_rgba(230,126,15,0.15)] transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              onClick={() => toggleCalculator("rentabilidad")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardContent className="relative p-10 text-center">
                <div className="relative mb-6 mx-auto w-20 h-20 flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform duration-300" />
                  <TrendingUp className="relative h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-foreground">Rentabilidad neta</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Conoce tu cashflow mensual y ROI anual real
                </p>
                
                <Button 
                  onClick={(e) => { e.stopPropagation(); toggleCalculator("rentabilidad"); }} 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                  aria-expanded={openCalc === "rentabilidad"}
                  size="lg"
                >
                  Calcular ahora
                </Button>
              </CardContent>
            </div>

            {/* Comparador Card */}
            <div 
              className="group relative overflow-hidden rounded-[24px] border border-border bg-gradient-to-br from-white to-neutral-50 hover:shadow-[0_10px_40px_rgba(230,126,15,0.15)] transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              onClick={() => toggleCalculator("comparador")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardContent className="relative p-10 text-center">
                <div className="relative mb-6 mx-auto w-20 h-20 flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform duration-300" />
                  <BarChart3 className="relative h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-foreground">Larga vs. Temporal</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Compara y elige la mejor modalidad para ti
                </p>
                
                <Button 
                  onClick={(e) => { e.stopPropagation(); toggleCalculator("comparador"); }} 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                  aria-expanded={openCalc === "comparador"}
                  size="lg"
                >
                  Comparar ahora
                </Button>
              </CardContent>
            </div>
          </div>
        </section>

        {/* Sección #precio */}
        {openCalc === "precio" && (
          <div className="animate-fade-in transition-all duration-300 ease-out">
          <section id="calc-precio" className="scroll-mt-24 mb-20">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Calculadora de Precio</h2>
                <p className="text-lg text-muted-foreground">
                  Obtén el rango óptimo de precio para publicar tu propiedad
                </p>
              </div>

              <Card>
                <CardContent className="p-8">
                  {precioResult ? (
                    <div className="text-center">
                      <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold mb-6">¡Resultado calculado!</h3>
                      
                      <div className="bg-primary/5 rounded-lg p-8 mb-8">
                        <div className="grid md:grid-cols-3 gap-6 text-center">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Mínimo</div>
                            <div className="text-2xl font-bold text-primary">{precioResult.min}€</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Recomendado</div>
                            <div className="text-3xl font-bold text-primary">{precioResult.recomendado}€</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Máximo</div>
                            <div className="text-2xl font-bold text-primary">{precioResult.max}€</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild>
                          <Link to="/propietarios#form">Publicad mi piso</Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to="/propietarios#form?tipo=valoracion">Quiero una valoración completa</Link>
                        </Button>
                      </div>

                      <Button 
                        variant="ghost" 
                        onClick={() => setPrecioResult(null)}
                        className="mt-4"
                      >
                        Calcular otra propiedad
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={precioForm.handleSubmit(onSubmitPrecio)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="barrio">Barrio *</Label>
                          <Input
                            id="barrio"
                            {...precioForm.register("barrio")}
                            placeholder="Ej: Indautxu, Abando, Deusto..."
                          />
                          {precioForm.formState.errors.barrio && (
                            <p className="text-sm text-destructive">{precioForm.formState.errors.barrio.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="metros">Metros cuadrados *</Label>
                          <Input
                            id="metros"
                            type="number"
                            {...precioForm.register("metros")}
                            placeholder="Ej: 75"
                          />
                          {precioForm.formState.errors.metros && (
                            <p className="text-sm text-destructive">{precioForm.formState.errors.metros.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="habitaciones">Habitaciones *</Label>
                          <Select onValueChange={(value) => precioForm.setValue("habitaciones", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4+</SelectItem>
                            </SelectContent>
                          </Select>
                          {precioForm.formState.errors.habitaciones && (
                            <p className="text-sm text-destructive">{precioForm.formState.errors.habitaciones.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="banos">Baños *</Label>
                          <Select onValueChange={(value) => precioForm.setValue("banos", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3+</SelectItem>
                            </SelectContent>
                          </Select>
                          {precioForm.formState.errors.banos && (
                            <p className="text-sm text-destructive">{precioForm.formState.errors.banos.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="estado">Estado *</Label>
                          <Select onValueChange={(value) => precioForm.setValue("estado", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="necesita_reforma">Necesita reforma</SelectItem>
                              <SelectItem value="bueno">Buen estado</SelectItem>
                              <SelectItem value="excelente">Excelente estado</SelectItem>
                            </SelectContent>
                          </Select>
                          {precioForm.formState.errors.estado && (
                            <p className="text-sm text-destructive">{precioForm.formState.errors.estado.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email (opcional)</Label>
                          <Input
                            id="email"
                            type="email"
                            {...precioForm.register("email")}
                            placeholder="propietario@liventygestion.com"
                          />
                          {precioForm.formState.errors.email && (
                            <p className="text-sm text-destructive">{precioForm.formState.errors.email.message}</p>
                          )}
                        </div>
                      </div>

                      <Button type="submit" className="w-full">
                        Calcular precio recomendado
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
          </div>
        )}

        {/* Sección #rentabilidad */}
        {openCalc === "rentabilidad" && (
          <div className="animate-fade-in transition-all duration-300 ease-out">
          <section id="calc-rentabilidad" className="scroll-mt-24 mb-20">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Calculadora de Rentabilidad</h2>
                <p className="text-lg text-muted-foreground">
                  Analiza el cashflow mensual y yield anual de tu inversión
                </p>
              </div>

              <Card>
                <CardContent className="p-8">
                  {rentabilidadResult ? (
                    <div className="text-center">
                      <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold mb-6">¡Análisis completado!</h3>
                      
                      <div className="bg-primary/5 rounded-lg p-8 mb-8">
                        <div className="grid md:grid-cols-2 gap-8 text-center">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Cashflow mensual</div>
                            <div className="text-3xl font-bold text-primary">{rentabilidadResult.cashflow}€</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Rentabilidad anual</div>
                            <div className="text-3xl font-bold text-primary">{rentabilidadResult.rentabilidad}%</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild>
                          <Link to="/propietarios#form">Quiero que lo gestionen</Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to="/propietarios#form?tipo=asesoria">Necesito asesoría</Link>
                        </Button>
                      </div>

                      <Button 
                        variant="ghost" 
                        onClick={() => setRentabilidadResult(null)}
                        className="mt-4"
                      >
                        Calcular otra propiedad
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={rentabilidadForm.handleSubmit(onSubmitRentabilidad)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="ingresosMensuales">Ingresos mensuales (€) *</Label>
                          <Input
                            id="ingresosMensuales"
                            type="number"
                            {...rentabilidadForm.register("ingresosMensuales")}
                            placeholder="Ej: 1.100"
                          />
                          {rentabilidadForm.formState.errors.ingresosMensuales && (
                            <p className="text-sm text-destructive">{rentabilidadForm.formState.errors.ingresosMensuales.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gastosMensuales">Gastos mensuales (€) *</Label>
                          <Input
                            id="gastosMensuales"
                            type="number"
                            {...rentabilidadForm.register("gastosMensuales")}
                            placeholder="Ej: 280"
                          />
                          {rentabilidadForm.formState.errors.gastosMensuales && (
                            <p className="text-sm text-destructive">{rentabilidadForm.formState.errors.gastosMensuales.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="comision">Comisión gestora (%) *</Label>
                          <Input
                            id="comision"
                            type="number"
                            {...rentabilidadForm.register("comision")}
                            placeholder="Ej: 12"
                          />
                          {rentabilidadForm.formState.errors.comision && (
                            <p className="text-sm text-destructive">{rentabilidadForm.formState.errors.comision.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="diasVacios">Días vacíos anuales *</Label>
                          <Input
                            id="diasVacios"
                            type="number"
                            {...rentabilidadForm.register("diasVacios")}
                            placeholder="Ej: 30"
                          />
                          {rentabilidadForm.formState.errors.diasVacios && (
                            <p className="text-sm text-destructive">{rentabilidadForm.formState.errors.diasVacios.message}</p>
                          )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="email">Email (opcional)</Label>
                          <Input
                            id="email"
                            type="email"
                            {...rentabilidadForm.register("email")}
                            placeholder="propietario@liventygestion.com"
                          />
                          {rentabilidadForm.formState.errors.email && (
                            <p className="text-sm text-destructive">{rentabilidadForm.formState.errors.email.message}</p>
                          )}
                        </div>
                      </div>

                      <Button type="submit" className="w-full">
                        Analizar rentabilidad
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
          </div>
        )}

        {/* Sección #comparador */}
        {openCalc === "comparador" && (
          <div className="animate-fade-in transition-all duration-300 ease-out">
          <section id="calc-comparador" className="scroll-mt-24 mb-20">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Comparador: Larga vs. Temporal</h2>
                <p className="text-lg text-muted-foreground">
                  Descubre qué modalidad de alquiler te conviene más
                </p>
              </div>

              <Card>
                <CardContent className="p-8">
                  {comparadorResult ? (
                    <div className="text-center">
                      <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold mb-6">¡Comparación completada!</h3>
                      
                      <div className="bg-primary/5 rounded-lg p-8 mb-8">
                        <div className="grid md:grid-cols-2 gap-8 text-center mb-6">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Larga duración</div>
                            <div className="text-3xl font-bold text-primary">{comparadorResult.largo}%</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Temporal</div>
                            <div className="text-3xl font-bold text-primary">{comparadorResult.temporal}%</div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <h4 className="text-lg font-semibold mb-2">Recomendación</h4>
                          <p className="text-xl font-bold text-primary">{comparadorResult.recomendacion}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild>
                          <Link to="/propietarios#form">Quiero empezar</Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to="/propietarios#form?tipo=consultoria">Necesito más información</Link>
                        </Button>
                      </div>

                      <Button 
                        variant="ghost" 
                        onClick={() => setComparadorResult(null)}
                        className="mt-4"
                      >
                        Comparar otra propiedad
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={comparadorForm.handleSubmit(onSubmitComparador)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="precioCompra">Precio de compra (€) *</Label>
                          <Input
                            id="precioCompra"
                            type="number"
                            {...comparadorForm.register("precioCompra")}
                            placeholder="Ej: 280.000"
                          />
                          {comparadorForm.formState.errors.precioCompra && (
                            <p className="text-sm text-destructive">{comparadorForm.formState.errors.precioCompra.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="alquilerLargo">Alquiler largo plazo (€/mes) *</Label>
                          <Input
                            id="alquilerLargo"
                            type="number"
                            {...comparadorForm.register("alquilerLargo")}
                            placeholder="Ej: 950"
                          />
                          {comparadorForm.formState.errors.alquilerLargo && (
                            <p className="text-sm text-destructive">{comparadorForm.formState.errors.alquilerLargo.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gastosLargo">Gastos largo plazo (€/mes) *</Label>
                          <Input
                            id="gastosLargo"
                            type="number"
                            {...comparadorForm.register("gastosLargo")}
                            placeholder="Ej: 200"
                          />
                          {comparadorForm.formState.errors.gastosLargo && (
                            <p className="text-sm text-destructive">{comparadorForm.formState.errors.gastosLargo.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="alquilerTemporal">Alquiler temporal (€/mes) *</Label>
                          <Input
                            id="alquilerTemporal"
                            type="number"
                            {...comparadorForm.register("alquilerTemporal")}
                            placeholder="Ej: 1.350"
                          />
                          {comparadorForm.formState.errors.alquilerTemporal && (
                            <p className="text-sm text-destructive">{comparadorForm.formState.errors.alquilerTemporal.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gastosTemporal">Gastos temporal (€/mes) *</Label>
                          <Input
                            id="gastosTemporal"
                            type="number"
                            {...comparadorForm.register("gastosTemporal")}
                            placeholder="Ej: 400"
                          />
                          {comparadorForm.formState.errors.gastosTemporal && (
                            <p className="text-sm text-destructive">{comparadorForm.formState.errors.gastosTemporal.message}</p>
                          )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="ocupacionTemporal">Ocupación temporal (%) *</Label>
                          <Input
                            id="ocupacionTemporal"
                            type="number"
                            {...comparadorForm.register("ocupacionTemporal")}
                            placeholder="Ej: 75"
                          />
                          {comparadorForm.formState.errors.ocupacionTemporal && (
                            <p className="text-sm text-destructive">{comparadorForm.formState.errors.ocupacionTemporal.message}</p>
                          )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="email">Email (opcional)</Label>
                          <Input
                            id="email"
                            type="email"
                            {...comparadorForm.register("email")}
                            placeholder="propietario@liventygestion.com"
                          />
                          {comparadorForm.formState.errors.email && (
                            <p className="text-sm text-destructive">{comparadorForm.formState.errors.email.message}</p>
                          )}
                        </div>
                      </div>

                      <Button type="submit" className="w-full">
                        Comparar modalidades
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
          </div>
        )}

        {/* CTA Final - Redesigned */}
        <section className="py-16 bg-gradient-to-br from-neutral-50 via-white to-neutral-50 rounded-[32px] mb-12">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              ¿Necesitas más información?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Descubre todos nuestros servicios y encuentra respuestas a tus preguntas
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Servicios Button */}
              <Button 
                variant="outline" 
                size="lg"
                asChild
                className="h-auto py-6 px-6 rounded-[20px] border-2 hover:border-primary hover:bg-primary/5 hover:shadow-lg transition-all duration-200 group"
              >
                <Link to="/servicios/alquiler-larga-duracion" className="flex items-center justify-center gap-3">
                  <Home className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Servicios para propietarios</span>
                </Link>
              </Button>

              {/* FAQ Button */}
              <Button 
                variant="outline" 
                size="lg"
                asChild
                className="h-auto py-6 px-6 rounded-[20px] border-2 hover:border-primary hover:bg-primary/5 hover:shadow-lg transition-all duration-200 group"
              >
                <Link to="/faq" className="flex items-center justify-center gap-3">
                  <AlertCircle className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Preguntas frecuentes</span>
                </Link>
              </Button>

              {/* Legal Button */}
              <Button 
                variant="outline" 
                size="lg"
                asChild
                className="h-auto py-6 px-6 rounded-[20px] border-2 hover:border-primary hover:bg-primary/5 hover:shadow-lg transition-all duration-200 group"
              >
                <Link to="/servicios/asesoria-legal" className="flex items-center justify-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Información legal</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        </div> {/* Close container */}
      </main>
      
      <Footer />
    </div>
  );
};

export default Herramientas;