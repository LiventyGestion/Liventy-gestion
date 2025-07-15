import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Wrench, Sparkles, MessageSquare } from "lucide-react";

const TenantDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Panel de Inquilino</h1>
            <p className="text-muted-foreground">Gestiona tu vivienda y solicita servicios</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Próximo Pago</p>
                    <p className="text-2xl font-bold">1 Abr</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Solicitudes</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                  <Wrench className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Servicios</p>
                    <p className="text-2xl font-bold">5</p>
                  </div>
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Mensajes</p>
                    <p className="text-2xl font-bold">1</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Solicitar Servicios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Sparkles className="h-6 w-6 mb-2" />
                    Limpieza
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Wrench className="h-6 w-6 mb-2" />
                    Mantenimiento
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    Documentos
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <MessageSquare className="h-6 w-6 mb-2" />
                    Contacto
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mis Solicitudes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { service: "Reparación grifo cocina", status: "En proceso", date: "12 Mar" },
                    { service: "Limpieza mensual", status: "Programada", date: "15 Mar" },
                    { service: "Revisión calefacción", status: "Completada", date: "8 Mar" }
                  ].map((request, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{request.service}</h3>
                        <p className="text-sm text-muted-foreground">{request.date}</p>
                      </div>
                      <Badge variant={
                        request.status === "Completada" ? "default" : 
                        request.status === "En proceso" ? "secondary" : 
                        "outline"
                      }>
                        {request.status}
                      </Badge>
                    </div>
                  ))}
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

export default TenantDashboard;