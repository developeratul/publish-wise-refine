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
      blog_publishing_details: {
        Row: {
          blogId: string
          devToCoverImagePath: string | null
          devToTags: Json | null
          hashNodeCoverImagePath: string | null
          hashNodeSlug: string | null
          hashNodeSubtitle: string | null
          hashNodeTags: Json | null
          id: string
          mediumCoverImagePath: string | null
          mediumTags: Json | null
        }
        Insert: {
          blogId: string
          devToCoverImagePath?: string | null
          devToTags?: Json | null
          hashNodeCoverImagePath?: string | null
          hashNodeSlug?: string | null
          hashNodeSubtitle?: string | null
          hashNodeTags?: Json | null
          id?: string
          mediumCoverImagePath?: string | null
          mediumTags?: Json | null
        }
        Update: {
          blogId?: string
          devToCoverImagePath?: string | null
          devToTags?: Json | null
          hashNodeCoverImagePath?: string | null
          hashNodeSlug?: string | null
          hashNodeSubtitle?: string | null
          hashNodeTags?: Json | null
          id?: string
          mediumCoverImagePath?: string | null
          mediumTags?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_publishing_details_blogId_fkey"
            columns: ["blogId"]
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          }
        ]
      }
      blogs: {
        Row: {
          canonicalUrl: string | null
          content: string | null
          contentMarkdown: string | null
          created_at: string
          devToPostId: string | null
          devToPostUrl: string | null
          hashNodePostId: string | null
          hashNodePostUrl: string | null
          id: string
          last_published_at: string | null
          mediumPostId: string | null
          mediumPostUrl: string | null
          status: Database["public"]["Enums"]["BlogStatus"]
          tags: Json | null
          title: string
          user_id: string
        }
        Insert: {
          canonicalUrl?: string | null
          content?: string | null
          contentMarkdown?: string | null
          created_at?: string
          devToPostId?: string | null
          devToPostUrl?: string | null
          hashNodePostId?: string | null
          hashNodePostUrl?: string | null
          id?: string
          last_published_at?: string | null
          mediumPostId?: string | null
          mediumPostUrl?: string | null
          status?: Database["public"]["Enums"]["BlogStatus"]
          tags?: Json | null
          title: string
          user_id: string
        }
        Update: {
          canonicalUrl?: string | null
          content?: string | null
          contentMarkdown?: string | null
          created_at?: string
          devToPostId?: string | null
          devToPostUrl?: string | null
          hashNodePostId?: string | null
          hashNodePostUrl?: string | null
          id?: string
          last_published_at?: string | null
          mediumPostId?: string | null
          mediumPostUrl?: string | null
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
