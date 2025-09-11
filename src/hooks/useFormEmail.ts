import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FormEmailData {
  formType: string;
  nombre?: string;
  apellidos?: string;
  fullName?: string;
  email: string;
  phone?: string;
  [key: string]: any;
}

interface UseFormEmailOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  sendConfirmation?: boolean;
}

export const useFormEmail = (options?: UseFormEmailOptions) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const sendFormEmail = async (data: FormEmailData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Parse name fields
      const processedData = {
        ...data,
        // Add current page URL
        referrerUrl: window.location.href,
        // Add timestamp
        timestamp: new Date().toISOString(),
        // Parse fullName if only that field exists
        ...(data.fullName && !data.nombre && parseFullName(data.fullName)),
        sendConfirmation: options?.sendConfirmation ?? true
      };

      console.log('📤 Sending form email:', { formType: data.formType, email: data.email });

      const { data: response, error } = await supabase.functions.invoke('send-form-email', {
        body: processedData
      });

      if (error) {
        console.error('❌ Error sending form email:', error);
        throw error;
      }

      console.log('✅ Form email sent successfully');

      // GA4 tracking
      if (typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'form_submit', {
          form_type: data.formType,
          location: window.location.pathname,
          user_email: data.email
        });
      }

      toast({
        title: "¡Mensaje enviado!",
        description: "Te responderemos en menos de 24 horas.",
      });

      options?.onSuccess?.();

    } catch (error: any) {
      console.error('💥 Form email error:', error);
      
      toast({
        title: "Error al enviar",
        description: "Por favor, inténtalo de nuevo o contacta directamente.",
        variant: "destructive",
      });

      options?.onError?.(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    sendFormEmail,
    isSubmitting
  };
};

// Helper function to parse full name into nombre and apellidos
function parseFullName(fullName: string) {
  const nameParts = fullName.trim().split(' ');
  
  if (nameParts.length === 1) {
    return {
      nombre: nameParts[0],
      apellidos: ''
    };
  } else if (nameParts.length === 2) {
    return {
      nombre: nameParts[0],
      apellidos: nameParts[1]
    };
  } else {
    // More than 2 parts - first name is the first part, surname is the rest
    return {
      nombre: nameParts[0],
      apellidos: nameParts.slice(1).join(' ')
    };
  }
}