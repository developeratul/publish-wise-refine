"use client";
import { supabaseClient } from "@/lib/supabase";
import { AppProps } from "@/types";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

export default function SupabaseProvider(props: AppProps) {
  const { children } = props;
  return (
    <SessionContextProvider supabaseClient={supabaseClient}>{children}</SessionContextProvider>
  );
}
