export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          created_at: string | null
          date: string
          id: string
          notes: string | null
          salon_id: string
          service_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          salon_id: string
          service_id: string
          status: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          salon_id?: string
          service_id?: string
          status?: string
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
          {
            foreignKeyName: "appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      news_items: {
        Row: {
          category: string
          content: string
          date: string
          id: string
          image: string | null
          title: string
        }
        Insert: {
          category: string
          content: string
          date: string
          id?: string
          image?: string | null
          title: string
        }
        Update: {
          category?: string
          content?: string
          date?: string
          id?: string
          image?: string | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          role: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          email: string
          id: string
          name: string
          phone?: string | null
          role: string
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          created_at: string | null
          description: string
          discount: number
          end_date: string
          id: string
          image: string | null
          salon_id: string
          start_date: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          discount: number
          end_date: string
          id?: string
          image?: string | null
          salon_id: string
          start_date: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          discount?: number
          end_date?: string
          id?: string
          image?: string | null
          salon_id?: string
          start_date?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotions_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          appointment_id: string | null
          comment: string
          created_at: string | null
          id: string
          rating: number
          salon_id: string
          user_id: string
        }
        Insert: {
          appointment_id?: string | null
          comment: string
          created_at?: string | null
          id?: string
          rating: number
          salon_id: string
          user_id: string
        }
        Update: {
          appointment_id?: string | null
          comment?: string
          created_at?: string | null
          id?: string
          rating?: number
          salon_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_request_images: {
        Row: {
          id: string
          image_url: string
          request_id: string
        }
        Insert: {
          id?: string
          image_url: string
          request_id: string
        }
        Update: {
          id?: string
          image_url?: string
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "salon_request_images_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "salon_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_request_services: {
        Row: {
          description: string
          duration: string
          id: string
          name: string
          price: string
          request_id: string
        }
        Insert: {
          description: string
          duration: string
          id?: string
          name: string
          price: string
          request_id: string
        }
        Update: {
          description?: string
          duration?: string
          id?: string
          name?: string
          price?: string
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "salon_request_services_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "salon_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_request_social_media: {
        Row: {
          facebook: string | null
          instagram: string | null
          linkedin: string | null
          request_id: string
          tiktok: string | null
          twitter: string | null
          youtube: string | null
        }
        Insert: {
          facebook?: string | null
          instagram?: string | null
          linkedin?: string | null
          request_id: string
          tiktok?: string | null
          twitter?: string | null
          youtube?: string | null
        }
        Update: {
          facebook?: string | null
          instagram?: string | null
          linkedin?: string | null
          request_id?: string
          tiktok?: string | null
          twitter?: string | null
          youtube?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "salon_request_social_media_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: true
            referencedRelation: "salon_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_requests: {
        Row: {
          address: string
          city: string
          created_at: string | null
          description: string
          id: string
          name: string
          owner_email: string
          owner_name: string
          owner_phone: string
          status: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          description: string
          id?: string
          name: string
          owner_email: string
          owner_name: string
          owner_phone: string
          status: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          owner_email?: string
          owner_name?: string
          owner_phone?: string
          status?: string
        }
        Relationships: []
      }
      salon_social_media: {
        Row: {
          facebook: string | null
          instagram: string | null
          linkedin: string | null
          salon_id: string
          tiktok: string | null
          twitter: string | null
          youtube: string | null
        }
        Insert: {
          facebook?: string | null
          instagram?: string | null
          linkedin?: string | null
          salon_id: string
          tiktok?: string | null
          twitter?: string | null
          youtube?: string | null
        }
        Update: {
          facebook?: string | null
          instagram?: string | null
          linkedin?: string | null
          salon_id?: string
          tiktok?: string | null
          twitter?: string | null
          youtube?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "salon_social_media_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: true
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salons: {
        Row: {
          address: string
          city: string
          cover_image: string
          created_at: string | null
          description: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          owner_id: string
          rating: number | null
          review_count: number | null
          status: string
        }
        Insert: {
          address: string
          city: string
          cover_image: string
          created_at?: string | null
          description: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          owner_id: string
          rating?: number | null
          review_count?: number | null
          status: string
        }
        Update: {
          address?: string
          city?: string
          cover_image?: string
          created_at?: string | null
          description?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          owner_id?: string
          rating?: number | null
          review_count?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "salons_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category_id: string
          description: string
          duration: number
          id: string
          image: string | null
          name: string
          price: number
          salon_id: string
        }
        Insert: {
          category_id: string
          description: string
          duration: number
          id?: string
          image?: string | null
          name: string
          price: number
          salon_id: string
        }
        Update: {
          category_id?: string
          description?: string
          duration?: number
          id?: string
          image?: string | null
          name?: string
          price?: number
          salon_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
