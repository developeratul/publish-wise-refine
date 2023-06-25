"use client";
import { supabaseClient } from "@/lib/supabase";
import { AppProps } from "@/types";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router/app";
import { dataProvider } from "@refinedev/supabase";

export default function RefineProvider(props: AppProps) {
  const { children } = props;
  return (
    <Refine
      routerProvider={routerProvider}
      dataProvider={dataProvider(supabaseClient)}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
        reactQuery: {
          devtoolConfig: false,
        },
      }}
    >
      {children}
    </Refine>
  );
}
