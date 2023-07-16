"use client";
import { supabaseClient } from "@/lib/supabase";
import { AppProps } from "@/types";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router/app";
import { dataProvider } from "@refinedev/supabase";
import notificationProvider from "./notification";

export default function RefineProvider(props: AppProps) {
  const { children } = props;
  return (
    <Refine
      dataProvider={dataProvider(supabaseClient)}
      notificationProvider={notificationProvider}
      routerProvider={routerProvider}
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
