import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Filter, 
  Calendar,
  RefreshCw,
  X
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

// Lead type matching database schema
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

// Exact column order for export
const EXPORT_COLUMNS = [
  'id',
  'created_at',
  'source',
  'page',
  'persona_tipo',
  'nombre',
  'telefono',
  'email',
  'municipio',
  'barrio',
  'm2',
  'habitaciones',
  'estado_vivienda',
  'fecha_disponible',
  'presupuesto_renta',
  'canal_preferido',
  'franja_horaria',
  'comentarios',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'consent',
  'status'
] as const;

// Column headers in Spanish
const COLUMN_HEADERS: Record<string, string> = {
  id: 'ID',
  created_at: 'Fecha Creación',
  source: 'Origen',
  page: 'Página',
  persona_tipo: 'Tipo Persona',
  nombre: 'Nombre',
  telefono: 'Teléfono',
  email: 'Email',
  municipio: 'Municipio',
  barrio: 'Barrio',
  m2: 'M²',
  habitaciones: 'Habitaciones',
  estado_vivienda: 'Estado Vivienda',
  fecha_disponible: 'Fecha Disponible',
  presupuesto_renta: 'Presupuesto Renta',
  canal_preferido: 'Canal Preferido',
  franja_horaria: 'Franja Horaria',
  comentarios: 'Comentarios',
  utm_source: 'UTM Source',
  utm_medium: 'UTM Medium',
  utm_campaign: 'UTM Campaign',
  consent: 'Consentimiento',
  status: 'Estado'
};

// Source labels
const SOURCE_LABELS: Record<string, string> = {
  contact_form: 'Formulario contacto',
  owners_form: 'Formulario propietarios',
  tenants_form: 'Formulario inquilinos',
  chatbot: 'Chatbot'
};

// Status labels
const STATUS_LABELS: Record<string, string> = {
  new: 'Nuevo',
  qualified: 'Cualificado',
  contacted: 'Contactado',
  scheduled: 'Cita programada',
  closed: 'Cerrado'
};

// Format date as dd/MM/yyyy
const formatDateES = (dateStr: string | null): string => {
  if (!dateStr) return '';
  try {
    const date = parseISO(dateStr);
    return format(date, 'dd/MM/yyyy', { locale: es });
  } catch {
    return dateStr;
  }
};

// Format number with Spanish locale (comma decimal, dot thousands)
const formatNumberES = (num: number | null): string => {
  if (num === null || num === undefined) return '';
  return num.toLocaleString('es-ES', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 2 
  });
};

// Format consent as Sí/No
const formatConsent = (consent: boolean | null): string => {
  if (consent === null || consent === undefined) return '';
  return consent ? 'Sí' : 'No';
};

// Format a lead row for export
const formatLeadForExport = (lead: Lead): Record<string, string> => {
  const formatted: Record<string, string> = {};
  
  for (const col of EXPORT_COLUMNS) {
    const value = lead[col as keyof Lead];
    
    switch (col) {
      case 'created_at':
      case 'fecha_disponible':
        formatted[COLUMN_HEADERS[col]] = formatDateES(value as string);
        break;
      case 'm2':
      case 'habitaciones':
      case 'presupuesto_renta':
        formatted[COLUMN_HEADERS[col]] = formatNumberES(value as number);
        break;
      case 'consent':
        formatted[COLUMN_HEADERS[col]] = formatConsent(value as boolean);
        break;
      case 'source':
        formatted[COLUMN_HEADERS[col]] = SOURCE_LABELS[value as string] || (value as string) || '';
        break;
      case 'status':
        formatted[COLUMN_HEADERS[col]] = STATUS_LABELS[value as string] || (value as string) || '';
        break;
      default:
        formatted[COLUMN_HEADERS[col]] = value !== null && value !== undefined ? String(value) : '';
    }
  }
  
  return formatted;
};

export function LeadsExportView() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  
  // Filters
  const [personaFilter, setPersonaFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [municipioFilter, setMunicipioFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  
  // Unique values for filters
  const [uniqueMunicipios, setUniqueMunicipios] = useState<string[]>([]);

  // Fetch all leads
  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('Leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const leadsData = (data as Lead[]) || [];
      setLeads(leadsData);
      
      // Extract unique municipios
      const municipios = [...new Set(leadsData
        .map(l => l.municipio)
        .filter((m): m is string => m !== null && m !== '')
      )].sort();
      setUniqueMunicipios(municipios);
      
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los leads",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...leads];
    
    if (personaFilter !== 'all') {
      filtered = filtered.filter(l => l.persona_tipo === personaFilter);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(l => l.status === statusFilter);
    }
    if (municipioFilter !== 'all') {
      filtered = filtered.filter(l => l.municipio === municipioFilter);
    }
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(l => l.source === sourceFilter);
    }
    if (dateFrom) {
      filtered = filtered.filter(l => l.created_at >= dateFrom);
    }
    if (dateTo) {
      // Add one day to include the end date
      const endDate = new Date(dateTo);
      endDate.setDate(endDate.getDate() + 1);
      filtered = filtered.filter(l => l.created_at < endDate.toISOString());
    }
    
    setFilteredLeads(filtered);
  }, [leads, personaFilter, statusFilter, municipioFilter, sourceFilter, dateFrom, dateTo]);

  // Clear all filters
  const clearFilters = () => {
    setPersonaFilter("all");
    setStatusFilter("all");
    setMunicipioFilter("all");
    setSourceFilter("all");
    setDateFrom("");
    setDateTo("");
  };

  // Export to XLSX
  const exportToXLSX = () => {
    setIsExporting(true);
    try {
      const exportData = filteredLeads.map(formatLeadForExport);
      
      const worksheet = XLSX.utils.json_to_sheet(exportData, {
        header: EXPORT_COLUMNS.map(col => COLUMN_HEADERS[col])
      });
      
      // Set column widths
      const colWidths = EXPORT_COLUMNS.map(col => ({
        wch: Math.max(
          COLUMN_HEADERS[col].length,
          col === 'id' ? 36 : col === 'comentarios' ? 40 : 15
        )
      }));
      worksheet['!cols'] = colWidths;
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
      
      const timestamp = format(new Date(), 'yyyy-MM-dd_HHmm');
      XLSX.writeFile(workbook, `leads_export_${timestamp}.xlsx`);
      
      toast({
        title: "Exportación completada",
        description: `${filteredLeads.length} leads exportados a Excel`
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error de exportación",
        description: "No se pudo exportar a Excel",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Export to CSV with Spanish format
  const exportToCSV = () => {
    setIsExporting(true);
    try {
      const headers = EXPORT_COLUMNS.map(col => COLUMN_HEADERS[col]);
      
      // Escape CSV field for Spanish Excel (using ; separator)
      const escapeCSV = (value: string): string => {
        if (value.includes(';') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      };
      
      // BOM for UTF-8 Excel compatibility
      let csv = '\uFEFF';
      csv += headers.map(escapeCSV).join(';') + '\n';
      
      for (const lead of filteredLeads) {
        const formatted = formatLeadForExport(lead);
        const row = headers.map(h => escapeCSV(formatted[h] || ''));
        csv += row.join(';') + '\n';
      }
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const timestamp = format(new Date(), 'yyyy-MM-dd_HHmm');
      link.setAttribute('download', `leads_export_${timestamp}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Exportación completada",
        description: `${filteredLeads.length} leads exportados a CSV`
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error de exportación",
        description: "No se pudo exportar a CSV",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const hasActiveFilters = personaFilter !== 'all' || statusFilter !== 'all' || 
    municipioFilter !== 'all' || sourceFilter !== 'all' || dateFrom || dateTo;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                Vista de Exportación
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredLeads.length} de {leads.length} leads seleccionados
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchLeads}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportToCSV}
                disabled={isExporting || filteredLeads.length === 0}
              >
                <FileText className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button 
                size="sm" 
                onClick={exportToXLSX}
                disabled={isExporting || filteredLeads.length === 0}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Excel (XLSX)
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros Rápidos
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Tipo Persona</Label>
              <Select value={personaFilter} onValueChange={setPersonaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="propietario">Propietario</SelectItem>
                  <SelectItem value="inquilino">Inquilino</SelectItem>
                  <SelectItem value="empresa">Empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="new">Nuevo</SelectItem>
                  <SelectItem value="qualified">Cualificado</SelectItem>
                  <SelectItem value="contacted">Contactado</SelectItem>
                  <SelectItem value="scheduled">Cita programada</SelectItem>
                  <SelectItem value="closed">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Municipio</Label>
              <Select value={municipioFilter} onValueChange={setMunicipioFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {uniqueMunicipios.map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Origen</Label>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="contact_form">Formulario contacto</SelectItem>
                  <SelectItem value="owners_form">Formulario propietarios</SelectItem>
                  <SelectItem value="tenants_form">Formulario inquilinos</SelectItem>
                  <SelectItem value="chatbot">Chatbot</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Desde
              </Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Hasta
              </Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Filtros activos:</span>
              {personaFilter !== 'all' && (
                <Badge variant="secondary">{personaFilter}</Badge>
              )}
              {statusFilter !== 'all' && (
                <Badge variant="secondary">{STATUS_LABELS[statusFilter]}</Badge>
              )}
              {municipioFilter !== 'all' && (
                <Badge variant="secondary">{municipioFilter}</Badge>
              )}
              {sourceFilter !== 'all' && (
                <Badge variant="secondary">{SOURCE_LABELS[sourceFilter]}</Badge>
              )}
              {dateFrom && (
                <Badge variant="secondary">Desde: {formatDateES(dateFrom)}</Badge>
              )}
              {dateTo && (
                <Badge variant="secondary">Hasta: {formatDateES(dateTo)}</Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Vista Previa (primeros 10 registros)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Fecha</TableHead>
                  <TableHead className="whitespace-nowrap">Origen</TableHead>
                  <TableHead className="whitespace-nowrap">Tipo</TableHead>
                  <TableHead className="whitespace-nowrap">Nombre</TableHead>
                  <TableHead className="whitespace-nowrap">Teléfono</TableHead>
                  <TableHead className="whitespace-nowrap">Email</TableHead>
                  <TableHead className="whitespace-nowrap">Municipio</TableHead>
                  <TableHead className="whitespace-nowrap">Consentimiento</TableHead>
                  <TableHead className="whitespace-nowrap">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 9 }).map((_, j) => (
                        <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No hay leads con los filtros aplicados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.slice(0, 10).map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="whitespace-nowrap text-sm">
                        {formatDateES(lead.created_at)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="outline" className="text-xs">
                          {SOURCE_LABELS[lead.source] || lead.source}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {lead.persona_tipo || '-'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm font-medium">
                        {lead.nombre || '-'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {lead.telefono || '-'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {lead.email || '-'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {lead.municipio || '-'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant={lead.consent ? "default" : "secondary"} className="text-xs">
                          {formatConsent(lead.consent)}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {STATUS_LABELS[lead.status] || lead.status}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {filteredLeads.length > 10 && (
            <div className="p-4 text-center text-sm text-muted-foreground border-t">
              ... y {filteredLeads.length - 10} registros más
            </div>
          )}
        </CardContent>
      </Card>

      {/* Column Order Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Orden de Columnas en Exportación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {EXPORT_COLUMNS.map((col, idx) => (
              <Badge key={col} variant="outline" className="text-xs">
                {idx + 1}. {COLUMN_HEADERS[col]}
              </Badge>
            ))}
          </div>
          <div className="mt-4 text-sm text-muted-foreground space-y-1">
            <p>• Fechas en formato dd/MM/yyyy</p>
            <p>• Números con separador decimal "," y miles "."</p>
            <p>• Consentimiento: Sí/No</p>
            <p>• CSV con separador ";" (compatible Excel ES)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
