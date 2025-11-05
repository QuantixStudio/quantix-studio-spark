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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      documents: {
        Row: {
          content: string | null
          created_at: string
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          HTML: string | null
          id: string
          resend_id: string
          sent_at: string | null
          status: string | null
          subject: string | null
          template_name: string | null
          to_email: string
        }
        Insert: {
          HTML?: string | null
          id?: string
          resend_id: string
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          template_name?: string | null
          to_email: string
        }
        Update: {
          HTML?: string | null
          id?: string
          resend_id?: string
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          template_name?: string | null
          to_email?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string | null
          html_content: string
          id: string
          name: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          html_content: string
          id?: string
          name: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          html_content?: string
          id?: string
          name?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          budget_range: string | null
          company: string | null
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          page_path: string | null
          status: string | null
          timeline: string | null
          use_case: string | null
          utm_params: Json | null
        }
        Insert: {
          budget_range?: string | null
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          page_path?: string | null
          status?: string | null
          timeline?: string | null
          use_case?: string | null
          utm_params?: Json | null
        }
        Update: {
          budget_range?: string | null
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          page_path?: string | null
          status?: string | null
          timeline?: string | null
          use_case?: string | null
          utm_params?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_status_fkey"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "inquiry_status"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiry_status: {
        Row: {
          color: string | null
          id: string
          label: string | null
          order_index: number | null
        }
        Insert: {
          color?: string | null
          id: string
          label?: string | null
          order_index?: number | null
        }
        Update: {
          color?: string | null
          id?: string
          label?: string | null
          order_index?: number | null
        }
        Relationships: []
      }
      long_chat_history: {
        Row: {
          agent_message: string | null
          chat_id: number | null
          created_at: string
          id: number
          user_message: string | null
          username: string | null
        }
        Insert: {
          agent_message?: string | null
          chat_id?: number | null
          created_at?: string
          id?: number
          user_message?: string | null
          username?: string | null
        }
        Update: {
          agent_message?: string | null
          chat_id?: number | null
          created_at?: string
          id?: number
          user_message?: string | null
          username?: string | null
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          created_at: string
          id: number
          message: Json | null
          session_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          message?: Json | null
          session_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          message?: Json | null
          session_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      project_category: {
        Row: {
          description: string | null
          id: string
          name: string
          order_index: number | null
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          order_index?: number | null
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          order_index?: number | null
        }
        Relationships: []
      }
      project_technologies: {
        Row: {
          id: string
          legacy_technology_id: string | null
          project_id: string
          tools: string[] | null
        }
        Insert: {
          id?: string
          legacy_technology_id?: string | null
          project_id: string
          tools?: string[] | null
        }
        Update: {
          id?: string
          legacy_technology_id?: string | null
          project_id?: string
          tools?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "project_technologies_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_technologies_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_with_tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_technologies_technology_id_fkey"
            columns: ["legacy_technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category_id: string | null
          cover_url: string | null
          created_at: string | null
          demo_url: string | null
          full_description: string | null
          github_url: string | null
          id: string
          images: Json | null
          key_metric: string | null
          order_index: number | null
          published: boolean | null
          short_description: string
          show_on_home: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          cover_url?: string | null
          created_at?: string | null
          demo_url?: string | null
          full_description?: string | null
          github_url?: string | null
          id?: string
          images?: Json | null
          key_metric?: string | null
          order_index?: number | null
          published?: boolean | null
          short_description: string
          show_on_home?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          cover_url?: string | null
          created_at?: string | null
          demo_url?: string | null
          full_description?: string | null
          github_url?: string | null
          id?: string
          images?: Json | null
          key_metric?: string | null
          order_index?: number | null
          published?: boolean | null
          short_description?: string
          show_on_home?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "project_category"
            referencedColumns: ["id"]
          },
        ]
      }
      service_icon: {
        Row: {
          icon_url: string | null
          id: string
          name: string
        }
        Insert: {
          icon_url?: string | null
          id?: string
          name: string
        }
        Update: {
          icon_url?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string | null
          description: string
          icon_id: string | null
          id: string
          order_index: number | null
          published: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          icon_id?: string | null
          id?: string
          order_index?: number | null
          published?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          icon_id?: string | null
          id?: string
          order_index?: number | null
          published?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_icon_id_fkey"
            columns: ["icon_id"]
            isOneToOne: false
            referencedRelation: "service_icon"
            referencedColumns: ["id"]
          },
        ]
      }
      technologies: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string | null
          feedback: string
          id: string
          name: string
          order_index: number | null
          position: string | null
          published: boolean | null
          rating: number | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          feedback: string
          id?: string
          name: string
          order_index?: number | null
          position?: string | null
          published?: boolean | null
          rating?: number | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          feedback?: string
          id?: string
          name?: string
          order_index?: number | null
          position?: string | null
          published?: boolean | null
          rating?: number | null
        }
        Relationships: []
      }
      tools: {
        Row: {
          categories: string[]
          created_at: string | null
          description: string | null
          id: string
          is_featured: boolean | null
          logo_path: string | null
          name: string
          slug: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          categories?: string[]
          created_at?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          logo_path?: string | null
          name: string
          slug: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          categories?: string[]
          created_at?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          logo_path?: string | null
          name?: string
          slug?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string | null
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      projects_with_tools: {
        Row: {
          category_id: string | null
          cover_url: string | null
          created_at: string | null
          demo_url: string | null
          full_description: string | null
          github_url: string | null
          id: string | null
          images: Json | null
          key_metric: string | null
          order_index: number | null
          project_tools: Json | null
          published: boolean | null
          short_description: string | null
          show_on_home: boolean | null
          slug: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          cover_url?: string | null
          created_at?: string | null
          demo_url?: string | null
          full_description?: string | null
          github_url?: string | null
          id?: string | null
          images?: Json | null
          key_metric?: string | null
          order_index?: number | null
          project_tools?: never
          published?: boolean | null
          short_description?: string | null
          show_on_home?: boolean | null
          slug?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          cover_url?: string | null
          created_at?: string | null
          demo_url?: string | null
          full_description?: string | null
          github_url?: string | null
          id?: string | null
          images?: Json | null
          key_metric?: string | null
          order_index?: number | null
          project_tools?: never
          published?: boolean | null
          short_description?: string | null
          show_on_home?: boolean | null
          slug?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "project_category"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      tools_category:
        | "Frontend"
        | "Backend"
        | "Data base"
        | "AI"
        | "Automation"
        | "Design"
        | "CMS"
        | "Email & Marketing"
        | "Analytics"
        | "CRM / Business Tools"
        | "Mobile"
        | "SaaS"
        | "Full-stack"
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
      app_role: ["admin", "moderator", "user"],
      tools_category: [
        "Frontend",
        "Backend",
        "Data base",
        "AI",
        "Automation",
        "Design",
        "CMS",
        "Email & Marketing",
        "Analytics",
        "CRM / Business Tools",
        "Mobile",
        "SaaS",
        "Full-stack",
      ],
    },
  },
} as const
