import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Home, Users } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/20 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Gestión Integral de
            <span className="text-primary block">Propiedades de Alquiler</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Maximiza la rentabilidad de tus propiedades con nuestra plataforma profesional. 
            Gestión completa, transparencia total y tecnología avanzada.
          </p>

          {/* Property Search */}
          <div className="bg-card border rounded-lg p-6 shadow-lg mb-12">
            <h3 className="text-lg font-semibold mb-4">Encuentra tu Propiedad Ideal</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de propiedad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartamento</SelectItem>
                  <SelectItem value="house">Casa</SelectItem>
                  <SelectItem value="studio">Estudio</SelectItem>
                  <SelectItem value="loft">Loft</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Ubicación" className="pl-10" />
              </div>
              
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Duración" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Temporada</SelectItem>
                  <SelectItem value="long">Larga duración</SelectItem>
                  <SelectItem value="any">Cualquiera</SelectItem>
                </SelectContent>
              </Select>
              
              <Button className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              <Home className="h-5 w-5 mr-2" />
              Soy Propietario
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              <Users className="h-5 w-5 mr-2" />
              Busco Vivienda
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;