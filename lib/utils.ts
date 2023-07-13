"use client";
import { Json } from "@/types/supabase";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number, includeTime: boolean = false): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    ...(includeTime ? { hour12: true, hour: "numeric", minute: "numeric" } : {}),
  });
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL || window.origin}${path}`;
}

export function parseJson<T>(json: Json) {
  return JSON.parse(json?.toString() || "{}") as T;
}
