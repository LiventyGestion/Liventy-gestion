import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Search, Filter, Clock, CheckCircle, Circle } from "lucide-react";

// Mock data - En producción vendría de Supabase
const mockIncidents = [
  {
    id: '1',
    title: 'Grifo cocina con pérdida',
    description: 'El grifo de la cocina gotea constantemente desde ayer por la noche',
    status: 'pendiente',
    priority: 'media',
    date: '2024-03-15',
    service_type: 'mantenimiento',
    category: 'fontaneria'
  },
  {
    id: '2',
    title: 'Luz del pasillo fundida',
    description: 'La bombilla del pasillo principal no funciona',
    status: 'en_proceso',
    priority: 'baja',
    date: '2024-03-12',
    service_type: 'mantenimiento',
    category: 'electricidad'
  },
  {
    id: '3',
    title: 'Problema con la calefacción',
    description: 'La calefacción no calienta correctamente en el salón',
    status: 'completado',
    priority: 'alta',
    date: '2024-03-08',
    service_type: 'mantenimiento',
    category: 'calefaccion'
  }
];

export default function TenantIncidents() {
  const [incidents, setIncidents] = useState(mockIncidents);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Filter incidents
  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || incident.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pendiente': { variant: 'destructive' as const, label: 'Pendiente', icon: Circle },
      'en_proceso': { variant: 'secondary' as const, label: 'En Proceso', icon: Clock },
      'completado': { variant: 'default' as const, label: 'Completado', icon: CheckCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendiente;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'alta': 'text-red-600 bg-red-50 border-red-200',
      'media': 'text-orange-600 bg-orange-50 border-orange-200',
      'baja': 'text-green-600 bg-green-50 border-green-200'
    };
    return colors[priority as keyof typeof colors] || colors.media;
  };

  const getPriorityIcon = (priority: string) => {
    return priority === 'alta' ? <AlertTriangle className="h-4 w-4" /> : null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mis Incidencias</h1>
        <p className="text-muted-foreground">
          Consulta el estado de todas tus incidencias y solicitudes de mantenimiento
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar incidencias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las prioridades</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.length > 0 ? (
          filteredIncidents.map((incident) => (
            <Card key={incident.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-lg border ${getPriorityColor(incident.priority)}`}>
                        {getPriorityIcon(incident.priority) || <AlertTriangle className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{incident.title}</h3>
                        <p className="text-muted-foreground mb-3">{incident.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Fecha:</span>
                            <span className="font-medium">{incident.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Prioridad:</span>
                            <Badge variant="outline" className={getPriorityColor(incident.priority)}>
                              {incident.priority.charAt(0).toUpperCase() + incident.priority.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Categoría:</span>
                            <span className="font-medium capitalize">{incident.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    {getStatusBadge(incident.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron incidencias</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "No tienes incidencias registradas"
                }
              </p>
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all" ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setPriorityFilter("all");
                  }}
                >
                  Limpiar filtros
                </Button>
              ) : null}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Info card */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">¿Necesitas reportar un nuevo problema?</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Las nuevas incidencias se crean automáticamente cuando solicitas un servicio de mantenimiento.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/area-clientes/inquilino/servicios">Solicitar Mantenimiento</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}