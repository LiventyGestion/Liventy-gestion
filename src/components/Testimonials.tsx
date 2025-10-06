import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Play, Star } from "lucide-react";
import clientTestimonial from "@/assets/client-testimonial.jpg";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import testimonial3 from "@/assets/testimonial-3.jpg";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Javier Etxebarria",
      role: "Propietario en Bilbao",
      rating: 5,
      image: testimonial1,
      text: "Desde que confié mi apartamento a Liventy, no he tenido que preocuparme por nada. La rentabilidad ha aumentado un 20% y el trato es excepcional."
    },
    {
      name: "Ainhoa Mendizábal", 
      role: "Propietaria en Getxo",
      rating: 4,
      image: testimonial2,
      text: "Profesionales de verdad. En menos de un mes encontraron inquilinos perfectos y todo el proceso fue transparente y eficiente."
    },
    {
      name: "Laura Urquijo",
      role: "Inquilina en Barakaldo",
      rating: 5,
      image: testimonial3,
      text: "Como inquilina, el servicio de Liventy es impecable. Cualquier incidencia se resuelve rápido y el trato es muy profesional. Me siento muy bien atendida."
    }
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conoce las experiencias reales de propietarios e inquilinos de Bizkaia que han 
            transformado su gestión de alquileres con Liventy.
          </p>
        </div>

        {/* Video Testimonial Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div 
                className="relative aspect-video bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${clientTestimonial})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="text-center text-white">
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

        {/* Written Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mt-14">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="relative">
              <Avatar className="absolute -top-12 left-1/2 -translate-x-1/2 h-24 w-24 ring-4 ring-white">
                <AvatarImage src={testimonial.image} alt={testimonial.name} className="object-cover object-top" />
                <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6 pt-14">
                  <div className="flex justify-center mb-4" role="img" aria-label={`${testimonial.rating} estrellas de 5`}>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}`}
                        aria-hidden="true" 
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm sm:text-base leading-relaxed">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;