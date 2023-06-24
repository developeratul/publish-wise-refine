"use client";
import ToasterProvider from "@/providers/toast";
import { AppProps } from "@/types";
import MantineProvider from "./mantine";
import NavigationProgressProvider from "./navigation-progress";
import RefineProvider from "./refine";
import SupabaseProvider from "./supabase";

export default function AppProvider(props: AppProps) {
  const { children } = props;
  return (
    <MantineProvider>
      <NavigationProgressProvider />
      <ToasterProvider />
      <RefineProvider>
        <SupabaseProvider>{children}</SupabaseProvider>
      </RefineProvider>
    </MantineProvider>
  );
}
