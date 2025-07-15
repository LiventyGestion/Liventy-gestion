import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "María González",
      role: "Propietaria",
      rating: 5,
      text: "Liventy ha transformado la gestión de mis propiedades. Rentabilidad excelente y total transparencia."
    },
    {
      name: "Carlos Ruiz", 
      role: "Inquilino",
      rating: 5,
      text: "Servicio impecable. El proceso de alquiler fue rápido y el soporte es excepcional."
    },
    {
      name: "Ana López",
      role: "Propietaria",
      rating: 5,
      text: "Mis propiedades nunca estuvieron mejor gestionadas. Recomiendo Liventy sin dudarlo."
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Lo Que Dicen Nuestros Clientes</h2>
          <p className="text-muted-foreground text-lg">Testimonios reales de propietarios e inquilinos satisfechos</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
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