import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Unified Lead data interface matching the new Leads table schema
export interface UnifiedLeadData {
  // Required
  source: 'contact_form' | 'owners_form' | 'tenants_form' | 'chatbot';
  
  // Page info
  page?: string;
  
  // User type
  persona_tipo?: 'propietario' | 'inquilino' | 'empresa';
  
  // Contact info
  nombre?: string;
  telefono?: string;
  email?: string;
  
  // Location
  municipio?: string;
  barrio?: string;
  
  // Property data
  m2?: number;
  habitaciones?: number;
  estado_vivienda?: 'Reformado' | 'Buen estado' | 'A actualizar' | 'Obra nueva';
  fecha_disponible?: string; // YYYY-MM-DD format
  presupuesto_renta?: number;
  
  // Contact preferences
  canal_preferido?: 'llamada' | 'whatsapp' | 'email';
  franja_horaria?: string;
  
  // Comments
  comentarios?: string;
  
  // Marketing/tracking fields
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  
  // Consent
  consent?: boolean;
  
  // Status (defaults to 'new' in database)
  status?: 'new' | 'qualified' | 'contacted' | 'scheduled' | 'closed';
}

interface UseUnifiedLeadsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

// Helper function to get UTM parameters from URL
function getUTMParameters(): Pick<UnifiedLeadData, 'utm_source' | 'utm_medium' | 'utm_campaign' | 'page'> {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
    page: window.location.pathname
  };
}

// Validate Spanish phone (9 digits)
function validateSpanishPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\+]/g, '').replace(/^(34|0034)/, '');
  return /^[6-9]\d{8}$/.test(cleaned);
}

export function useUnifiedLeads(options: UseUnifiedLeadsOptions = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitLead = async (data: UnifiedLeadData) => {
    setIsSubmitting(true);
    try {
      // Add tracking information
      const trackingData = getUTMParameters();
      
      // Validate phone if provided
      if (data.telefono && !validateSpanishPhone(data.telefono)) {
        throw new Error('El teléfono debe ser un número español válido de 9 dígitos');
      }
      
      // Clean phone number
      const cleanedPhone = data.telefono 
        ? data.telefono.replace(/[\s\-\+]/g, '').replace(/^(34|0034)/, '')
        : undefined;
      
      // Prepare the complete lead data matching the new schema
      const leadData: Record<string, any> = {
        source: data.source,
        page: data.page || trackingData.page,
        persona_tipo: data.persona_tipo || null,
        nombre: data.nombre || null,
        telefono: cleanedPhone || null,
        email: data.email || null,
        municipio: data.municipio || null,
        barrio: data.barrio || null,
        m2: data.m2 ? Number(data.m2) : null,
        habitaciones: data.habitaciones ? Number(data.habitaciones) : null,
        estado_vivienda: data.estado_vivienda || null,
        fecha_disponible: data.fecha_disponible || null,
        presupuesto_renta: data.presupuesto_renta ? Number(data.presupuesto_renta) : null,
        canal_preferido: data.canal_preferido || null,
        franja_horaria: data.franja_horaria || null,
        comentarios: data.comentarios || null,
        utm_source: data.utm_source || trackingData.utm_source || null,
        utm_medium: data.utm_medium || trackingData.utm_medium || null,
        utm_campaign: data.utm_campaign || trackingData.utm_campaign || null,
        consent: data.consent === true,
        // status defaults to 'new' in database
      };

      console.log('Submitting unified lead data:', leadData);

      // Use type assertion to bypass strict typing since the types file hasn't been regenerated yet
      const { error } = await supabase
        .from('Leads')
        .insert([leadData] as any);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Send notification email
      try {
        await supabase.functions.invoke('send-form-email', {
          body: { 
            formType: data.source,
            nombre: data.nombre || '',
            email: data.email || '',
            phone: cleanedPhone || '',
            message: data.comentarios || '',
            municipio: data.municipio || '',
            persona_tipo: data.persona_tipo || '',
            m2: data.m2 || '',
            habitaciones: data.habitaciones || '',
            presupuesto_renta: data.presupuesto_renta || '',
            consent: data.consent || false
          }
        });
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
        // Don't fail the form submission if email fails
      }

      toast({
        title: "¡Formulario enviado!",
        description: "Gracias por contactarnos. Te responderemos pronto.",
      });

      options.onSuccess?.();
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast({
        title: "Error al enviar",
        description: error instanceof Error ? error.message : "Hubo un problema al enviar el formulario. Inténtalo de nuevo.",
        variant: "destructive",
      });
      options.onError?.(error as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitLead,
    isSubmitting
  };
}
