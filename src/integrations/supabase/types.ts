export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      calculadora_resultados: {
        Row: {
          created_at: string
          email: string | null
          id: string
          inputs: Json
          outputs: Json
          tool_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          inputs: Json
          outputs: Json
          tool_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          inputs?: Json
          outputs?: Json
          tool_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          attachments: Json | null
          created_at: string
          id: string
          metadata: Json | null
          sender_role: string
          sender_user_id: string | null
          text: string
          thread_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          id?: string
          metadata?: Json | null
          sender_role: string
          sender_user_id?: string | null
          text: string
          thread_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          id?: string
          metadata?: Json | null
          sender_role?: string
          sender_user_id?: string | null
          text?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_threads: {
        Row: {
          created_at: string
          id: string
          lease_id: string | null
          property_id: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          lease_id?: string | null
          property_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          lease_id?: string | null
          property_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      chatbot_conversations: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          session_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          session_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          session_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      chatbot_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chatbot_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ip_rate_limits: {
        Row: {
          attempt_count: number | null
          blocked_until: string | null
          created_at: string
          id: string
          ip_address: string
          operation_type: string
          updated_at: string
        }
        Insert: {
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string
          id?: string
          ip_address: string
          operation_type: string
          updated_at?: string
        }
        Update: {
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string
          id?: string
          ip_address?: string
          operation_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string | null
          id: string
          mensaje: string | null
          nombre: string | null
          origen: string | null
          sale_timing: string | null
          service_interest: string | null
          source_tag: string | null
          telefono: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          mensaje?: string | null
          nombre?: string | null
          origen?: string | null
          sale_timing?: string | null
          service_interest?: string | null
          source_tag?: string | null
          telefono?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          mensaje?: string | null
          nombre?: string | null
          origen?: string | null
          sale_timing?: string | null
          service_interest?: string | null
          source_tag?: string | null
          telefono?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      Leads: {
        Row: {
          acepta_comercial: boolean | null
          acepta_cookies: boolean | null
          acepta_politica: boolean | null
          alquiler_deseado: number | null
          apellidos: string | null
          created_at: string
          email: string | null
          fecha_disponibilidad: string | null
          habitaciones: number | null
          id: string
          info_adicional: string | null
          ip: string | null
          m2: number | null
          mensaje: string | null
          nombre: string | null
          origen: string
          page_url: string | null
          payload: Json | null
          referrer: string | null
          telefono: string | null
          tipo_propiedad: string | null
          ubicacion: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          acepta_comercial?: boolean | null
          acepta_cookies?: boolean | null
          acepta_politica?: boolean | null
          alquiler_deseado?: number | null
          apellidos?: string | null
          created_at?: string
          email?: string | null
          fecha_disponibilidad?: string | null
          habitaciones?: number | null
          id?: string
          info_adicional?: string | null
          ip?: string | null
          m2?: number | null
          mensaje?: string | null
          nombre?: string | null
          origen: string
          page_url?: string | null
          payload?: Json | null
          referrer?: string | null
          telefono?: string | null
          tipo_propiedad?: string | null
          ubicacion?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          acepta_comercial?: boolean | null
          acepta_cookies?: boolean | null
          acepta_politica?: boolean | null
          alquiler_deseado?: number | null
          apellidos?: string | null
          created_at?: string
          email?: string | null
          fecha_disponibilidad?: string | null
          habitaciones?: number | null
          id?: string
          info_adicional?: string | null
          ip?: string | null
          m2?: number | null
          mensaje?: string | null
          nombre?: string | null
          origen?: string
          page_url?: string | null
          payload?: Json | null
          referrer?: string | null
          telefono?: string | null
          tipo_propiedad?: string | null
          ubicacion?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          created_at: string
          details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          severity: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          severity?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          severity?: string
          user_id?: string | null
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          created_at: string
          date: string
          description: string | null
          hours: number | null
          id: string
          maintenance_category: string | null
          photos: Json | null
          priority: string | null
          role: string
          status: string | null
          time_slot: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          hours?: number | null
          id?: string
          maintenance_category?: string | null
          photos?: Json | null
          priority?: string | null
          role?: string
          status?: string | null
          time_slot?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          hours?: number | null
          id?: string
          maintenance_category?: string | null
          photos?: Json | null
          priority?: string | null
          role?: string
          status?: string | null
          time_slot?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      solicitudes: {
        Row: {
          created_at: string
          detalles: Json | null
          direccion: string | null
          email: string
          id: string
          info_adicional: string | null
          nombre: string
          renta_mensual: string | null
          servicios_interes: string[] | null
          situacion_actual: string | null
          tamano_propiedad: string | null
          telefono: string | null
          timeline: string | null
          tipo_propiedad: string | null
          tipo_servicio: string | null
          ubicacion_propiedad: string | null
        }
        Insert: {
          created_at?: string
          detalles?: Json | null
          direccion?: string | null
          email: string
          id?: string
          info_adicional?: string | null
          nombre: string
          renta_mensual?: string | null
          servicios_interes?: string[] | null
          situacion_actual?: string | null
          tamano_propiedad?: string | null
          telefono?: string | null
          timeline?: string | null
          tipo_propiedad?: string | null
          tipo_servicio?: string | null
          ubicacion_propiedad?: string | null
        }
        Update: {
          created_at?: string
          detalles?: Json | null
          direccion?: string | null
          email?: string
          id?: string
          info_adicional?: string | null
          nombre?: string
          renta_mensual?: string | null
          servicios_interes?: string[] | null
          situacion_actual?: string | null
          tamano_propiedad?: string | null
          telefono?: string | null
          timeline?: string | null
          tipo_propiedad?: string | null
          tipo_servicio?: string | null
          ubicacion_propiedad?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_service_request_and_incident: {
        Args: {
          p_date: string
          p_description?: string
          p_hours?: number
          p_maint_cat?: string
          p_priority?: string
          p_time_slot?: string
          p_type: string
        }
        Returns: string
      }
      detect_advanced_security_threats: {
        Args: never
        Returns: {
          created_at: string
          details: Json
          severity: string
          threat_type: string
        }[]
      }
      get_user_role: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_security_event: {
        Args: { p_details: Json; p_event_type: string; p_severity?: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "propietario" | "inquilino"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "propietario", "inquilino"],
    },
  },
} as const
