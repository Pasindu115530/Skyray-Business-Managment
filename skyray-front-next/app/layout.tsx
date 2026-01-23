import type { Metadata, Viewport } from "next";

import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";

import JsonLd from "@/components/JsonLd";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkyRay Engineering Solutions",
  description: "Powering Innovation Through Engineering Excellence",
  openGraph: {
    title: "SkyRay Engineering Solutions",
    description: "Powering Innovation Through Engineering Excellence",
    url: "https://sreng.lk",
    siteName: "SkyRay",
    images: [{ url: "https://sreng.lk/skyraylogo.jpg" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkyRay Engineering Solutions",
    description: "Powering Innovation Through Engineering Excellence",
    images: ["https://sreng.lk/skyraylogo.jpg"],
    creator: "@skyray",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "SkyRay Engineering Solutions",
      "url": "https://sreng.lk",
      "logo": "https://sreng.lk/skyraylogo.jpg",
      "sameAs": [
        "https://www.facebook.com/skyrayengineering",
        "https://www.linkedin.com/company/skyrayengineering"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+94-123-456-789",
        "contactType": "Customer Service"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "SkyRay Engineering Solutions",
      "url": "https://sreng.lk",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://sreng.lk/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ];

  return (
    <html lang="en">
      <head>
        <Head>
          <meta name="keywords" content="Engineering, Solutions, SkyRay, Power, Innovation, Electrical Engineering, Automation" />
          <meta name="author" content="SkyRay Engineering Solutions" />
          <link rel="canonical" href="https://sreng.lk" />
        </Head>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <JsonLd data={jsonLdData} />
        {children}
      </body>
    </html>
  );
}
