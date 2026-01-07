import { Metadata } from "next";
import Link from "next/link";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "KitaWorksHub Privacy Policy - How we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-primary-900 mb-8">
            Privacy Policy
          </h1>

          <p className="text-muted-foreground mb-8">
            Last updated: January 1, 2025
          </p>

          <div className="prose prose-lg prose-primary max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">1. Information We Collect</h2>
              <p className="text-primary-700 mb-4">
                We collect information you provide directly to us, such as when you create an account,
                enroll in a course, register for an event, or contact us. This may include:
              </p>
              <ul className="list-disc pl-6 text-primary-700 space-y-2">
                <li>Name, email address, and phone number</li>
                <li>Company or organization name</li>
                <li>Payment information for course enrollments</li>
                <li>Communication preferences</li>
                <li>Any other information you choose to provide</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-primary-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-primary-700 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Communicate with you about courses, events, and other offerings</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">3. Information Sharing</h2>
              <p className="text-primary-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to outside parties
                except to trusted third parties who assist us in operating our website, conducting our
                business, or servicing you, as long as those parties agree to keep this information confidential.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">4. Data Security</h2>
              <p className="text-primary-700 mb-4">
                We implement appropriate security measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction. However, no method of
                transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">5. Your Rights</h2>
              <p className="text-primary-700 mb-4">
                You have the right to access, correct, or delete your personal information. You may also
                opt-out of marketing communications at any time. To exercise these rights, please contact
                us at{" "}
                <a href="mailto:privacy@kitaworkshub.com.my" className="text-primary-600 hover:underline">
                  privacy@kitaworkshub.com.my
                </a>
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">6. Contact Us</h2>
              <p className="text-primary-700">
                If you have any questions about this Privacy Policy, please contact us at:{" "}
                <Link href="/contact" className="text-primary-600 hover:underline">
                  Contact Page
                </Link>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
