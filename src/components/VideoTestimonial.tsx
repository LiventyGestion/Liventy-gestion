import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Star } from "lucide-react";

const VideoTestimonial = () => {
  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conoce las experiencias reales de propietarios que han transformado 
            su gestión de alquileres con Liventy.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center">
                {/* Placeholder for video - will be replaced when video is available */}
                <div className="text-center">
                  <div className="mb-6">
                    <Button 
                      size="lg" 
                      className="rounded-full h-20 w-20 bg-white/90 hover:bg-white text-primary hover:text-primary shadow-lg"
                    >
                      <Play className="h-8 w-8 ml-1" fill="currentColor" />
                    </Button>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                    "Con Liventy, gestionar mi alquiler es muy fácil"
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    María González, propietaria en Madrid
                  </p>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className="h-5 w-5 text-yellow-400 fill-current" 
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-background">
                <blockquote className="text-center italic text-muted-foreground">
                  "Antes tenía que ocuparme de todo: encontrar inquilinos, cobrar alquileres, 
                  resolver incidencias... Ahora Liventy se encarga de todo y yo solo recibo 
                  mi dinero cada mes. Es increíble la tranquilidad que me ha dado."
                </blockquote>
              </div>
            </CardContent>
          </Card>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            📹 Próximamente disponible: videotestimoniales completos de nuestros clientes
          </p>
        </div>
      </div>
    </section>
  );
};

export default VideoTestimonial;