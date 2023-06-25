"use client";
import ToasterProvider from "@/providers/toast";
import { AppProps } from "@/types";
import MantineProvider from "./mantine";
import NavigationProgressProvider from "./navigation-progress";
import ReactQueryProvider from "./react-query";
import RefineProvider from "./refine";
import SupabaseProvider from "./supabase";

export default function AppProvider(props: AppProps) {
  const { children } = props;
  return (
    <MantineProvider>
      <NavigationProgressProvider />
      <ToasterProvider />
      <RefineProvider>
        <SupabaseProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </SupabaseProvider>
      </RefineProvider>
    </MantineProvider>
  );
}
