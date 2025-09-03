import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const PropertySlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
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
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"
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
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"
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
      image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop"
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
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=300&fit=crop"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % properties.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + properties.length) % properties.length);
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Propiedades Destacadas</h2>
          <p className="text-muted-foreground text-lg">
            Descubre propiedades gestionadas por Liventy con total tranquilidad
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.slice(currentIndex, currentIndex + 3).concat(
              properties.slice(0, Math.max(0, currentIndex + 3 - properties.length))
            ).map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={property.image} 
                    alt={`${property.title} - Propiedad en ${property.location}`}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <Badge className="absolute top-4 left-4">
                    {property.type}
                  </Badge>
                  <div className="absolute top-4 right-4 bg-background/90 px-3 py-1 rounded-lg">
                    <span className="font-semibold text-primary">{property.price}</span>
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
                  
                  <Button variant="outline" className="w-full">
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
      </div>
    </section>
  );
};

export default PropertySlider;