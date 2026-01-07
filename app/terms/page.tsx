import { Metadata } from "next";
import Link from "next/link";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "KitaWorksHub Terms of Service - Terms and conditions for using our services and platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-primary-900 mb-8">
            Terms of Service
          </h1>

          <p className="text-muted-foreground mb-8">
            Last updated: January 1, 2025
          </p>

          <div className="prose prose-lg prose-primary max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-primary-700 mb-4">
                By accessing and using KitaWorksHub services, you accept and agree to be bound by the
                terms and conditions of this agreement. If you do not agree to these terms, please do
                not use our services.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">2. Services</h2>
              <p className="text-primary-700 mb-4">
                KitaWorksHub provides consulting services, training courses, workshops, and events
                related to project management, leadership development, and organizational transformation.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">3. Course Enrollment & Payment</h2>
              <ul className="list-disc pl-6 text-primary-700 space-y-2">
                <li>Course fees are due at the time of enrollment unless otherwise agreed.</li>
                <li>All prices are in Malaysian Ringgit (RM) unless stated otherwise.</li>
                <li>Payment methods include credit card, bank transfer, and approved corporate billing.</li>
                <li>Enrollment is confirmed upon receipt of full payment.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">4. Cancellation & Refund Policy</h2>
              <ul className="list-disc pl-6 text-primary-700 space-y-2">
                <li>Cancellations made 14+ days before course start: Full refund</li>
                <li>Cancellations made 7-13 days before course start: 50% refund</li>
                <li>Cancellations made less than 7 days before course start: No refund, but you may transfer to another session within 6 months</li>
                <li>No-shows are not eligible for refunds or transfers</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">5. Intellectual Property</h2>
              <p className="text-primary-700 mb-4">
                All content, materials, and resources provided through our courses and services are the
                intellectual property of KitaWorksHub. Participants may not reproduce, distribute, or
                share course materials without written permission.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">6. Code of Conduct</h2>
              <p className="text-primary-700 mb-4">
                Participants are expected to maintain professional conduct during all courses and events.
                KitaWorksHub reserves the right to remove any participant who engages in disruptive or
                inappropriate behavior, without refund.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">7. Limitation of Liability</h2>
              <p className="text-primary-700 mb-4">
                KitaWorksHub provides services on an &quot;as is&quot; basis. We are not liable for any indirect,
                incidental, or consequential damages arising from the use of our services.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">8. Changes to Terms</h2>
              <p className="text-primary-700 mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective
                immediately upon posting to this page. Your continued use of our services constitutes
                acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">9. Governing Law</h2>
              <p className="text-primary-700 mb-4">
                These terms are governed by the laws of Malaysia. Any disputes shall be resolved in
                the courts of Kuala Lumpur, Malaysia.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">10. Contact</h2>
              <p className="text-primary-700">
                For questions about these Terms of Service, please{" "}
                <Link href="/contact" className="text-primary-600 hover:underline">
                  contact us
                </Link>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
