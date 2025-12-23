import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { MapPin, FileSignature, BarChart3, Shield } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs 
        items={[
          { label: "Sobre nosotros" }
        ]} 
      />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Sobre Liventy Gestión</h1>
            <p className="text-xl text-muted-foreground">
              Gestión residencial moderna, cercana y profesional
            </p>
          </div>
          
          {/* Quiénes somos */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Quiénes somos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Somos una empresa de gestión residencial moderna e hiperlocal, especializada en Bizkaia. 
              Nos orientamos a propietarios que buscan simplicidad, control y menor riesgo en la 
              gestión de sus alquileres. Combinamos tecnología y trato cercano para ofrecer 
              una experiencia diferente.
            </p>
          </section>

          {/* Cómo trabajamos */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Cómo trabajamos</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Nuestros procesos son claros y transparentes. Utilizamos firma digital para agilizar 
              la documentación, ofrecemos reporting mensual detallado y mantenemos una trazabilidad 
              completa de todas las incidencias. Cada propietario tiene visibilidad total sobre 
              el estado de su propiedad.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FileSignature className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Firma digital</h3>
                  <p className="text-sm text-muted-foreground">Contratos 100% online</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <BarChart3 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Reporting mensual</h3>
                  <p className="text-sm text-muted-foreground">Informes claros y detallados</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Trazabilidad</h3>
                  <p className="text-sm text-muted-foreground">Seguimiento de incidencias</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Presencia local</h3>
                  <p className="text-sm text-muted-foreground">Conocimiento del territorio</p>
                </div>
              </div>
            </div>
          </section>

          {/* Cobertura */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Cobertura</h2>
            <p className="text-muted-foreground leading-relaxed">
              Operamos principalmente en Bizkaia y provincias limítrofes: Álava, Gipuzkoa, 
              Cantabria y norte de Burgos. Nuestro conocimiento local nos permite ofrecer 
              un servicio más ágil y personalizado.
            </p>
          </section>

          {/* Mapa visual */}
          <section className="bg-primary/5 rounded-2xl p-8 text-center">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Empresa local en Bizkaia</h3>
            <p className="text-muted-foreground">
              Bizkaia · Álava · Gipuzkoa · Cantabria · Norte de Burgos
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
