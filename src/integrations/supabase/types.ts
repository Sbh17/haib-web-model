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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          end_time: string
          id: string
          notes: string | null
          salon_id: string
          service_id: string
          status: string | null
          total_price: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          end_time: string
          id?: string
          notes?: string | null
          salon_id: string
          service_id: string
          status?: string | null
          total_price?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          end_time?: string
          id?: string
          notes?: string | null
          salon_id?: string
          service_id?: string
          status?: string | null
          total_price?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      partnership_request_services: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          name: string
          partnership_request_id: string
          price: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          name: string
          partnership_request_id: string
          price: number
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          name?: string
          partnership_request_id?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "partnership_request_services_partnership_request_id_fkey"
            columns: ["partnership_request_id"]
            isOneToOne: false
            referencedRelation: "salon_partnership_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      review_helpful_votes: {
        Row: {
          created_at: string
          id: string
          is_helpful: boolean
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_helpful: boolean
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_helpful?: boolean
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_helpful_votes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          appointment_id: string | null
          comment: string
          created_at: string
          helpful_count: number
          id: string
          rating: number
          salon_id: string
          staff_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_id?: string | null
          comment: string
          created_at?: string
          helpful_count?: number
          id?: string
          rating: number
          salon_id: string
          staff_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_id?: string | null
          comment?: string
          created_at?: string
          helpful_count?: number
          id?: string
          rating?: number
          salon_id?: string
          staff_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      salon_partnership_requests: {
        Row: {
          address: string
          admin_notes: string | null
          business_id: string | null
          city: string
          cover_image: string | null
          created_at: string
          description: string
          email: string
          id: string
          images: string[] | null
          owner_email: string
          owner_name: string
          owner_phone: string | null
          phone: string | null
          rejection_reason: string | null
          review_progress: number | null
          reviewed_at: string | null
          salon_name: string
          social_media: Json | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address: string
          admin_notes?: string | null
          business_id?: string | null
          city: string
          cover_image?: string | null
          created_at?: string
          description: string
          email: string
          id?: string
          images?: string[] | null
          owner_email: string
          owner_name: string
          owner_phone?: string | null
          phone?: string | null
          rejection_reason?: string | null
          review_progress?: number | null
          reviewed_at?: string | null
          salon_name: string
          social_media?: Json | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string
          admin_notes?: string | null
          business_id?: string | null
          city?: string
          cover_image?: string | null
          created_at?: string
          description?: string
          email?: string
          id?: string
          images?: string[] | null
          owner_email?: string
          owner_name?: string
          owner_phone?: string | null
          phone?: string | null
          rejection_reason?: string | null
          review_progress?: number | null
          reviewed_at?: string | null
          salon_name?: string
          social_media?: Json | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      salons: {
        Row: {
          address: string
          created_at: string
          description: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          opening_hours: Json | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          opening_hours?: Json | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          opening_hours?: Json | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean | null
          name: string
          price: number
          salon_id: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          salon_id: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          salon_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          salon_id: string
          specialties: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          salon_id: string
          specialties?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          salon_id?: string
          specialties?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_push_tokens: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          platform: string
          push_token: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          platform: string
          push_token: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          platform?: string
          push_token?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
