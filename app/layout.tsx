import { inter } from "@/fonts";
import AppProvider from "@/providers/app";
import { AppProps } from "@/types";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PublishWise",
  description: "The one place to write and publish your blogs",
  keywords:
    "Blogging, Write blogs, Publish blogs, ai writer, personal blog, article writing, blogging resources",
  applicationName: "PublishWise",
  creator: "http://developeratul.com",
  openGraph: {
    title: "PublishWise",
    description: "The one place to write and publish your blogs",
    type: "website",
    locale: "en-US",
    images: ["/og.jpg"],
  },
  twitter: {
    title: "PublishWise",
    description: "The one place to write and publish your blogs",
    images: ["/og.jpg", "/og-twitter.jpg"],
    card: "summary",
    creator: "@developeratul",
  },
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
