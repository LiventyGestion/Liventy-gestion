import { TrendingUp, Home, Users, Star } from "lucide-react";

const Stats = () => {
  const stats = [
    {
      icon: Home,
      value: "500+",
      label: "Propiedades Gestionadas",
      description: "En cartera activa"
    },
    {
      icon: TrendingUp,
      value: "87%",
      label: "Ocupación Media",
      description: "Último año"
    },
    {
      icon: Users,
      value: "1,200+",
      label: "Clientes Satisfechos",
      description: "Propietarios e inquilinos"
    },
    {
      icon: Star,
      value: "15%",
      label: "Rentabilidad Media",
      description: "Incremento anual"
    }
  ];

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Resultados que Hablan por Sí Solos</h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Nuestros números reflejan el compromiso con la excelencia y la satisfacción de nuestros clientes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-foreground/10 rounded-full mb-4">
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-xl font-semibold mb-1">{stat.label}</div>
              <div className="text-primary-foreground/70">{stat.description}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-primary-foreground/10 rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-2">€2.5M+</h3>
              <p className="text-primary-foreground/80">Ingresos generados para propietarios</p>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-2">24/7</h3>
              <p className="text-primary-foreground/80">Soporte y atención al cliente</p>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-2">98%</h3>
              <p className="text-primary-foreground/80">Tasa de renovación de contratos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;