import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie, Settings, BarChart3, CheckCircle, XCircle, Mail } from "lucide-react";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Cookie className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              POLÍTICA DE COOKIES
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Usamos cookies. Te lo contamos sin rodeos.
            </p>
            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-foreground">
                En esta web utilizamos cookies para:
              </p>
              <ul className="mt-3 space-y-1 text-muted-foreground">
                <li>• Hacer que todo funcione correctamente (cookies técnicas)</li>
                <li>• Saber cómo navegas (cookies analíticas)</li>
                <li>• Mejorar tu experiencia, sin invadir tu privacidad</li>
              </ul>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* What can you do? */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Settings className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      ¿Qué puedes hacer?
                    </h2>
                  </div>
                </div>
                <div className="pl-14 grid sm:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="text-foreground font-medium">Aceptar todas</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
                    <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                    <span className="text-foreground font-medium">Rechazarlas</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Settings className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    <span className="text-foreground font-medium">Configurarlas desde tu navegador</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Types of cookies */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      ¿Qué tipo de cookies usamos?
                    </h2>
                  </div>
                </div>
                <div className="pl-14 space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                      <Settings className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Técnicas (imprescindibles)</h3>
                      <p className="text-sm text-muted-foreground">
                        Necesarias para que la web funcione correctamente
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                      <BarChart3 className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Analíticas (Google Analytics)</h3>
                      <p className="text-sm text-muted-foreground">
                        Para entender cómo usas nuestra web y mejorarla
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What we don't use */}
            <Card className="shadow-lg bg-green-50 border-green-200">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Lo que NO hacemos
                  </h3>
                  <p className="text-muted-foreground">
                    No usamos cookies publicitarias ni hacemos seguimiento comercial sin tu permiso.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Section */}
          <div className="mt-12 text-center">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  ¿Necesitas más información?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Para más información, consulta nuestra Política de Privacidad o escríbenos.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/politica-privacidad"
                    className="inline-flex items-center justify-center space-x-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <Cookie className="h-4 w-4" />
                    <span>Política de Privacidad</span>
                  </a>
                  <a 
                    href="mailto:liventygestion@gmail.com"
                    className="inline-flex items-center justify-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Contactar</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CookiePolicy;