import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LeadData {
  email: string;
  nombre?: string;
  telefono?: string;
  mensaje?: string;
  origen: string;
  source_tag?: string;
  service_interest?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  sale_timing?: string;
}

interface SolicitudData {
  nombre: string;
  email: string;
  telefono: string;
  tipo_propiedad?: string;
  ubicacion_propiedad?: string;
  tamano_propiedad?: string;
  situacion_actual?: string;
  servicios_interes?: string[];
  renta_mensual?: string;
  timeline?: string;
  info_adicional?: string;
}

interface UseSupabaseFormOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useSupabaseForm(options: UseSupabaseFormOptions = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitLead = async (data: LeadData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('leads')
        .insert([data]);

      if (error) throw error;

      // Send notification email
      try {
        await supabase.functions.invoke('send-form-email', {
          body: { 
            formType: 'contacto_general', 
            nombre: data.nombre,
            email: data.email,
            phone: data.telefono,
            message: data.mensaje,
            origen: data.origen,
            source_tag: data.source_tag,
            service_interest: data.service_interest
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

  const submitSolicitud = async (data: SolicitudData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('solicitudes')
        .insert([data]);

      if (error) throw error;

      // Send notification email
      try {
        await supabase.functions.invoke('send-form-email', {
          body: { 
            formType: 'solicitud_empresas', 
            nombre: data.nombre,
            email: data.email,
            phone: data.telefono,
            tipo_propiedad: data.tipo_propiedad,
            ubicacion_propiedad: data.ubicacion_propiedad,
            tamano_propiedad: data.tamano_propiedad,
            situacion_actual: data.situacion_actual,
            servicios_interes: data.servicios_interes,
            renta_mensual: data.renta_mensual,
            timeline: data.timeline,
            info_adicional: data.info_adicional
          }
        });
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
        // Don't fail the form submission if email fails
      }

      toast({
        title: "¡Solicitud enviada!",
        description: "Hemos recibido tu solicitud. Te contactaremos en breve.",
      });

      options.onSuccess?.();
    } catch (error) {
      console.error('Error submitting solicitud:', error);
      toast({
        title: "Error al enviar",
        description: "Hubo un problema al enviar la solicitud. Inténtalo de nuevo.",
        variant: "destructive",
      });
      options.onError?.(error as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitLead,
    submitSolicitud,
    isSubmitting
  };
}