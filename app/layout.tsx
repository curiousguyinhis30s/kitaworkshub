import type { Metadata } from "next";
import { bodyFont, displayFont } from "./fonts";
import "./globals.css";
import { AnimationProvider } from "./components/animations";
import { AnalyticsProvider } from "@/lib/context/AnalyticsProvider";
import { AuthProvider } from "@/lib/context/AuthContext";
import { ThemeProvider } from "@/lib/context/ThemeProvider";
import SkipLink from "./components/SkipLink";
import ScrollToTop from "./components/ScrollToTop";

export const metadata: Metadata = {
  title: {
    default: "KitaWorksHub - Where Leaders Grow Deep",
    template: "%s | KitaWorksHub",
  },
  description: "Consultancy-first platform focused on delivery excellence, capability building, and community. Practical project management training and consulting for Malaysian businesses.",
  keywords: ["PMO consulting Malaysia", "project management training KL", "leadership coaching", "capability building", "team development", "KitaWorksHub", "delivery excellence"],
  authors: [{ name: "KitaWorksHub" }],
  creator: "KitaWorksHub",
  publisher: "KitaWorksHub",
  metadataBase: new URL("https://kitaworkshub.com.my"),
  openGraph: {
    title: "KitaWorksHub - Where Leaders Grow Deep",
    description: "Consultancy-first platform focused on delivery excellence, capability building, and community.",
    url: "https://kitaworkshub.com.my",
    siteName: "KitaWorksHub",
    locale: "en_MY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KitaWorksHub - Where Leaders Grow Deep",
    description: "Delivery excellence, capability building, and community for Malaysian businesses",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  other: {
    "theme-color": "#5F7C6B", // Sage Green
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bodyFont.variable} ${displayFont.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <SkipLink />
          <AuthProvider>
            <AnalyticsProvider>
              <AnimationProvider>
                <main id="main-content">
                  {children}
                </main>
                <ScrollToTop />
              </AnimationProvider>
            </AnalyticsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
