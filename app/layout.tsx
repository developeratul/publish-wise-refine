import { inter } from "@/fonts";
import AppProvider from "@/providers/app";
import { AppProps } from "@/types";
import { Metadata } from "next";
import Script from "next/script";
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
  metadataBase: new URL("http://PublishWise.ink"),
};

export default function RootLayout(props: AppProps) {
  const { children } = props;
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-48LSD3965M"
        />
        <Script id="gtag" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
              
            gtag('config', 'G-48LSD3965M');
          `}
        </Script>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
