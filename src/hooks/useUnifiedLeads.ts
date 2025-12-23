import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Unified Lead data interface matching the Leads table schema
export interface UnifiedLeadData {
  // Required
  source: 'contact_form' | 'owners_form' | 'tenants_form' | 'chatbot';
  
  // Page info (auto-captured)
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
  
  // Marketing/tracking fields (auto-captured from URL)
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  
  // Consent (REQUIRED - blocks submission if false)
  consent: boolean;
  
  // Status (defaults to 'new' in database)
  status?: 'new' | 'qualified' | 'contacted' | 'scheduled' | 'closed';
}

interface UseUnifiedLeadsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

// Helper function to get UTM parameters from URL
function getUTMParameters(): Pick<UnifiedLeadData, 'utm_source' | 'utm_medium' | 'utm_campaign' | 'page'> {
  if (typeof window === 'undefined') return { consent: false } as any;
  
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
    page: window.location.pathname
  };
}

// Validate Spanish phone (9 digits starting with 6, 7, 8, or 9)
export function validateSpanishPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-\+\(\)]/g, '').replace(/^(34|0034)/, '');
  return /^[6-9]\d{8}$/.test(cleaned);
}

// Validate email format
export function validateEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

// Clean phone number (remove formatting, country code)
function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[\s\-\+\(\)]/g, '').replace(/^(34|0034)/, '');
}

export function useUnifiedLeads(options: UseUnifiedLeadsOptions = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitLead = async (data: UnifiedLeadData) => {
    setIsSubmitting(true);
    try {
      // CRITICAL: Block submission if consent is not true
      if (data.consent !== true) {
        throw new Error('Debes aceptar la política de privacidad para continuar');
      }
      
      // Add tracking information
      const trackingData = getUTMParameters();
      
      // Validate phone if provided
      if (data.telefono) {
        if (!validateSpanishPhone(data.telefono)) {
          throw new Error('El teléfono debe ser un número español válido de 9 dígitos');
        }
      }
      
      // Validate email if provided
      if (data.email) {
        if (!validateEmail(data.email)) {
          throw new Error('El email introducido no es válido');
        }
      }
      
      // Clean phone number
      const cleanedPhone = data.telefono ? cleanPhoneNumber(data.telefono) : null;
      
      // Prepare the complete lead data matching the schema
      const leadData: Record<string, any> = {
        source: data.source,
        page: data.page || trackingData.page,
        persona_tipo: data.persona_tipo || null,
        nombre: data.nombre?.trim() || null,
        telefono: cleanedPhone,
        email: data.email?.trim().toLowerCase() || null,
        municipio: data.municipio?.trim() || null,
        barrio: data.barrio?.trim() || null,
        m2: data.m2 ? Number(data.m2) : null,
        habitaciones: data.habitaciones ? Number(data.habitaciones) : null,
        estado_vivienda: data.estado_vivienda || null,
        fecha_disponible: data.fecha_disponible || null,
        presupuesto_renta: data.presupuesto_renta ? Number(data.presupuesto_renta) : null,
        canal_preferido: data.canal_preferido || null,
        franja_horaria: data.franja_horaria || null,
        comentarios: data.comentarios?.trim() || null,
        utm_source: data.utm_source || trackingData.utm_source || null,
        utm_medium: data.utm_medium || trackingData.utm_medium || null,
        utm_campaign: data.utm_campaign || trackingData.utm_campaign || null,
        consent: true, // Only reach here if consent is true
        status: 'new'
      };

      console.log('Submitting unified lead data:', leadData);

      // Insert into Leads table
      const { data: insertedLead, error } = await supabase
        .from('Leads')
        .insert([leadData] as any)
        .select('id')
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      const leadId = insertedLead?.id;

      // Send notification email with specified format
      try {
        await supabase.functions.invoke('send-form-email', {
          body: { 
            formType: 'lead_notification',
            leadId: leadId,
            source: data.source,
            persona_tipo: data.persona_tipo || 'contacto',
            nombre: data.nombre?.trim() || 'Sin nombre',
            telefono: cleanedPhone || '',
            email: data.email?.trim() || '',
            municipio: data.municipio?.trim() || '',
            barrio: data.barrio?.trim() || '',
            m2: data.m2 || null,
            habitaciones: data.habitaciones || null,
            estado_vivienda: data.estado_vivienda || '',
            fecha_disponible: data.fecha_disponible || '',
            presupuesto_renta: data.presupuesto_renta || null,
            canal_preferido: data.canal_preferido || '',
            franja_horaria: data.franja_horaria || '',
            comentarios: data.comentarios?.trim() || '',
            page: data.page || trackingData.page || '',
            utm_source: leadData.utm_source,
            utm_medium: leadData.utm_medium,
            utm_campaign: leadData.utm_campaign
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
    isSubmitting,
    validateSpanishPhone,
    validateEmail
  };
}
