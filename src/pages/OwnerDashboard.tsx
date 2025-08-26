import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { 
  TrendingUp, 
  Home, 
  Euro, 
  Calendar, 
  FileText, 
  Download, 
  AlertTriangle, 
  MessageSquare,
  Eye,
  ChevronRight
} from "lucide-react";

// Mock data for demonstration
const mockOwnerData = {
  kpis: {
    monthlyIncome: 2450,
    occupancyRate: 87,
    rentedMonths: 9,
    totalProperties: 3
  },
  properties: [
    {
      id: '1',
      address: 'Calle Mayor, 15, 2ºB',
      city: 'Madrid',
      type: 'Piso',
      rooms: 2,
      bathrooms: 1,
      area: 75,
      furnished: true,
      status: 'occupied',
      monthlyRent: 850,
      tenant: 'María López',
      images: ['/placeholder.svg'],
      expenses: 120,
      income: 850
    },
    {
      id: '2',
      address: 'Avenida del Sol, 32, 1ºA',
      city: 'Madrid',
      type: 'Estudio',
      rooms: 1,
      bathrooms: 1,
      area: 45,
      furnished: true,
      status: 'available',
      monthlyRent: 600,
      images: ['/placeholder.svg'],
      expenses: 80,
      income: 0
    },
    {
      id: '3',
      address: 'Plaza España, 8, 3ºC',
      city: 'Madrid',
      type: 'Piso',
      rooms: 3,
      bathrooms: 2,
      area: 95,
      furnished: false,
      status: 'occupied',
      monthlyRent: 1200,
      tenant: 'Carlos García',
      images: ['/placeholder.svg'],
      expenses: 150,
      income: 1200
    }
  ],
  payments: [
    { id: '1', date: '2024-03-15', amount: 850, type: 'Alquiler - Calle Mayor, 15', status: 'paid' },
    { id: '2', date: '2024-03-15', amount: 1200, type: 'Alquiler - Plaza España, 8', status: 'paid' },
    { id: '3', date: '2024-03-10', amount: -45, type: 'Comisión gestión', status: 'paid' },
    { id: '4', date: '2024-02-15', amount: 850, type: 'Alquiler - Calle Mayor, 15', status: 'paid' },
    { id: '5', date: '2024-02-15', amount: 1200, type: 'Alquiler - Plaza España, 8', status: 'paid' }
  ],
  documents: [
    { id: '1', name: 'Contrato - Calle Mayor, 15', type: 'contract', date: '2024-01-15' },
    { id: '2', name: 'Informe Anual 2023', type: 'report', date: '2024-01-01' },
    { id: '3', name: 'Contrato - Plaza España, 8', type: 'contract', date: '2023-06-01' }
  ],
  incidents: [
    { id: '1', property: 'Calle Mayor, 15', description: 'Grifo cocina con pérdida', status: 'open', date: '2024-03-12' },
    { id: '2', property: 'Plaza España, 8', description: 'Calefacción no funciona', status: 'in_progress', date: '2024-03-10' }
  ]
};

const OwnerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'propietario') {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'occupied':
        return <Badge variant="default">Ocupado</Badge>;
      case 'available':
        return <Badge variant="secondary">Disponible</Badge>;
      case 'maintenance':
        return <Badge variant="outline">Mantenimiento</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
              <p className="text-muted-foreground">Panel de Propietario - Gestiona tus propiedades</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>

          {/* KPIs Dashboard */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ingresos Este Mes</p>
                    <p className="text-2xl font-bold">€{mockOwnerData.kpis.monthlyIncome.toLocaleString()}</p>
                  </div>
                  <Euro className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ocupación</p>
                    <p className="text-2xl font-bold">{mockOwnerData.kpis.occupancyRate}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Meses Alquilados</p>
                    <p className="text-2xl font-bold">{mockOwnerData.kpis.rentedMonths}/12</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Propiedades</p>
                    <p className="text-2xl font-bold">{mockOwnerData.kpis.totalProperties}</p>
                  </div>
                  <Home className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="properties" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="properties">Mis Propiedades</TabsTrigger>
              <TabsTrigger value="payments">Historial de Pagos</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="incidents">Incidencias</TabsTrigger>
            </TabsList>

            {/* Properties Tab */}
            <TabsContent value="properties">
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockOwnerData.properties.map((property) => (
                  <Card key={property.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{property.address}</CardTitle>
                          <p className="text-sm text-muted-foreground">{property.city}</p>
                        </div>
                        {getStatusBadge(property.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Tipo:</span>
                          <span className="font-medium">{property.type}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Habitaciones:</span>
                          <span className="font-medium">{property.rooms}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Superficie:</span>
                          <span className="font-medium">{property.area} m²</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Renta Mensual:</span>
                          <span className="font-medium text-green-600">€{property.monthlyRent}</span>
                        </div>
                        {property.tenant && (
                          <div className="flex justify-between text-sm">
                            <span>Inquilino:</span>
                            <span className="font-medium">{property.tenant}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span>Gastos:</span>
                          <span className="font-medium text-red-600">€{property.expenses}</span>
                        </div>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full mt-4" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detalles de la Propiedad</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Información General</h4>
                                <div className="space-y-2 text-sm">
                                  <div><span className="font-medium">Dirección:</span> {property.address}</div>
                                  <div><span className="font-medium">Tipo:</span> {property.type}</div>
                                  <div><span className="font-medium">Habitaciones:</span> {property.rooms}</div>
                                  <div><span className="font-medium">Baños:</span> {property.bathrooms}</div>
                                  <div><span className="font-medium">Superficie:</span> {property.area} m²</div>
                                  <div><span className="font-medium">Amueblado:</span> {property.furnished ? 'Sí' : 'No'}</div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Información Financiera</h4>
                                <div className="space-y-2 text-sm">
                                  <div><span className="font-medium">Renta:</span> €{property.monthlyRent}/mes</div>
                                  <div><span className="font-medium">Gastos:</span> €{property.expenses}/mes</div>
                                  <div><span className="font-medium">Beneficio:</span> €{property.income - property.expenses}/mes</div>
                                  <div><span className="font-medium">Estado:</span> {property.status === 'occupied' ? 'Ocupado' : 'Disponible'}</div>
                                  {property.tenant && <div><span className="font-medium">Inquilino:</span> {property.tenant}</div>}
                                </div>
                              </div>
                            </div>
                            <div className="pt-4 border-t">
                              <img 
                                src={property.images[0]} 
                                alt="Property" 
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Pagos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockOwnerData.payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{payment.type}</p>
                          <p className="text-sm text-muted-foreground">{payment.date}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${payment.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {payment.amount > 0 ? '+' : ''}€{Math.abs(payment.amount).toLocaleString()}
                          </p>
                          <Badge variant="default">Pagado</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documentos Descargables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockOwnerData.documents.map((doc) => (
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

            {/* Incidents Tab */}
            <TabsContent value="incidents">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Incidencias</CardTitle>
                    <Button>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contactar Soporte
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {mockOwnerData.incidents.length > 0 ? (
                    <div className="space-y-4">
                      {mockOwnerData.incidents.map((incident) => (
                        <div key={incident.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="h-6 w-6 text-orange-500" />
                            <div>
                              <p className="font-medium">{incident.description}</p>
                              <p className="text-sm text-muted-foreground">{incident.property} - {incident.date}</p>
                            </div>
                          </div>
                          <Badge variant={incident.status === 'open' ? 'destructive' : 'secondary'}>
                            {incident.status === 'open' ? 'Abierta' : 'En Proceso'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No hay incidencias abiertas
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OwnerDashboard;