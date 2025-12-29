import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Navigation from "@/app/components/Navigation"; //
import Footer from "@/app/components/Footer"; //

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkyRay Engineering Solutions", //
  description: "Powering Innovation Through Engineering Excellence", //
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* Navigation stays at the top of every page */}
        <Navigation />

        {/* main grows to fill space, ensuring footer stays at the bottom */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer stays at the bottom of every page */}
        <Footer />
      </body>
    </html>
  );
}