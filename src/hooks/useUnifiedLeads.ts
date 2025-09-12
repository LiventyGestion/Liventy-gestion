import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UnifiedLeadData {
  // Required
  origen: string;
  
  // Personal info
  nombre?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  mensaje?: string;
  info_adicional?: string;
  
  // Property data
  ubicacion?: string;
  tipo_propiedad?: string;
  m2?: number;
  habitaciones?: number;
  alquiler_deseado?: number;
  fecha_disponibilidad?: string; // YYYY-MM-DD format
  
  // Consent checkboxes (boolean values)
  acepta_politica?: boolean;
  acepta_comercial?: boolean;
  acepta_cookies?: boolean;
  
  // Marketing/tracking fields
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  page_url?: string;
  referrer?: string;
  ip?: string;
  user_agent?: string;
  
  // Raw form payload for backup
  payload?: any;
}

interface UseUnifiedLeadsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

// Helper function to get UTM parameters from URL
function getUTMParameters(): Partial<UnifiedLeadData> {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
    utm_term: urlParams.get('utm_term') || undefined,
    utm_content: urlParams.get('utm_content') || undefined,
    page_url: window.location.href,
    referrer: document.referrer || undefined,
    user_agent: navigator.userAgent || undefined
  };
}

export function useUnifiedLeads(options: UseUnifiedLeadsOptions = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitLead = async (data: UnifiedLeadData) => {
    setIsSubmitting(true);
    try {
      // Add tracking information
      const trackingData = getUTMParameters();
      
      // Prepare the complete lead data
      const leadData = {
        ...data,
        ...trackingData,
        // Ensure booleans are properly set
        acepta_politica: data.acepta_politica === true,
        acepta_comercial: data.acepta_comercial === true,
        acepta_cookies: data.acepta_cookies === true,
        // Convert numeric values properly
        m2: data.m2 ? Number(data.m2) : null,
        habitaciones: data.habitaciones ? Number(data.habitaciones) : null,
        alquiler_deseado: data.alquiler_deseado ? Number(data.alquiler_deseado) : null,
        // Store raw payload for debugging/backup  
        payload: JSON.parse(JSON.stringify(data.payload || data))
      };

      console.log('Submitting lead data:', leadData); // For debugging

      const { error } = await supabase
        .from('Leads')
        .insert([leadData]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Send notification email
      try {
        await supabase.functions.invoke('send-form-email', {
          body: { 
            formType: data.origen || 'contacto',
            nombre: data.nombre || '',
            apellidos: data.apellidos || '',
            fullName: `${data.nombre || ''} ${data.apellidos || ''}`.trim(),
            email: data.email || '',
            phone: data.telefono || '',
            message: data.mensaje || '',
            info_adicional: data.info_adicional || '',
            ubicacion: data.ubicacion || '',
            tipo_propiedad: data.tipo_propiedad || '',
            m2: data.m2 || '',
            habitaciones: data.habitaciones || '',
            alquiler_deseado: data.alquiler_deseado || '',
            acepta_politica: data.acepta_politica || false,
            acepta_comercial: data.acepta_comercial || false,
            source_tag: data.utm_source || 'direct'
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
        description: "Hubo un problema al enviar el formulario. Inténtalo de nuevo.",
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