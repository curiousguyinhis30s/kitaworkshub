import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events & Workshops | KitaWorksHub",
  description: "Join workshops, seminars, and networking events for project leaders. PMO workshops, leadership seminars, and Agile training events in Malaysia.",
  keywords: ["PMO workshop Malaysia", "project management events", "leadership seminar", "Agile workshop", "networking events KL"],
  openGraph: {
    title: "Events & Workshops | KitaWorksHub",
    description: "Connect with fellow project leaders at our workshops and networking events.",
    type: "website",
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
