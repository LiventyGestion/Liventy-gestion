import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Cómo maximizar la rentabilidad de tu propiedad de alquiler",
      excerpt: "Descubre las mejores estrategias para aumentar los ingresos de tu inversión inmobiliaria.",
      date: "15 Marzo 2024",
      category: "Inversión"
    },
    {
      id: 2,
      title: "Tendencias del mercado inmobiliario 2024",
      excerpt: "Análisis completo de las tendencias que marcarán el sector inmobiliario este año.",
      date: "10 Marzo 2024",
      category: "Mercado"
    },
    {
      id: 3,
      title: "Guía completa para inquilinos: derechos y obligaciones",
      excerpt: "Todo lo que necesitas saber como inquilino para una experiencia de alquiler exitosa.",
      date: "5 Marzo 2024",
      category: "Legal"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Liventy Insights</h1>
            <p className="text-xl text-muted-foreground">
              Tu fuente de conocimiento inmobiliario
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-muted-foreground">{post.date}</span>
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <button className="text-primary font-medium hover:underline">
                    Leer más →
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;