import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Sobre Liventy Gestión</h1>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Nuestra Historia</h2>
              <p className="text-muted-foreground mb-6">
                Liventy Gestión nace de la necesidad de profesionalizar el sector de la gestión inmobiliaria, 
                ofreciendo un servicio integral que maximice la rentabilidad de las propiedades mientras 
                garantiza la mejor experiencia tanto para propietarios como inquilinos.
              </p>
              <p className="text-muted-foreground">
                Con años de experiencia en el mercado inmobiliario, nuestro equipo combina conocimiento 
                técnico con tecnología avanzada para ofrecer soluciones innovadoras.
              </p>
            </div>
            <div className="bg-muted rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">Nuestros Valores</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Transparencia total
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Rentabilidad garantizada
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Tecnología innovadora
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Atención personalizada
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-8">Nuestro Equipo</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((member) => (
                <div key={member} className="text-center">
                  <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold">Miembro del Equipo {member}</h3>
                  <p className="text-muted-foreground">Especialista en Gestión</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;