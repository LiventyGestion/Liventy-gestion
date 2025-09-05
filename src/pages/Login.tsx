import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<UserRole>("propietario");
  const [error, setError] = useState("");
  
  const { login, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      if (user.role === 'propietario') {
        navigate('/area-clientes/propietario/dashboard');
      } else if (user.role === 'inquilino') {
        navigate('/area-clientes/inquilino/servicios');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, completa todos los campos");
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      toast({
        title: "Acceso correcto",
        description: "Bienvenido a tu área personal",
      });
    } else {
      setError(result.error || "Error al iniciar sesión");
      toast({
        title: "Error",
        description: result.error || "Error al iniciar sesión",
        variant: "destructive",
      });
    }
  };

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
              <form onSubmit={handleSubmit}>
                <Tabs 
                  value={activeTab} 
                  onValueChange={(value) => setActiveTab(value as UserRole)}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="propietario">Propietario</TabsTrigger>
                    <TabsTrigger value="inquilino">Inquilino</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="propietario" className="space-y-4">
                    <h3 className="text-lg font-semibold">Acceso Propietarios</h3>
                    <Input 
                      placeholder="Email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                    <Input 
                      placeholder="Contraseña" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Iniciar Sesión
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="inquilino" className="space-y-4">
                    <h3 className="text-lg font-semibold">Acceso Inquilinos</h3>
                    <Input 
                      placeholder="Email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                    <Input 
                      placeholder="Contraseña" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Iniciar Sesión
                    </Button>
                  </TabsContent>
                </Tabs>
              </form>
              
              {error && (
                <Alert className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="mt-6 text-center">
                {activeTab === "propietario" ? (
                  <p className="text-sm text-muted-foreground">
                    ¿No tienes cuenta?{" "}
                    <button
                      onClick={() => navigate('/empezar-ahora')}
                      className="text-primary hover:underline font-medium"
                    >
                      Empieza ahora a rentabilizar tu piso
                    </button>
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    ¿No tienes cuenta?{" "}
                    <button
                      onClick={() => navigate('/contact')}
                      className="text-primary hover:underline font-medium"
                    >
                      Tu alquiler ideal te está esperando
                    </button>
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Demo: propietario@ejemplo.com / inquilino@ejemplo.com (contraseña: Prueba1*)
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