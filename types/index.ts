import { Database } from "./supabase";

export interface AppProps {
  children: React.ReactNode;
}

export type UserMetadata = Partial<{
  firstName: string;
  lastName: string;
  avatarUrl: string;
}>;

export type Blog = Database["public"]["Tables"]["blogs"]["Row"];

export type BlogStatus = Database["public"]["Enums"]["BlogStatus"];
