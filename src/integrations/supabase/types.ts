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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      chat_rate_limits: {
        Row: {
          created_at: string
          id: string
          ip_hash: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_hash: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_hash?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          updated_at: string
          whatsapp: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          updated_at?: string
          whatsapp: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      delivered_credentials: {
        Row: {
          account_email: string
          account_password_enc: string | null
          created_at: string
          customer_id: string | null
          delivered_at: string
          expires_at: string
          id: string
          modality: string | null
          notes: string | null
          order_id: string | null
          product_name: string
          updated_at: string
        }
        Insert: {
          account_email: string
          account_password_enc?: string | null
          created_at?: string
          customer_id?: string | null
          delivered_at?: string
          expires_at: string
          id?: string
          modality?: string | null
          notes?: string | null
          order_id?: string | null
          product_name: string
          updated_at?: string
        }
        Update: {
          account_email?: string
          account_password_enc?: string | null
          created_at?: string
          customer_id?: string | null
          delivered_at?: string
          expires_at?: string
          id?: string
          modality?: string | null
          notes?: string | null
          order_id?: string | null
          product_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivered_credentials_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivered_credentials_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_id: string | null
          customer_name: string
          customer_whatsapp: string
          id: string
          items: Json
          notes: string | null
          status: Database["public"]["Enums"]["order_status"]
          total_mxn: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          customer_name: string
          customer_whatsapp: string
          id?: string
          items?: Json
          notes?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_mxn?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          customer_name?: string
          customer_whatsapp?: string
          id?: string
          items?: Json
          notes?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_mxn?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          base_price_usd: number
          category: string
          created_at: string
          description: string | null
          durations: Json
          featured: boolean
          id: string
          image_url: string | null
          modalities: Json
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          base_price_usd?: number
          category: string
          created_at?: string
          description?: string | null
          durations?: Json
          featured?: boolean
          id?: string
          image_url?: string | null
          modalities?: Json
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          base_price_usd?: number
          category?: string
          created_at?: string
          description?: string | null
          durations?: Json
          featured?: boolean
          id?: string
          image_url?: string | null
          modalities?: Json
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          bank_details: string
          business_name: string
          business_owner: string
          created_at: string
          exchange_rate: number
          id: string
          multiplier_compartida: number
          multiplier_individual: number
          multiplier_perfil: number
          updated_at: string
          whatsapp_message_template: string
          whatsapp_number: string
        }
        Insert: {
          bank_details?: string
          business_name?: string
          business_owner?: string
          created_at?: string
          exchange_rate?: number
          id?: string
          multiplier_compartida?: number
          multiplier_individual?: number
          multiplier_perfil?: number
          updated_at?: string
          whatsapp_message_template?: string
          whatsapp_number?: string
        }
        Update: {
          bank_details?: string
          business_name?: string
          business_owner?: string
          created_at?: string
          exchange_rate?: number
          id?: string
          multiplier_compartida?: number
          multiplier_individual?: number
          multiplier_perfil?: number
          updated_at?: string
          whatsapp_message_template?: string
          whatsapp_number?: string
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
      _cred_key: { Args: never; Returns: string }
      admin_delete_credential: { Args: { _id: string }; Returns: undefined }
      admin_get_credentials: {
        Args: never
        Returns: {
          account_email: string
          account_password: string
          created_at: string
          customer_id: string
          delivered_at: string
          expires_at: string
          id: string
          modality: string
          notes: string
          order_id: string
          product_name: string
          updated_at: string
        }[]
      }
      admin_save_credential: {
        Args: {
          _account_email: string
          _account_password: string
          _customer_id: string
          _expires_at: string
          _id: string
          _modality: string
          _notes: string
          _order_id: string
          _product_name: string
        }
        Returns: string
      }
      create_public_order: {
        Args: {
          _customer_email: string
          _customer_name: string
          _customer_whatsapp: string
          _items: Json
          _notes: string
        }
        Returns: {
          bank_details: string
          order_id: string
          total_mxn: number
        }[]
      }
      get_public_settings: {
        Args: never
        Returns: {
          business_name: string
          exchange_rate: number
          multiplier_compartida: number
          multiplier_individual: number
          multiplier_perfil: number
          whatsapp_message_template: string
          whatsapp_number: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      order_status:
        | "pendiente"
        | "pagado"
        | "entregado"
        | "vencido"
        | "cancelado"
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
      app_role: ["admin", "user"],
      order_status: [
        "pendiente",
        "pagado",
        "entregado",
        "vencido",
        "cancelado",
      ],
    },
  },
} as const
