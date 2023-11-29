import { manrope } from "@/fonts";
import { cn } from "@/lib/utils";
import AppProvider from "@/providers/app";
import { AppProps } from "@/types";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "PublishWise",
  description: "Write and publish your blogs from one place",
};

export default function RootLayout(props: AppProps) {
  const { children } = props;
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("bg-background text-foreground", manrope.className)}>
        <main>
          <AppProvider>{children}</AppProvider>
        </main>
      </body>
    </html>
  );
}
