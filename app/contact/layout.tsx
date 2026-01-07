import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | KitaWorksHub",
  description: "Get in touch with KitaWorksHub for consulting inquiries, course enrollments, and partnership opportunities. Located in Kuala Lumpur, Malaysia.",
  keywords: ["contact KitaWorksHub", "PMO consulting inquiry", "training inquiry Malaysia", "project management consultation"],
  openGraph: {
    title: "Contact Us | KitaWorksHub",
    description: "Start a conversation with our team for consulting, training, or partnership inquiries.",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
