import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
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

export function ExportLeadsXLSXButton() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Fetch all leads
      const { data, error } = await supabase
        .from('Leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const leads = (data as Lead[]) || [];

      if (leads.length === 0) {
        toast({
          title: "Sin datos",
          description: "No hay leads para exportar",
          variant: "destructive"
        });
        return;
      }

      // Format data for export
      const exportData = leads.map(formatLeadForExport);
      
      // Create worksheet with exact column order
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
      
      // Create workbook and export
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
      
      // Filename: leads_YYYY-MM-DD.xlsx
      const filename = `leads_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      XLSX.writeFile(workbook, filename);
      
      toast({
        title: "Exportación completada",
        description: `${leads.length} leads exportados a ${filename}`
      });

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error de exportación",
        description: error instanceof Error ? error.message : "No se pudo exportar los leads",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      onClick={handleExport} 
      disabled={isExporting}
      className="gap-2"
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Exportando...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Exportar XLSX (Leads)
        </>
      )}
    </Button>
  );
}
