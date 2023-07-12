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

export type BlogStatus = Database["public"]["Enums"]["BlogStatus"];

export type BlogProviders = "medium" | "dev.to" | "hashNode";

export type BlogApiKeyNames = "mediumAPIKey" | "devToAPIKey" | "hashNodeAPIKey";

export interface PublishBlogResponse {
  id: string;
  url: string;
}

export type DatabasePublishBlogFields =
  | "hashNodeBlogUrl"
  | "devToBlogUrl"
  | "mediumBlogUrl"
  | "hashNodeArticleId"
  | "devToArticleId";
