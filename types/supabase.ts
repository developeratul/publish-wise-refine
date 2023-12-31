export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      blogs: {
        Row: {
          content: string | null
          contentMarkdown: string | null
          created_at: string
          devToArticleCoverImagePath: string | null
          devToArticleId: string | null
          devToBlogUrl: string | null
          hashNodeArticleCoverImagePath: string | null
          hashNodeArticleId: string | null
          hashNodeBlogUrl: string | null
          id: string
          last_published_at: string | null
          mediumArticleId: string | null
          mediumBlogUrl: string | null
          publishingDetails: Json | null
          status: Database["public"]["Enums"]["BlogStatus"]
          tags: Json | null
          title: string
          user_id: string
        }
        Insert: {
          content?: string | null
          contentMarkdown?: string | null
          created_at?: string
          devToArticleCoverImagePath?: string | null
          devToArticleId?: string | null
          devToBlogUrl?: string | null
          hashNodeArticleCoverImagePath?: string | null
          hashNodeArticleId?: string | null
          hashNodeBlogUrl?: string | null
          id?: string
          last_published_at?: string | null
          mediumArticleId?: string | null
          mediumBlogUrl?: string | null
          publishingDetails?: Json | null
          status?: Database["public"]["Enums"]["BlogStatus"]
          tags?: Json | null
          title: string
          user_id: string
        }
        Update: {
          content?: string | null
          contentMarkdown?: string | null
          created_at?: string
          devToArticleCoverImagePath?: string | null
          devToArticleId?: string | null
          devToBlogUrl?: string | null
          hashNodeArticleCoverImagePath?: string | null
          hashNodeArticleId?: string | null
          hashNodeBlogUrl?: string | null
          id?: string
          last_published_at?: string | null
          mediumArticleId?: string | null
          mediumBlogUrl?: string | null
          publishingDetails?: Json | null
          status?: Database["public"]["Enums"]["BlogStatus"]
          tags?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blogs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          userId: string
        }
        Insert: {
          userId?: string
        }
        Update: {
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
      BlogStatus: "DRAFT" | "SCHEDULED" | "PUBLISHED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
