import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community | KitaWorksHub",
  description: "Join the community of adaptive leaders. Access articles, resources, discussions, and connect with fellow project managers across Malaysia.",
  keywords: ["project management community", "PMO resources", "leadership articles", "project manager network Malaysia"],
  openGraph: {
    title: "Community | KitaWorksHub",
    description: "Share knowledge and connect with fellow project leaders in our growing community.",
    type: "website",
  },
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
