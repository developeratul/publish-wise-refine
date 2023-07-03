export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      blogs: {
        Row: {
          content: string | null;
          created_at: string;
          id: string;
          status: Database["public"]["Enums"]["BlogStatus"];
          title: string;
          user_id: string;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          id?: string;
          status?: Database["public"]["Enums"]["BlogStatus"];
          title: string;
          user_id: string;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          id?: string;
          status?: Database["public"]["Enums"]["BlogStatus"];
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blogs_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          devToAPIKey: string | null;
          hashnodeAPIKey: string | null;
          mediumAPIKey: string | null;
          userId: string;
        };
        Insert: {
          devToAPIKey?: string | null;
          hashnodeAPIKey?: string | null;
          mediumAPIKey?: string | null;
          userId?: string;
        };
        Update: {
          devToAPIKey?: string | null;
          hashnodeAPIKey?: string | null;
          mediumAPIKey?: string | null;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_userId_fkey";
            columns: ["userId"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      BlogStatus: "DRAFT" | "SCHEDULED" | "PUBLISHED";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
