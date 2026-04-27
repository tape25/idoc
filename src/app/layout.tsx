import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/providers/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DRH Ministère des Sports - Côte d'Ivoire",
  description: "Application de gestion des ressources humaines du Ministère des Sports de Côte d'Ivoire. Dématérialisation du circuit de traitement des actes administratifs.",
  keywords: ["DRH", "Ministère des Sports", "Côte d'Ivoire", "Ressources Humaines", "Administration"],
  authors: [{ name: "Ministère des Sports - CI" }],
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#009E60" },
    { media: "(prefers-color-scheme: dark)", color: "#009E60" },
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/images/android/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "DRH Sports",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="DRH Sports" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DRH Sports" />
        <meta name="theme-color" content="#009E60" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
