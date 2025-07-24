import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LeadMagnet = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos.",
        variant: "destructive",
      });
      return;
    }

    // Simulate form submission
    setIsSubmitted(true);
    toast({
      title: "¡Descarga iniciada!",
      description: "Revisa tu email para acceder a la guía.",
    });
  };

  if (isSubmitted) {
    return (
      <section className="py-16 sm:py-20 bg-gradient-to-r from-accent/5 to-primary/5">
        <div className="container mx-auto px-4 sm:px-6">
          <Card className="max-w-2xl mx-auto text-center border-primary/20">
            <CardContent className="p-8">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">¡Gracias por descargar!</h3>
              <p className="text-muted-foreground">
                Revisa tu bandeja de entrada. Te hemos enviado la guía completa para alquilar sin preocupaciones.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-r from-accent/5 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6">
        <Card className="max-w-2xl mx-auto border-primary/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Download className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Guía gratuita: Cómo alquilar sin preocupaciones
            </CardTitle>
            <p className="text-muted-foreground mt-4">
              Descubre los secretos para maximizar la rentabilidad de tu propiedad 
              mientras minimizas riesgos y complicaciones.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-12 text-base"
              >
                Descarga tu guía gratuita
                <Download className="ml-2 h-5 w-5" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Al descargar, aceptas recibir información sobre nuestros servicios. 
              Puedes darte de baja en cualquier momento.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default LeadMagnet;