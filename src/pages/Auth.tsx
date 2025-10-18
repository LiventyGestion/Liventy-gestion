import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { PasswordStrength } from '@/components/ui/password-strength';
import { validatePassword, sanitizeInput, sanitizeName, sanitizeEmail, validateEmail, RateLimiter } from '@/utils/security';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  
  // Rate limiter instance
  const rateLimiter = new RateLimiter();
  
  const { login, signUp, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // Redirect based on user role
      if (user.role === 'propietario') {
        navigate('/area-clientes/propietario/dashboard');
      } else if (user.role === 'inquilino') {
        navigate('/area-clientes/inquilino/servicios');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Sanitize inputs
    const sanitizedEmail = sanitizeEmail(email);
    
    if (!sanitizedEmail || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    // Validate email format
    if (!validateEmail(sanitizedEmail)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    // Rate limiting check
    if (!rateLimiter.isAllowed(`login_${sanitizedEmail}`, 5, 900000)) { // 5 attempts per 15 minutes
      const remainingTime = Math.ceil(rateLimiter.getRemainingTime(`login_${sanitizedEmail}`, 900000) / 60000);
      setError(`Demasiados intentos. Intenta de nuevo en ${remainingTime} minutos`);
      return;
    }

    const result = await login(sanitizedEmail, password);
    
    if (result.success) {
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente.",
      });
    } else {
      setError(result.error || 'Error al iniciar sesión');
      toast({
        title: "Error",
        description: result.error || 'Error al iniciar sesión',
        variant: "destructive",
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Sanitize inputs
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedName = sanitizeName(name);

    if (!sanitizedEmail || !password || !sanitizedName || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    // Validate email format
    if (!validateEmail(sanitizedEmail)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Enhanced password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0]); // Show first error
      return;
    }

    // Rate limiting check
    if (!rateLimiter.isAllowed(`signup_${sanitizedEmail}`, 3, 3600000)) { // 3 attempts per hour
      setError('Demasiados intentos de registro. Intenta de nuevo en una hora');
      return;
    }

    // SECURITY: Role is assigned server-side as 'inquilino' by default
    // Never send role from client to prevent privilege escalation
    const result = await signUp(sanitizedEmail, password, sanitizedName);
    
    if (result.success) {
      toast({
        title: "¡Registro exitoso!",
        description: "Revisa tu email para confirmar tu cuenta.",
      });
      setActiveTab('login');
    } else {
      setError(result.error || 'Error al registrarse');
      toast({
        title: "Error",
        description: result.error || 'Error al registrarse',
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Liventy</CardTitle>
            <CardDescription className="text-center">
              Gestión inteligente de propiedades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="signup">Registrarse</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nombre Completo</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Contraseña</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <PasswordStrength password={password} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Registrando...' : 'Registrarse'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;