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
        }
        Insert: {
          descripcion?: string | null
          estado?: string | null
          fecha_creacion?: string | null
          fecha_resolucion?: string | null
          id?: string
          propiedad_id: string
        }
        Update: {
          descripcion?: string | null
          estado?: string | null
          fecha_creacion?: string | null
          fecha_resolucion?: string | null
          id?: string
          propiedad_id?: string
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
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      user_owns_property: {
        Args: { property_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
