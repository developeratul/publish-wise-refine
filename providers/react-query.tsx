"use client";
import { queryClient } from "@/lib/query-client";
import { AppProps } from "@/types";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";

export default function ReactQueryProvider(props: AppProps) {
  const { children } = props;
  return (
    <QueryClientProvider client={queryClient}>
      <React.Suspense fallback={<></>}>
        <ReactQueryDevtools />
      </React.Suspense>
      {children}
    </QueryClientProvider>
  );
}
