import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consulting Services | KitaWorksHub",
  description: "Strategic PMO setup, Leadership coaching, and Organization design consulting for Malaysian businesses. Transform your project management capabilities.",
  keywords: ["PMO consulting Malaysia", "leadership coaching", "organization design", "project management consulting", "strategic consulting KL"],
  openGraph: {
    title: "Consulting Services | KitaWorksHub",
    description: "Elevate your business with strategic consulting expertise in PMO, Leadership, and Transformation.",
    type: "website",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
