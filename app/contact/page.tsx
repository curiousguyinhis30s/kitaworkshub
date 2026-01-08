"use client";

import { useRef } from 'react';
import { ArrowRight, Loader2, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import WarmHero from '../components/WarmHero';
import { Button } from '../components/ui/button';
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const { isSubmitting, isSuccess, isError, message, submit, reset } = useFormSubmit('/api/contact');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await submit({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    }, formRef.current);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Section */}
        <WarmHero
          className="min-h-[600px] pt-24"
          variant="split"
          imageSrc="/images/heroes/hero-contact.jpeg"
          imageAlt="Welcoming modern reception area of Malaysian professional services firm"
        >
          <div className="animate-slide-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-text mb-4">
              We&apos;re here to <span className="text-sage-500">help</span>.
            </h1>
            <p className="text-lg text-text-muted max-w-lg">
              Have a question or want to work together? Drop us a message and we&apos;ll get back to you soon.
            </p>
          </div>
        </WarmHero>

        {/* Contact Details */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-6 rounded-2xl bg-surface hover:bg-sage-50 transition-colors">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-5 h-5 text-sage-600" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Phone</p>
                <a href="tel:+60321234567" className="text-lg font-medium text-sage-700 hover:text-peach-500 transition-colors">
                  +60 3-2123 4567
                </a>
              </div>

              <div className="p-6 rounded-2xl bg-surface hover:bg-sage-50 transition-colors">
                <div className="w-12 h-12 bg-peach-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-5 h-5 text-peach-600" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Email</p>
                <a href="mailto:hello@kitaworkshub.com.my" className="text-lg font-medium text-sage-700 hover:text-peach-500 transition-colors">
                  hello@kitaworkshub.com.my
                </a>
              </div>

              <div className="p-6 rounded-2xl bg-surface hover:bg-sage-50 transition-colors">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-5 h-5 text-sage-600" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Office</p>
                <p className="text-lg font-medium text-sage-700">
                  Kuala Lumpur, Malaysia
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-white">
          <div className="max-w-xl mx-auto px-4 sm:px-6">
            <div className="bg-surface rounded-2xl p-8 md:p-10 shadow-sm">
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-7 h-7 text-sage-600" />
                  </div>
                  <h3 className="text-xl font-bold text-text mb-2 font-heading">Message sent!</h3>
                  <p className="text-text-muted mb-6">{message || "We'll get back to you soon."}</p>
                  <Button onClick={reset} variant="outline">
                    Send another message
                  </Button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  {isError && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm">
                      {message}
                    </div>
                  )}

                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-text mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-lg border-2 border-sage-200 bg-white text-text placeholder:text-text-muted focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 outline-none transition-all disabled:opacity-50"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-text mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-lg border-2 border-sage-200 bg-white text-text placeholder:text-text-muted focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 outline-none transition-all disabled:opacity-50"
                      placeholder="you@company.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-text mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-lg border-2 border-sage-200 bg-white text-text placeholder:text-text-muted focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 outline-none transition-all resize-none disabled:opacity-50"
                      placeholder="How can we help?"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full py-6"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-sm text-text-muted">
                    We typically respond within 24 hours.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-sage-600 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-heading">
              Prefer a Quick Call?
            </h2>
            <p className="text-lg text-sage-100 mb-8">
              Schedule a 15-minute discovery call. No pressure, just a conversation.
            </p>
            <Button
              size="xl"
              variant="warm"
              asChild
            >
              <a href="tel:+60321234567">
                Call Us Now
                <Phone className="ml-2 w-5 h-5" />
              </a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
