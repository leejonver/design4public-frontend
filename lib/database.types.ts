export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.4";
  };
  public: {
    Tables: {
      brands: {
        Row: {
          cover_image_url: string | null;
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          slug: string;
          updated_at: string;
          website_url: string | null;
        };
        Insert: {
          cover_image_url?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          slug: string;
          updated_at?: string;
          website_url?: string | null;
        };
        Update: {
          cover_image_url?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          slug?: string;
          updated_at?: string;
          website_url?: string | null;
        };
        Relationships: [];
      };
      image_tags: {
        Row: {
          created_at: string;
          image_id: string;
          tag_id: string;
        };
        Insert: {
          created_at?: string;
          image_id: string;
          tag_id: string;
        };
        Update: {
          created_at?: string;
          image_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "image_tags_image_id_fkey";
            columns: ["image_id"];
            isOneToOne: false;
            referencedRelation: "project_images";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "image_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          }
        ];
      };
      items: {
        Row: {
          brand_id: string | null;
          created_at: string;
          description: string | null;
          id: string;
          image_url: string | null;
          name: string;
          nara_url: string | null;
          slug: string;
          updated_at: string;
        };
        Insert: {
          brand_id?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          name: string;
          nara_url?: string | null;
          slug: string;
          updated_at?: string;
        };
        Update: {
          brand_id?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          name?: string;
          nara_url?: string | null;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_items_brand_id";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          role: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id: string;
          role?: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          role?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_images: {
        Row: {
          created_at: string;
          id: string;
          image_url: string;
          order: number | null;
          project_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          image_url: string;
          order?: number | null;
          project_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          image_url?: string;
          order?: number | null;
          project_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_images_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects_with_details";
            referencedColumns: ["id"];
          }
        ];
      };
      project_items: {
        Row: {
          created_at: string;
          item_id: string;
          project_id: string;
        };
        Insert: {
          created_at?: string;
          item_id: string;
          project_id: string;
        };
        Update: {
          created_at?: string;
          item_id?: string;
          project_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_items_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_items_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_items_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects_with_details";
            referencedColumns: ["id"];
          }
        ];
      };
      project_tags: {
        Row: {
          created_at: string;
          project_id: string;
          tag_id: string;
        };
        Insert: {
          created_at?: string;
          project_id: string;
          tag_id: string;
        };
        Update: {
          created_at?: string;
          project_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_tags_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_tags_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects_with_details";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          }
        ];
      };
      projects: {
        Row: {
          area: number | null;
          cover_image_url: string | null;
          created_at: string;
          description: string | null;
          id: string;
          slug: string;
          status: string;
          title: string;
          updated_at: string;
          year: number | null;
        };
        Insert: {
          area?: number | null;
          cover_image_url?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          slug: string;
          status?: string;
          title: string;
          updated_at?: string;
          year?: number | null;
        };
        Update: {
          area?: number | null;
          cover_image_url?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          slug?: string;
          status?: string;
          title?: string;
          updated_at?: string;
          year?: number | null;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      projects_with_details: {
        Row: {
          area: number | null;
          cover_image_url: string | null;
          created_at: string | null;
          description: string | null;
          id: string | null;
          images: Json | null;
          items: Json | null;
          slug: string | null;
          status: string | null;
          tags: Json | null;
          title: string | null;
          updated_at: string | null;
          year: number | null;
        };
        Insert: {
          area?: number | null;
          cover_image_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string | null;
          images?: never;
          items?: never;
          slug?: string | null;
          status?: string | null;
          tags?: never;
          title?: string | null;
          updated_at?: string | null;
          year?: number | null;
        };
        Update: {
          area?: number | null;
          cover_image_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string | null;
          images?: never;
          items?: never;
          slug?: string | null;
          status?: string | null;
          tags?: never;
          title?: string | null;
          updated_at?: string | null;
          year?: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      create_project_with_relations: {
        Args: {
          p_area: number;
          p_description: string;
          p_images: Database["public"]["CompositeTypes"]["project_image_type"][];
          p_inquiry_url: string;
          p_item_ids: string[];
          p_location: string;
          p_status: Database["public"]["Enums"]["project_status"];
          p_tag_ids: string[];
          p_title: string;
          p_year: number;
        };
        Returns: {
          area: number;
          created_at: string;
          description: string;
          id: string;
          inquiry_url: string;
          location: string;
          status: Database["public"]["Enums"]["project_status"];
          title: string;
          updated_at: string;
          year: number;
        }[];
      };
    };
    Enums: {
      project_status: "draft" | "published" | "hidden";
    };
    CompositeTypes: {
      project_image_type: {
        image_url: string | null;
        alt_text: string | null;
        is_main: boolean | null;
        order: number | null;
      };
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      project_status: ["draft", "published", "hidden"],
    },
  },
} as const;



