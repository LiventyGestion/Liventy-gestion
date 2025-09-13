import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Scale, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useUnifiedLeads } from "@/hooks/useUnifiedLeads";
import { useToast } from "@/hooks/use-toast";

const ConsultarMiCaso = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
    acepta_politica: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { submitLead } = useUnifiedLeads();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      acepta_politica: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.email || !formData.mensaje || !formData.acepta_politica) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos obligatorios y acepta la política de privacidad.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await submitLead({
        ...formData,
        origen: "asesoramiento_legal"
      });

      setIsSubmitted(true);
      toast({
        title: "Consulta enviada",
        description: "Gracias por tu consulta. Te responderemos lo antes posible."
      });
    } catch (error) {
      console.error("Error al enviar consulta:", error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al enviar tu consulta. Por favor, inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16 sm:py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-3xl font-bold mb-4">
                ¡Consulta enviada con éxito!
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Gracias por tu consulta. Te responderemos lo antes posible.
              </p>
              <Button onClick={() => window.location.href = "/"}>
                Volver al inicio
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50/60 via-blue-100/40 to-blue-50/80 dark:from-blue-950/10 dark:to-blue-900/20">
          <div className="container mx-auto px-6 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scale className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Consulta tu caso legal
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Describe tu situación y te proporcionaremos asesoramiento legal básico sobre tu alquiler.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-center">
                    Formulario de consulta legal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">
                        Nombre completo <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Correo electrónico <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="tu@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefono">
                        Teléfono (opcional)
                      </Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        placeholder="Tu número de teléfono"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mensaje">
                        Describe tu consulta <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="mensaje"
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleInputChange}
                        placeholder="Describe detalladamente tu consulta legal. Incluye toda la información relevante sobre tu situación de alquiler."
                        className="min-h-[120px]"
                        required
                      />
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="acepta_politica"
                        checked={formData.acepta_politica}
                        onCheckedChange={handleCheckboxChange}
                        required
                      />
                      <Label htmlFor="acepta_politica" className="text-sm leading-5">
                        Acepto la <a href="/politica-privacidad" className="text-primary hover:underline" target="_blank">política de privacidad</a> y el tratamiento de mis datos personales para responder a mi consulta. <span className="text-red-500">*</span>
                      </Label>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        <strong>Importante:</strong> Este servicio es orientativo y no constituye representación jurídica ni dictamen profesional. Para casos complejos, te derivaremos a abogados colaboradores especializados.
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full text-lg py-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enviando consulta..." : "Enviar consulta"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ConsultarMiCaso;