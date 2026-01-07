import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Client Portal | KitaWorksHub",
    default: "Client Portal | KitaWorksHub",
  },
  description: "Access your courses, events, certificates, and learning resources in the KitaWorksHub client portal. Track your progress and manage your professional development.",
  keywords: ["client portal", "learning portal", "course access", "KitaWorksHub portal"],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Client Portal | KitaWorksHub",
    description: "Access your courses, events, and certificates in the KitaWorksHub client portal.",
    url: "https://kitaworkshub.com.my/portal",
    siteName: "KitaWorksHub",
    locale: "en_MY",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Client Portal | KitaWorksHub",
    description: "Access your courses, events, and certificates in the KitaWorksHub client portal.",
  },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
