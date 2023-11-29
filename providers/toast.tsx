"use client";
import { manrope } from "@/fonts";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

export default function ToastProvider() {
  return <Toaster richColors closeButton position="top-center" className={cn(manrope.className)} />;
}
