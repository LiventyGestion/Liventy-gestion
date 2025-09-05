import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import { Database } from '@/integrations/supabase/types';

export interface ServiceRequest {
  id: string;
  user_id: string;
  role: string;
  type: Database['public']['Tables']['service_requests']['Row']['type'];
  date: string;
  time_slot?: string;
  hours?: number;
  priority?: Database['public']['Tables']['service_requests']['Row']['priority'];
  maintenance_category?: Database['public']['Tables']['service_requests']['Row']['maintenance_category'];
  description?: string;
  photos?: Database['public']['Tables']['service_requests']['Row']['photos'];
  status: string;
  created_at: string;
}

export interface CreateServiceRequestParams {
  type: Database['public']['Tables']['service_requests']['Row']['type'];
  date: Date;
  time_slot?: string;
  hours?: number;
  priority?: Database['public']['Tables']['service_requests']['Row']['priority'];
  maintenance_category?: Database['public']['Tables']['service_requests']['Row']['maintenance_category'];
  description?: string;
  photos?: string[];
}

export function useServiceRequests() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createServiceRequest = async (params: CreateServiceRequestParams) => {
    setIsLoading(true);
    try {
      // Usar la función RPC que crea la solicitud y la incidencia automáticamente
      const { data, error } = await supabase.rpc('create_service_request_and_incident', {
        p_type: params.type,
        p_date: params.date.toISOString().split('T')[0], // Solo la fecha
        p_time_slot: params.time_slot || null,
        p_hours: params.hours || null,
        p_priority: params.priority || null,
        p_maint_cat: params.maintenance_category as any || null,
        p_description: params.description || ''
      });

      if (error) {
        console.error('Error creating service request:', error);
        toast({
          title: "Error",
          description: "No se pudo crear la solicitud. Intenta de nuevo.",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Solicitud creada",
        description: `Tu solicitud de ${params.type} ha sido registrada correctamente.`,
      });

      return data; // ID de la solicitud creada
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado. Intenta de nuevo.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getServiceRequests = async (): Promise<ServiceRequest[]> => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching service requests:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  };

  const updateServiceRequestStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating service request:', error);
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Estado actualizado",
        description: "El estado de la solicitud ha sido actualizado.",
      });

      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return {
    createServiceRequest,
    getServiceRequests,
    updateServiceRequestStatus,
    isLoading
  };
}