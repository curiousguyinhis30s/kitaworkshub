import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | KitaWorksHub Admin",
    default: "Admin Dashboard | KitaWorksHub",
  },
  description: "KitaWorksHub administration panel for managing courses, users, events, and content.",
  keywords: ["admin panel", "KitaWorksHub admin", "course management", "user management"],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Admin Dashboard | KitaWorksHub",
    description: "KitaWorksHub administration panel for managing courses, users, events, and content.",
    url: "https://kitaworkshub.com.my/admin",
    siteName: "KitaWorksHub",
    locale: "en_MY",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Admin Dashboard | KitaWorksHub",
    description: "KitaWorksHub administration panel.",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
