import { Json } from "@/types/supabase";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return formattedDate.toString();
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL || window.origin}${path}`;
}

export function parseJson<T>(json: Json) {
  if (typeof json === "string") {
    return JSON.parse(json) as T;
  } else if (typeof json === "object" && json !== null) {
    return json as T;
  } else {
    return {} as T;
  }
}
