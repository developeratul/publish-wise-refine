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

export type BlogStatus = Database["public"]["Enums"]["BlogStatus"];
