import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Courses | KitaWorksHub",
  description: "Master PMO Fundamentals, Agile Practices, and Leadership Development with expert-led training. PMI-ACP, Scrum Master, and Executive Leadership courses in Malaysia.",
  keywords: ["PMO training Malaysia", "Agile certification", "PMI-ACP course", "Scrum Master training", "Leadership development"],
  openGraph: {
    title: "Professional Courses | KitaWorksHub",
    description: "Advance your career with expert-led training in PMO, Agile, and Leadership.",
    type: "website",
  },
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
