import { Database } from "./supabase";

export interface AppProps {
  children: React.ReactNode;
}

export type UserMetadata = Partial<{
  first_name: string;
  last_name: string;
  avatar_url: string;
}>;

export type Blog = Database["public"]["Tables"]["blogs"]["Row"];

export interface BlogUser {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
}

export interface BlogApiKeys {
  devToAPIKey: string | null;
  hashNodeAPIKey: string | null;
  hashNodeUsername: string | null;
  mediumAPIKey: string | null;
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Relations<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Relationships"];
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T];

export type BlogStatus = Enums<"BlogStatus">;

export type BlogProviders = "medium" | "dev.to" | "hashNode";

export type BlogApiKeyNames = "mediumAPIKey" | "devToAPIKey" | "hashNodeAPIKey";

export type PublishingDetails = Tables<"blog_publishing_details">;

export interface PublishBlogResponse {
  id: string;
  url: string;
}
