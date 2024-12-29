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
      businesses: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "businesses_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_media: {
        Row: {
          created_at: string
          description: string | null
          file_path: string
          id: string
          is_primary: boolean | null
          media_type: string | null
          product_id: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path: string
          id?: string
          is_primary?: boolean | null
          media_type?: string | null
          product_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string
          id?: string
          is_primary?: boolean | null
          media_type?: string | null
          product_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_media_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          price: number | null
          sku: string | null
          status: string | null
          stock_quantity: number | null
          storefront_id: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price?: number | null
          sku?: string | null
          status?: string | null
          stock_quantity?: number | null
          storefront_id?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price?: number | null
          sku?: string | null
          status?: string | null
          stock_quantity?: number | null
          storefront_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefronts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      storefronts: {
        Row: {
          accent_color: string | null
          accent_font_color: string | null
          age_verification_enabled: boolean | null
          age_verification_message: string | null
          age_verification_text: string | null
          business_id: string | null
          button_text: string | null
          created_at: string
          description: string | null
          favicon: string | null
          heading_text: string | null
          id: string
          instructions_button_text: string | null
          instructions_content: string | null
          instructions_enabled: boolean | null
          logo: string | null
          name: string
          page_title: string | null
          password: string | null
          password_required: boolean | null
          primary_color: string | null
          primary_font_color: string | null
          pwa_icon_192: string | null
          pwa_icon_512: string | null
          screenshot_desktop: string | null
          screenshot_mobile: string | null
          secondary_color: string | null
          secondary_font_color: string | null
          show_description: boolean | null
          site_logo: string | null
          status: string | null
          subheading_text: string | null
          updated_at: string
        }
        Insert: {
          accent_color?: string | null
          accent_font_color?: string | null
          age_verification_enabled?: boolean | null
          age_verification_message?: string | null
          age_verification_text?: string | null
          business_id?: string | null
          button_text?: string | null
          created_at?: string
          description?: string | null
          favicon?: string | null
          heading_text?: string | null
          id?: string
          instructions_button_text?: string | null
          instructions_content?: string | null
          instructions_enabled?: boolean | null
          logo?: string | null
          name: string
          page_title?: string | null
          password?: string | null
          password_required?: boolean | null
          primary_color?: string | null
          primary_font_color?: string | null
          pwa_icon_192?: string | null
          pwa_icon_512?: string | null
          screenshot_desktop?: string | null
          screenshot_mobile?: string | null
          secondary_color?: string | null
          secondary_font_color?: string | null
          show_description?: boolean | null
          site_logo?: string | null
          status?: string | null
          subheading_text?: string | null
          updated_at?: string
        }
        Update: {
          accent_color?: string | null
          accent_font_color?: string | null
          age_verification_enabled?: boolean | null
          age_verification_message?: string | null
          age_verification_text?: string | null
          business_id?: string | null
          button_text?: string | null
          created_at?: string
          description?: string | null
          favicon?: string | null
          heading_text?: string | null
          id?: string
          instructions_button_text?: string | null
          instructions_content?: string | null
          instructions_enabled?: boolean | null
          logo?: string | null
          name?: string
          page_title?: string | null
          password?: string | null
          password_required?: boolean | null
          primary_color?: string | null
          primary_font_color?: string | null
          pwa_icon_192?: string | null
          pwa_icon_512?: string | null
          screenshot_desktop?: string | null
          screenshot_mobile?: string | null
          secondary_color?: string | null
          secondary_font_color?: string | null
          show_description?: boolean | null
          site_logo?: string | null
          status?: string | null
          subheading_text?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "galleries_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "platform_admin" | "business_admin" | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
