import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ExportLeadsButton } from "@/components/admin/ExportLeadsButton";
import { ExportLeadsXLSXButton } from "@/components/admin/ExportLeadsXLSXButton";
import { LeadsExportView } from "@/components/admin/LeadsExportView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Search, 
  Filter, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  FileSpreadsheet,
  List
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Lead type matching the database schema
interface Lead {
  id: string;
  created_at: string;
  source: 'contact_form' | 'owners_form' | 'tenants_form' | 'chatbot';
  page: string | null;
  persona_tipo: 'propietario' | 'inquilino' | 'empresa' | null;
  nombre: string | null;
  telefono: string | null;
  email: string | null;
  municipio: string | null;
  barrio: string | null;
  m2: number | null;
  habitaciones: number | null;
  estado_vivienda: string | null;
  fecha_disponible: string | null;
  presupuesto_renta: number | null;
  canal_preferido: string | null;
  franja_horaria: string | null;
  comentarios: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  consent: boolean | null;
  status: 'new' | 'qualified' | 'contacted' | 'scheduled' | 'closed';
}

const sourceLabels: Record<string, string> = {
  contact_form: 'Formulario contacto',
  owners_form: 'Formulario propietarios',
  tenants_form: 'Formulario inquilinos',
  chatbot: 'Chatbot'
};

const statusLabels: Record<string, string> = {
  new: 'Nuevo',
  qualified: 'Cualificado',
  contacted: 'Contactado',
  scheduled: 'Cita programada',
  closed: 'Cerrado'
};

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  qualified: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  scheduled: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
};

const personaColors: Record<string, string> = {
  propietario: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  inquilino: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300',
  empresa: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
};

const ITEMS_PER_PAGE = 20;

const AdminLeads = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [personaFilter, setPersonaFilter] = useState<string>("all");
  
  // Selected lead for detail view
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Active tab
  const [activeTab, setActiveTab] = useState<string>("list");

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    qualified: 0,
    contacted: 0,
    scheduled: 0,
    closed: 0
  });

  // Check admin access
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Fetch leads
  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('Leads')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Apply filters - cast to any to avoid enum type issues
      if (sourceFilter !== 'all') {
        query = query.eq('source', sourceFilter as any);
      }
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any);
      }
      if (personaFilter !== 'all') {
        query = query.eq('persona_tipo', personaFilter as any);
      }
      if (searchTerm) {
        query = query.or(`nombre.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,telefono.ilike.%${searchTerm}%,municipio.ilike.%${searchTerm}%`);
      }

      // Pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setLeads((data as Lead[]) || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('Leads')
        .select('status');

      if (error) throw error;

      const newStats = {
        total: data?.length || 0,
        new: data?.filter(l => l.status === 'new').length || 0,
        qualified: data?.filter(l => l.status === 'qualified').length || 0,
        contacted: data?.filter(l => l.status === 'contacted').length || 0,
        scheduled: data?.filter(l => l.status === 'scheduled').length || 0,
        closed: data?.filter(l => l.status === 'closed').length || 0
      };
      setStats(newStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchLeads();
      fetchStats();
    }
  }, [user, currentPage, sourceFilter, statusFilter, personaFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user?.role === 'admin') {
        setCurrentPage(1);
        fetchLeads();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update lead status
  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('Leads')
        .update({ status: newStatus as any })
        .eq('id', leadId);

      if (error) throw error;

      // Refresh data
      fetchLeads();
      fetchStats();
      
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus as Lead['status'] });
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              Panel de Leads
            </h1>
            <p className="text-muted-foreground mt-1">
              Gestiona todos los leads capturados desde formularios y chatbot
            </p>
          </div>
          <div className="flex gap-2">
            <ExportLeadsXLSXButton />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => { fetchLeads(); fetchStats(); }}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </Button>
            <ExportLeadsButton />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
              <div className="text-sm text-muted-foreground">Nuevos</div>
            </CardContent>
          </Card>
          <Card className="border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.qualified}</div>
              <div className="text-sm text-muted-foreground">Cualificados</div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.contacted}</div>
              <div className="text-sm text-muted-foreground">Contactados</div>
            </CardContent>
          </Card>
          <Card className="border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.scheduled}</div>
              <div className="text-sm text-muted-foreground">Citas</div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">{stats.closed}</div>
              <div className="text-sm text-muted-foreground">Cerrados</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for List vs Export View */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              Lista de Leads
            </TabsTrigger>
            <TabsTrigger value="export" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Exportar (Excel)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="mt-0">
            <LeadsExportView />
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            {/* Filters */}
            <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email, teléfono o municipio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Origen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los orígenes</SelectItem>
                    <SelectItem value="contact_form">Formulario contacto</SelectItem>
                    <SelectItem value="owners_form">Formulario propietarios</SelectItem>
                    <SelectItem value="tenants_form">Formulario inquilinos</SelectItem>
                    <SelectItem value="chatbot">Chatbot</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="new">Nuevo</SelectItem>
                    <SelectItem value="qualified">Cualificado</SelectItem>
                    <SelectItem value="contacted">Contactado</SelectItem>
                    <SelectItem value="scheduled">Cita programada</SelectItem>
                    <SelectItem value="closed">Cerrado</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={personaFilter} onValueChange={setPersonaFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Users className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="propietario">Propietario</SelectItem>
                    <SelectItem value="inquilino">Inquilino</SelectItem>
                    <SelectItem value="empresa">Empresa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">Fecha</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Origen</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-[80px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      </TableRow>
                    ))
                  ) : leads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No se encontraron leads con los filtros aplicados
                      </TableCell>
                    </TableRow>
                  ) : (
                    leads.map((lead) => (
                      <TableRow key={lead.id} className="hover:bg-muted/50">
                        <TableCell className="text-sm">
                          {format(new Date(lead.created_at), "dd MMM yyyy", { locale: es })}
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(lead.created_at), "HH:mm")}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {lead.nombre || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {lead.email && (
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="truncate max-w-[150px]">{lead.email}</span>
                              </div>
                            )}
                            {lead.telefono && (
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                {lead.telefono}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {sourceLabels[lead.source] || lead.source}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {lead.persona_tipo ? (
                            <Badge className={personaColors[lead.persona_tipo]}>
                              {lead.persona_tipo}
                            </Badge>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          {lead.municipio ? (
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {lead.municipio}
                              {lead.barrio && <span className="text-muted-foreground">/ {lead.barrio}</span>}
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={lead.status} 
                            onValueChange={(value) => updateLeadStatus(lead.id, value)}
                          >
                            <SelectTrigger className="h-8 w-[130px]">
                              <Badge className={statusColors[lead.status]}>
                                {statusLabels[lead.status]}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">Nuevo</SelectItem>
                              <SelectItem value="qualified">Cualificado</SelectItem>
                              <SelectItem value="contacted">Contactado</SelectItem>
                              <SelectItem value="scheduled">Cita programada</SelectItem>
                              <SelectItem value="closed">Cerrado</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedLead(lead)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} de {totalCount}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1 text-sm">
                    Página {currentPage} de {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
          </TabsContent>
        </Tabs>

        {/* Lead Detail Modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Detalle del Lead</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedLead(null)}>
                  ✕
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                    <p className="font-medium">{selectedLead.nombre || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                    <p>
                      {selectedLead.persona_tipo ? (
                        <Badge className={personaColors[selectedLead.persona_tipo]}>
                          {selectedLead.persona_tipo}
                        </Badge>
                      ) : '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="font-medium">{selectedLead.email || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                    <p className="font-medium">{selectedLead.telefono || '-'}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Municipio</label>
                    <p>{selectedLead.municipio || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Barrio</label>
                    <p>{selectedLead.barrio || '-'}</p>
                  </div>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">m²</label>
                    <p>{selectedLead.m2 || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Habitaciones</label>
                    <p>{selectedLead.habitaciones || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Estado vivienda</label>
                    <p>{selectedLead.estado_vivienda || '-'}</p>
                  </div>
                </div>

                {/* Preferences */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Presupuesto renta</label>
                    <p>{selectedLead.presupuesto_renta ? `${selectedLead.presupuesto_renta}€` : '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Canal preferido</label>
                    <p>{selectedLead.canal_preferido || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Franja horaria</label>
                    <p>{selectedLead.franja_horaria || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Fecha disponible</label>
                    <p>{selectedLead.fecha_disponible || '-'}</p>
                  </div>
                </div>

                {/* Comments */}
                {selectedLead.comentarios && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Comentarios</label>
                    <p className="mt-1 p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap">
                      {selectedLead.comentarios}
                    </p>
                  </div>
                )}

                {/* Source & Tracking */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Origen</label>
                    <p><Badge variant="outline">{sourceLabels[selectedLead.source]}</Badge></p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Página</label>
                    <p className="text-sm">{selectedLead.page || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">UTM Source</label>
                    <p className="text-sm">{selectedLead.utm_source || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">UTM Campaign</label>
                    <p className="text-sm">{selectedLead.utm_campaign || '-'}</p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground block mb-2">Estado</label>
                    <Select 
                      value={selectedLead.status} 
                      onValueChange={(value) => updateLeadStatus(selectedLead.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <Badge className={statusColors[selectedLead.status]}>
                          {statusLabels[selectedLead.status]}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Nuevo</SelectItem>
                        <SelectItem value="qualified">Cualificado</SelectItem>
                        <SelectItem value="contacted">Contactado</SelectItem>
                        <SelectItem value="scheduled">Cita programada</SelectItem>
                        <SelectItem value="closed">Cerrado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    {selectedLead.email && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${selectedLead.email}`}>
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </a>
                      </Button>
                    )}
                    {selectedLead.telefono && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`tel:${selectedLead.telefono}`}>
                          <Phone className="h-4 w-4 mr-2" />
                          Llamar
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdminLeads;
