"use client";
import { TanStackQueryProvider } from "@/lib/query-client";
import { AppProps } from "@/types";
import ToastProvider from "./toast";

export default function AppProvider(props: AppProps) {
  const { children } = props;
  return (
    <TanStackQueryProvider>
      <ToastProvider />
      {children}
    </TanStackQueryProvider>
  );
}
