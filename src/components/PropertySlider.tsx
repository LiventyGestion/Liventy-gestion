import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight, FileText, Sparkles, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PropertySlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  
  const properties = [
    {
      id: 1,
      title: "Piso Moderno en Indautxu",
      location: "Indautxu, Bilbao",
      price: "1.100 €/mes",
      type: "Gestión integral",
      beds: 2,
      baths: 1,
      area: 85,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&auto=format&q=80"
    },
    {
      id: 2,
      title: "Apartamento Reformado",
      location: "Barakaldo", 
      price: "875 €/mes",
      type: "Gestión integral",
      beds: 1,
      baths: 1,
      area: 65,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop&auto=format&q=80"
    },
    {
      id: 3,
      title: "Ático con Vistas",
      location: "Getxo (Algorta)",
      price: "1.250 €/mes", 
      type: "Gestión integral",
      beds: 3,
      baths: 2,
      area: 120,
      image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop&auto=format&q=80"
    },
    {
      id: 4,
      title: "Estudio Céntrico",
      location: "Santutxu, Bilbao",
      price: "725 €/mes",
      type: "Gestión integral", 
      beds: 1,
      baths: 1,
      area: 40,
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=300&fit=crop&auto=format&q=80"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % properties.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + properties.length) % properties.length);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Encuentra tu nuevo hogar con Liventy
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Viviendas cuidadas, inquilinos tranquilos, procesos simples
          </p>
        </div>

        {/* Bloque de iconos animados */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-12 h-12 rounded-full bg-[hsl(var(--primary-light))] flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2 text-base">Contrato digital y transparente</h3>
            <p className="text-sm text-muted-foreground">Sin letra pequeña ni sorpresas</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 rounded-full bg-[hsl(var(--primary-light))] flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2 text-base">Viviendas revisadas y mantenidas</h3>
            <p className="text-sm text-muted-foreground">Todo listo antes de tu entrada</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="w-12 h-12 rounded-full bg-[hsl(var(--primary-light))] flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2 text-base">Atención directa durante tu estancia</h3>
            <p className="text-sm text-muted-foreground">Soporte humano cuando lo necesites</p>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.slice(currentIndex, currentIndex + 3).concat(
              properties.slice(0, Math.max(0, currentIndex + 3 - properties.length))
            ).map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <div className="relative group">
                  <img 
                    src={property.image} 
                    alt={`${property.title} - Propiedad en ${property.location}`}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary text-white">
                    ✓ Vivienda verificada
                  </Badge>
                  <div className="absolute top-4 right-4 bg-background/90 px-3 py-1 rounded-lg">
                    <span className="font-semibold text-primary">{property.price}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium px-4 py-2 bg-primary rounded-lg">
                      Gestión Liventy — asistencia incluida
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span>{property.beds}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      <span>{property.baths}</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      <span>{property.area}m²</span>
                    </div>
                  </div>
                  
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => navigate('/inquilinos')}
                            >
                              Ver Detalles
                            </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button 
            variant="outline" 
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* CTA al final */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white px-8 btn-hover-lift"
            onClick={() => window.location.href = '/inquilinos'}
          >
            Ver todas las viviendas disponibles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PropertySlider;