import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
const testimonials = [
    {
      name: "María González",
      role: "Propietaria en Bilbao",
      rating: 5,
      text: "Desde que confié mi apartamento a Liventy, no he tenido que preocuparme por nada. La rentabilidad ha aumentado un 20% y el trato es excepcional."
    },
    {
      name: "Carlos Martín", 
      role: "Propietario en Madrid",
      rating: 5,
      text: "Profesionales de verdad. En menos de un mes encontraron inquilinos perfectos y todo el proceso fue transparente y eficiente."
    },
    {
      name: "Ana Fernández",
      role: "Propietaria en Barcelona",
      rating: 5,
      text: "El mejor servicio de gestión que he probado. Cobro puntualmente todos los meses y ellos se encargan de todo. ¡Recomendable 100%!"
    }
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Lo Que Dicen Nuestros Clientes</h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Opiniones reales próximamente. Estos son testimonios de ejemplo.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4" role="img" aria-label={`${testimonial.rating} estrellas de 5`}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-warning text-warning" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 text-sm sm:text-base leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-sm sm:text-base">{testimonial.name}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;