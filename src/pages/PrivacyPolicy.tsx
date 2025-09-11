import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Mail, Lock, Users, FileText, Eye } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              POLÍTICA DE PRIVACIDAD
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Porque tu privacidad no es un trámite. Es un compromiso.
            </p>
            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-foreground">
                En Liventy Gestión tratamos tus datos personales con respeto, transparencia y responsabilidad. 
                Queremos que sepas qué datos recogemos, para qué los usamos y cómo puedes ejercer tus derechos.
              </p>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      1. ¿Quién es el responsable?
                    </h2>
                  </div>
                </div>
                <div className="pl-14 space-y-2 text-muted-foreground">
                  <p><strong className="text-foreground">LIVENTY GESTIÓN S.L.</strong></p>
                  <p>CIF: [CIF]</p>
                  <p>Domicilio: [Dirección]</p>
                  <p className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Correo electrónico: contacto@liventygestion.com</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Eye className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      2. ¿Qué datos recogemos y para qué?
                    </h2>
                  </div>
                </div>
                <div className="pl-14 space-y-4">
                  <p className="text-foreground font-medium">Solo los necesarios, nunca más:</p>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Datos de contacto (cuando nos escribes o te registras)</li>
                    <li>Datos contractuales (si eres cliente o proveedor)</li>
                    <li>Información de navegación (cookies, con tu consentimiento)</li>
                  </ul>
                  <p className="text-foreground font-medium mt-6">Los usamos para:</p>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Gestionar nuestros servicios de alquiler y atención personalizada</li>
                    <li>Enviar información relevante (si nos autorizas)</li>
                    <li>Cumplir obligaciones legales</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Section 3 */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      3. ¿Cuál es la base legal para tratar tus datos?
                    </h2>
                  </div>
                </div>
                <div className="pl-14">
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Tu consentimiento, cuando lo das libremente</li>
                    <li>La ejecución de un contrato, si eres cliente o proveedor</li>
                    <li>Nuestro interés legítimo (por ejemplo, mejorar nuestros servicios)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Section 4 */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      4. ¿Compartimos tus datos?
                    </h2>
                  </div>
                </div>
                <div className="pl-14 space-y-4">
                  <p className="text-foreground font-medium">Nunca vendemos tus datos. Solo los compartimos con:</p>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Proveedores que nos ayudan a darte un buen servicio (CRM, plataformas de firma, soporte técnico…)</li>
                    <li>Administraciones públicas, si la ley nos lo exige</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Todos nuestros proveedores cumplen el RGPD y hemos firmado contratos que lo garantizan.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 5 */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      5. ¿Cuáles son tus derechos?
                    </h2>
                  </div>
                </div>
                <div className="pl-14 space-y-4">
                  <p className="text-foreground font-medium">Puedes:</p>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Acceder, rectificar o suprimir tus datos</li>
                    <li>Limitar u oponerte al tratamiento</li>
                    <li>Solicitar la portabilidad</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Para ejercerlos, escríbenos a{" "}
                    <a href="mailto:contacto@liventygestion.com" className="text-primary hover:underline">
                      contacto@liventygestion.com
                    </a>
                    . También puedes reclamar ante la Agencia Española de Protección de Datos si lo consideras necesario.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 6 */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <Lock className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      6. Seguridad y retención
                    </h2>
                  </div>
                </div>
                <div className="pl-14">
                  <p className="text-muted-foreground">
                    Guardamos tus datos solo el tiempo necesario y con las medidas de seguridad adecuadas (digital y física).
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
                  ¿Tienes dudas sobre nuestra política de privacidad?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Estamos aquí para resolver cualquier pregunta que tengas sobre el tratamiento de tus datos.
                </p>
                <a 
                  href="mailto:contacto@liventygestion.com"
                  className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>Contactar</span>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;