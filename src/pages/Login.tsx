import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Área de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="owner" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="owner">Propietario</TabsTrigger>
                  <TabsTrigger value="tenant">Inquilino</TabsTrigger>
                </TabsList>
                
                <TabsContent value="owner" className="space-y-4">
                  <h3 className="text-lg font-semibold">Acceso Propietarios</h3>
                  <Input placeholder="Email" type="email" />
                  <Input placeholder="Contraseña" type="password" />
                  <Button className="w-full">Iniciar Sesión</Button>
                </TabsContent>
                
                <TabsContent value="tenant" className="space-y-4">
                  <h3 className="text-lg font-semibold">Acceso Inquilinos</h3>
                  <Input placeholder="Email" type="email" />
                  <Input placeholder="Contraseña" type="password" />
                  <Button className="w-full">Iniciar Sesión</Button>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  ¿No tienes cuenta? Contacta con nosotros para obtener acceso.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;