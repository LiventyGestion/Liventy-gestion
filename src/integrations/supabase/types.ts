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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      anonymous_rate_limits: {
        Row: {
          attempt_count: number | null
          first_attempt: string | null
          id: string
          last_attempt: string | null
          operation_type: string
          session_id: string
        }
        Insert: {
          attempt_count?: number | null
          first_attempt?: string | null
          id?: string
          last_attempt?: string | null
          operation_type: string
          session_id: string
        }
        Update: {
          attempt_count?: number | null
          first_attempt?: string | null
          id?: string
          last_attempt?: string | null
          operation_type?: string
          session_id?: string
        }
        Relationships: []
      }
      availability: {
        Row: {
          created_at: string | null
          date: string
          id: string
          is_available: boolean | null
          service_type: string
          time_slot: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          is_available?: boolean | null
          service_type: string
          time_slot: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          is_available?: boolean | null
          service_type?: string
          time_slot?: string
        }
        Relationships: []
      }
      calculadora_resultados: {
        Row: {
          created_at: string
          email: string | null
          id: string
          inputs: Json
          lead_id: string | null
          outputs: Json
          source_tag: string | null
          tool: string | null
          user_id: string | null
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
          inputs: Json
          lead_id?: string | null
          outputs: Json
          source_tag?: string | null
          tool?: string | null
          user_id?: string | null
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
          inputs?: Json
          lead_id?: string | null
          outputs?: Json
          source_tag?: string | null
          tool?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calculadora_resultados_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          attachments: Json | null
          created_at: string | null
          id: string
          sender_role: string | null
          sender_user_id: string | null
          text: string | null
          thread_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          sender_role?: string | null
          sender_user_id?: string | null
          text?: string | null
          thread_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          sender_role?: string | null
          sender_user_id?: string | null
          text?: string | null
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_sender_user_id_fkey"
            columns: ["sender_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
          created_at: string | null
          id: string
          lease_id: string | null
          property_id: string | null
          status: Database["public"]["Enums"]["thread_status"] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lease_id?: string | null
          property_id?: string | null
          status?: Database["public"]["Enums"]["thread_status"] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lease_id?: string | null
          property_id?: string | null
          status?: Database["public"]["Enums"]["thread_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_threads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_context: {
        Row: {
          context_data: Json
          created_at: string
          effectiveness_score: number | null
          frequency_used: number | null
          id: string
          topic: string
          updated_at: string
        }
        Insert: {
          context_data: Json
          created_at?: string
          effectiveness_score?: number | null
          frequency_used?: number | null
          id?: string
          topic: string
          updated_at?: string
        }
        Update: {
          context_data?: Json
          created_at?: string
          effectiveness_score?: number | null
          frequency_used?: number | null
          id?: string
          topic?: string
          updated_at?: string
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
          user_email: string | null
          user_id: string | null
          user_name: string | null
          user_phone: string | null
          user_type: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          session_id: string
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
          user_phone?: string | null
          user_type?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          session_id?: string
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
          user_phone?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      chatbot_messages: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          intent: string | null
          is_bot: boolean
          message: string
          metadata: Json | null
          sentiment: string | null
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          intent?: string | null
          is_bot?: boolean
          message: string
          metadata?: Json | null
          sentiment?: string | null
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          intent?: string | null
          is_bot?: boolean
          message?: string
          metadata?: Json | null
          sentiment?: string | null
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
      Contratos: {
        Row: {
          estado: string | null
          fecha_fin: string | null
          fecha_inicio: string | null
          id: string
          pdf_url: string | null
          propiedad_id: string
        }
        Insert: {
          estado?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          id?: string
          pdf_url?: string | null
          propiedad_id: string
        }
        Update: {
          estado?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          id?: string
          pdf_url?: string | null
          propiedad_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contratos_propiedad_id_fkey"
            columns: ["propiedad_id"]
            isOneToOne: false
            referencedRelation: "Propiedades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contratos_propiedad"
            columns: ["propiedad_id"]
            isOneToOne: false
            referencedRelation: "Propiedades"
            referencedColumns: ["id"]
          },
        ]
      }
      Documentos: {
        Row: {
          fecha_subida: string | null
          id: string
          nombre_archivo: string | null
          propiedad_id: string
          tipo: string | null
          url: string | null
        }
        Insert: {
          fecha_subida?: string | null
          id?: string
          nombre_archivo?: string | null
          propiedad_id: string
          tipo?: string | null
          url?: string | null
        }
        Update: {
          fecha_subida?: string | null
          id?: string
          nombre_archivo?: string | null
          propiedad_id?: string
          tipo?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Documentos_propiedad_id_fkey"
            columns: ["propiedad_id"]
            isOneToOne: false
            referencedRelation: "Propiedades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_documentos_propiedad"
            columns: ["propiedad_id"]
            isOneToOne: false
            referencedRelation: "Propiedades"
            referencedColumns: ["id"]
          },
        ]
      }
      Incidencias: {
        Row: {
          descripcion: string | null
          estado: string | null
          fecha_creacion: string | null
          fecha_resolucion: string | null
          id: string
          propiedad_id: string
          service_request_id: string | null
        }
        Insert: {
          descripcion?: string | null
          estado?: string | null
          fecha_creacion?: string | null
          fecha_resolucion?: string | null
          id?: string
          propiedad_id: string
          service_request_id?: string | null
        }
        Update: {
          descripcion?: string | null
          estado?: string | null
          fecha_creacion?: string | null
          fecha_resolucion?: string | null
          id?: string
          propiedad_id?: string
          service_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_incidencias_propiedad"
            columns: ["propiedad_id"]
            isOneToOne: false
            referencedRelation: "Propiedades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidencias_propiedad_id_fkey"
            columns: ["propiedad_id"]
            isOneToOne: false
            referencedRelation: "Propiedades"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_rate_limits: {
        Row: {
          attempt_count: number | null
          email: string
          first_attempt: string | null
          id: string
          last_attempt: string | null
        }
        Insert: {
          attempt_count?: number | null
          email: string
          first_attempt?: string | null
          id?: string
          last_attempt?: string | null
        }
        Update: {
          attempt_count?: number | null
          email?: string
          first_attempt?: string | null
          id?: string
          last_attempt?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          phone: string | null
          sale_timing: string | null
          service_interest: string | null
          source_tag: string | null
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          phone?: string | null
          sale_timing?: string | null
          service_interest?: string | null
          source_tag?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          sale_timing?: string | null
          service_interest?: string | null
          source_tag?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      Pagos: {
        Row: {
          contrato_id: string
          estado: string | null
          fecha_pago: string | null
          id: string
          importe: number | null
        }
        Insert: {
          contrato_id: string
          estado?: string | null
          fecha_pago?: string | null
          id?: string
          importe?: number | null
        }
        Update: {
          contrato_id?: string
          estado?: string | null
          fecha_pago?: string | null
          id?: string
          importe?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pagos_contrato"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "Contratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagos_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "Contratos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      Propiedades: {
        Row: {
          descripcion: string | null
          direccion: string | null
          foto_url: string | null
          id: string
          usuario_id: string
        }
        Insert: {
          descripcion?: string | null
          direccion?: string | null
          foto_url?: string | null
          id?: string
          usuario_id: string
        }
        Update: {
          descripcion?: string | null
          direccion?: string | null
          foto_url?: string | null
          id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "propiedades_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "Usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          hours: number | null
          id: string
          maintenance_category:
            | Database["public"]["Enums"]["maintenance_category"]
            | null
          photos: Json | null
          priority: Database["public"]["Enums"]["priority_level"] | null
          role: string
          status: string | null
          time_slot: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          hours?: number | null
          id?: string
          maintenance_category?:
            | Database["public"]["Enums"]["maintenance_category"]
            | null
          photos?: Json | null
          priority?: Database["public"]["Enums"]["priority_level"] | null
          role: string
          status?: string | null
          time_slot?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          hours?: number | null
          id?: string
          maintenance_category?:
            | Database["public"]["Enums"]["maintenance_category"]
            | null
          photos?: Json | null
          priority?: Database["public"]["Enums"]["priority_level"] | null
          role?: string
          status?: string | null
          time_slot?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      Usuarios: {
        Row: {
          email: string | null
          id: string
          nombre: string | null
          rol: string | null
        }
        Insert: {
          email?: string | null
          id?: string
          nombre?: string | null
          rol?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          nombre?: string | null
          rol?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_anonymous_rate_limit: {
        Args: {
          max_attempts?: number
          p_operation_type: string
          p_session_id: string
          window_minutes?: number
        }
        Returns: boolean
      }
      check_lead_rate_limit: {
        Args: {
          max_attempts?: number
          p_email: string
          window_minutes?: number
        }
        Returns: boolean
      }
      cleanup_old_anonymous_conversations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_anonymous_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_anonymous_results: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_lead_rate_limits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_service_request_and_incident: {
        Args: {
          p_date: string
          p_description: string
          p_hours: number
          p_maint_cat: Database["public"]["Enums"]["maintenance_category"]
          p_priority: Database["public"]["Enums"]["priority_level"]
          p_time_slot: string
          p_type: string
        }
        Returns: string
      }
      detect_suspicious_activity: {
        Args: { check_window_minutes?: number }
        Returns: {
          activity_type: string
          attempt_count: number
          first_attempt: string
          identifier: string
          last_attempt: string
        }[]
      }
      detect_usuarios_suspicious_activity: {
        Args: Record<PropertyKey, never>
        Returns: {
          details: string
          event_time: string
          event_type: string
          target_user_id: string
          user_id: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      user_owns_property: {
        Args: { property_id: string }
        Returns: boolean
      }
      validate_chatbot_session_access: {
        Args: { p_session_id: string; p_user_id?: string }
        Returns: boolean
      }
      validate_email_format: {
        Args: { email: string }
        Returns: boolean
      }
      validate_lead_email: {
        Args: { p_email: string }
        Returns: boolean
      }
      validate_session_access: {
        Args: { p_session_id: string; p_user_id?: string }
        Returns: boolean
      }
    }
    Enums: {
      incident_status: "pendiente" | "en_curso" | "resuelta" | "cancelada"
      maintenance_category:
        | "albanileria"
        | "pintura"
        | "fontaneria"
        | "grifos"
        | "banos"
        | "cisternas"
        | "bajantes"
        | "atascos"
        | "cocinas"
        | "persianas"
        | "calefaccion"
        | "electricidad_general"
      priority_level: "baja" | "media" | "alta"
      thread_status: "abierto" | "en_seguimiento" | "resuelto"
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
      incident_status: ["pendiente", "en_curso", "resuelta", "cancelada"],
      maintenance_category: [
        "albanileria",
        "pintura",
        "fontaneria",
        "grifos",
        "banos",
        "cisternas",
        "bajantes",
        "atascos",
        "cocinas",
        "persianas",
        "calefaccion",
        "electricidad_general",
      ],
      priority_level: ["baja", "media", "alta"],
      thread_status: ["abierto", "en_seguimiento", "resuelto"],
    },
  },
} as const
