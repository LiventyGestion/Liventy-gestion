import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Wrench, 
  Sparkles, 
  MessageSquare, 
  Download,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Euro,
  Plus
} from "lucide-react";

// Mock data for demonstration
const mockTenantData = {
  contract: {
    address: "Calle Mayor, 15, 2ºB",
    city: "Madrid",
    startDate: "2024-01-15",
    endDate: "2025-01-14",
    monthlyRent: 850,
    deposit: 1700,
    status: "active",
    type: "Larga duración"
  },
  documents: [
    { id: '1', name: 'Contrato de Arrendamiento', type: 'contract', date: '2024-01-15' },
    { id: '2', name: 'Inventario de la Vivienda', type: 'inventory', date: '2024-01-15' },
    { id: '3', name: 'Normativas del Edificio', type: 'rules', date: '2024-01-15' }
  ],
  incidents: [
    { id: '1', title: 'Grifo cocina con pérdida', description: 'El grifo de la cocina gotea constantemente', status: 'open', date: '2024-03-12', priority: 'media' },
    { id: '2', title: 'Luz del pasillo fundida', description: 'La bombilla del pasillo principal no funciona', status: 'in_progress', date: '2024-03-08', priority: 'baja' },
    { id: '3', title: 'Problema con la calefacción', description: 'La calefacción no calienta correctamente', status: 'resolved', date: '2024-02-28', priority: 'alta' }
  ],
  contacts: {
    property_manager: {
      name: "Ana Martínez",
      role: "Gestora de Propiedades",
      phone: "+34 123 456 789",
      email: "ana.martinez@liventy.com"
    },
    maintenance: {
      name: "Servicio Técnico",
      phone: "+34 987 654 321",
      email: "mantenimiento@liventy.com"
    },
    emergency: {
      name: "Emergencias 24h",
      phone: "+34 600 000 000"
    }
  }
};

const TenantDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newIncident, setNewIncident] = useState({ title: '', description: '', priority: 'media' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'inquilino') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNewIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncident.title || !newIncident.description) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Incidencia creada",
      description: "Tu incidencia ha sido registrada y será atendida pronto.",
    });
    
    setNewIncident({ title: '', description: '', priority: 'media' });
    setIsSubmitting(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="destructive">Abierta</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">En Proceso</Badge>;
      case 'resolved':
        return <Badge variant="default">Resuelta</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'text-red-600';
      case 'media':
        return 'text-orange-600';
      case 'baja':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with user info */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Bienvenido, {user.name}</h1>
              <p className="text-muted-foreground">Panel de Inquilino - Gestiona tu vivienda</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>

          {/* Contract Info Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Datos del Contrato Activo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Dirección</p>
                  <p className="font-semibold">{mockTenantData.contract.address}</p>
                  <p className="font-semibold">{mockTenantData.contract.city}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Periodo</p>
                  <p className="font-semibold">{mockTenantData.contract.startDate}</p>
                  <p className="text-sm">hasta {mockTenantData.contract.endDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Renta Mensual</p>
                  <p className="font-semibold text-2xl text-primary">€{mockTenantData.contract.monthlyRent}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Badge variant="default" className="mt-1">Activo</Badge>
                  <p className="text-sm mt-1">{mockTenantData.contract.type}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Próximo Pago</p>
                    <p className="text-2xl font-bold">1 Abr</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Solicitudes</p>
                    <p className="text-2xl font-bold">{mockTenantData.incidents.filter(i => i.status !== 'resolved').length}</p>
                  </div>
                  <Wrench className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Documentos</p>
                    <p className="text-2xl font-bold">{mockTenantData.documents.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Soporte</p>
                    <p className="text-lg font-bold">24/7</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="services" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="services">Servicios</TabsTrigger>
              <TabsTrigger value="incidents">Incidencias</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="contact">Contacto</TabsTrigger>
            </TabsList>

            {/* Services Tab */}
            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle>Solicitar Servicios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-24 flex-col space-y-2">
                      <Sparkles className="h-8 w-8" />
                      <span>Limpieza</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col space-y-2">
                      <Wrench className="h-8 w-8" />
                      <span>Mantenimiento</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col space-y-2">
                      <FileText className="h-8 w-8" />
                      <span>Documentos</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col space-y-2">
                      <MessageSquare className="h-8 w-8" />
                      <span>Consulta</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Incidents Tab */}
            <TabsContent value="incidents">
              <div className="space-y-6">
                {/* New Incident Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="w-5 h-5 mr-2" />
                      Crear Nueva Incidencia
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleNewIncident} className="space-y-4">
                      <div>
                        <Input
                          placeholder="Título de la incidencia"
                          value={newIncident.title}
                          onChange={(e) => setNewIncident({...newIncident, title: e.target.value})}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Textarea
                          placeholder="Describe el problema en detalle..."
                          value={newIncident.description}
                          onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <select
                          value={newIncident.priority}
                          onChange={(e) => setNewIncident({...newIncident, priority: e.target.value})}
                          className="px-3 py-2 border rounded-md"
                          disabled={isSubmitting}
                        >
                          <option value="baja">Prioridad Baja</option>
                          <option value="media">Prioridad Media</option>
                          <option value="alta">Prioridad Alta</option>
                        </select>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? 'Enviando...' : 'Crear Incidencia'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Incidents List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Mis Incidencias</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockTenantData.incidents.map((incident) => (
                        <div key={incident.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">{incident.title}</h3>
                            <p className="text-sm text-muted-foreground">{incident.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-sm text-muted-foreground">{incident.date}</span>
                              <span className={`text-sm font-medium ${getPriorityColor(incident.priority)}`}>
                                {incident.priority.charAt(0).toUpperCase() + incident.priority.slice(1)} prioridad
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(incident.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documentos Vinculados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTenantData.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">{doc.date}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Descargar
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Gestora de Propiedades
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold">{mockTenantData.contacts.property_manager.name}</p>
                        <p className="text-sm text-muted-foreground">{mockTenantData.contacts.property_manager.role}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{mockTenantData.contacts.property_manager.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{mockTenantData.contacts.property_manager.email}</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4">Contactar</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wrench className="w-5 h-5 mr-2" />
                      Mantenimiento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold">{mockTenantData.contacts.maintenance.name}</p>
                        <p className="text-sm text-muted-foreground">Lunes a Viernes 9:00-18:00</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{mockTenantData.contacts.maintenance.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{mockTenantData.contacts.maintenance.email}</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4" variant="outline">Contactar</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-600">
                      <Phone className="w-5 h-5 mr-2" />
                      Emergencias
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold">{mockTenantData.contacts.emergency.name}</p>
                        <p className="text-sm text-muted-foreground">Disponible 24 horas</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm font-bold">{mockTenantData.contacts.emergency.phone}</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4" variant="destructive">Llamar Emergencia</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TenantDashboard;