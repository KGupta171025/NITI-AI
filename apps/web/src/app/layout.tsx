import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Noto_Sans_Devanagari } from "next/font/google";
import { Toaster } from "sonner";
import "@/styles/globals.css";

// ─── Fonts ─────────────────────────────────────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans-devanagari",
});

// ─── Metadata ───────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "NITI AI – Government Scheme Discovery",
    template: "%s | NITI AI",
  },
  description:
    "AI-powered multilingual platform helping Indian entrepreneurs discover and apply for government schemes.",
  keywords: [
    "government schemes",
    "entrepreneur",
    "India",
    "AI",
    "MSME",
    "startup",
    "sarkari yojana",
  ],
  authors: [{ name: "NITI AI" }],
  creator: "NITI AI",
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "NITI AI – Government Scheme Discovery",
    description:
      "Discover relevant government schemes with AI-powered matching, eligibility checking, and multilingual support.",
    siteName: "NITI AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "NITI AI – Government Scheme Discovery",
    description:
      "Discover government schemes tailored to your business profile.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a1a" },
    { media: "(prefers-color-scheme: light)", color: "#fff8f0" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// ─── Layout ─────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fontMono.variable} ${notoDevanagari.variable} dark`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        {children}
        <Toaster
          position="top-right"
          richColors
          theme="dark"
          toastOptions={{
            style: {
              background: "rgba(15,15,30,0.90)",
              border: "1px solid rgba(255,255,255,0.10)",
              backdropFilter: "blur(16px)",
            },
          }}
        />
      </body>
    </html>
  );
}
