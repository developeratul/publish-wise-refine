import { inter } from "@/fonts";
import AppProvider from "@/providers/app";
import { AppProps } from "@/types";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PublishWise",
  description: "The one place to write and publish your blogs",
};

export default function RootLayout(props: AppProps) {
  const { children } = props;
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
