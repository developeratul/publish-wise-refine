"use client";
import { supabaseClient } from "@/lib/supabase";
import { AppProps } from "@/types";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router/app";
import { dataProvider } from "@refinedev/supabase";
import { authProvider } from "../lib/auth";

export default function RefineProvider(props: AppProps) {
  const { children } = props;
  return (
    <Refine
      routerProvider={routerProvider}
      dataProvider={dataProvider(supabaseClient)}
      authProvider={authProvider}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
        reactQuery: {
          clientConfig: {
            defaultOptions: {
              queries: {
                useErrorBoundary: true,
                refetchOnWindowFocus: false,
                retry: false,
              },
            },
          },
        },
      }}
    >
      {children}
    </Refine>
  );
}
