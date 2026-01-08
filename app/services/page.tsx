"use client";

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, Target, Network, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import WarmHero from '../components/WarmHero';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';

export default function ServicesPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const { isSubmitting, isSuccess, isError, message, submit, reset } = useFormSubmit('/api/contact');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await submit({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      subject: formData.get('service') as string,
      message: formData.get('message') as string,
    }, formRef.current);
  };

  const services = [
    {
      id: 1,
      title: 'Strategic PMO Setup',
      category: 'Governance',
      description: 'Establish a robust Project Management Office that ensures alignment with strategic goals and maximizes ROI through governance and standardization.',
      icon: Building2,
      priceMin: '25,000',
      priceMax: '100,000',
      features: [
        'Adaptive frameworks design',
        'Governance models & templates',
        'Resource optimization strategy',
        'KPI dashboard setup',
        '30% faster project decisions'
      ],
      deliverables: [
        'PMO Framework Documentation',
        'Governance Playbook',
        'Tool & Template Library',
        'Training & Handover'
      ]
    },
    {
      id: 2,
      title: 'Leadership Coaching',
      category: 'Executive Development',
      description: 'Unlock the potential of your C-suite and managers. Our coaching programs foster emotional intelligence, decision-making, and resilient leadership.',
      icon: Target,
      priceMin: '8,000',
      priceMax: '30,000',
      isPremium: true,
      features: [
        'Executive mentoring (1-on-1)',
        'Team dynamics facilitation',
        'Change management coaching',
        'Stoic resilience training',
        'Practical decision-making tools'
      ],
      deliverables: [
        '12-Week Coaching Program',
        'Personal Leadership Plan',
        'Team Alignment Sessions',
        'Progress Assessment Reports'
      ]
    },
    {
      id: 3,
      title: 'Organization Design',
      category: 'Transformation',
      description: 'Restructure your enterprise for agility and efficiency. We analyze workflows and hierarchies to build a future-ready organizational blueprint.',
      icon: Network,
      priceMin: '40,000',
      priceMax: '150,000',
      features: [
        'Network-based org mapping',
        'Mycelium structure design',
        'Role clarity framework',
        'KPA & KPI alignment',
        'Reduced handoffs & friction'
      ],
      deliverables: [
        'Current State Assessment',
        'Future State Blueprint',
        'Transition Roadmap',
        'Implementation Support'
      ]
    },
  ];

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-section');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Section */}
        <WarmHero
          className="min-h-[700px] pt-24"
          variant="split"
          imageSrc="/images/heroes/hero-services.jpeg"
          imageAlt="Executive coaching session in elegant Malaysian boardroom"
        >
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage-100 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-peach-500" />
              <span className="text-sage-700 text-sm font-medium">Strategic Consulting Services</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-text mb-6 leading-tight">
              Elevate Your Business
              <br />
              <span className="text-sage-500">
                With Strategic Expertise
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg md:text-xl text-text-muted leading-relaxed">
              From foundational PMO setups to transformative leadership coaching, we empower your organization to thrive in a competitive landscape.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button
                size="xl"
                onClick={scrollToContact}
              >
                Book Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="xl"
                variant="outline"
                asChild
              >
                <Link href="/courses">View Courses</Link>
              </Button>
            </div>
          </div>
        </WarmHero>

        {/* Services Grid */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-sage-100 text-sage-700 rounded-full text-sm font-semibold mb-4">
                Our Expertise
              </span>
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-text mb-6">
                Comprehensive Solutions
              </h2>
              <p className="text-xl text-text-muted max-w-3xl mx-auto">
                Tailored strategies designed to optimize structure, leadership, and execution for Malaysian businesses.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const IconComponent = service.icon;
                const bgColors = [
                  'bg-sage-600',
                  'bg-peach-500',
                  'bg-sage-700',
                ];
                const bgClass = bgColors[index % bgColors.length];

                return (
                  <div
                    key={service.id}
                    className="group flex flex-col rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    {/* Colored Header */}
                    <div className={`${bgClass} p-6 relative`}>
                      {service.isPremium && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur text-white text-xs font-bold rounded-full">
                          PREMIUM
                        </div>
                      )}
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur text-white rounded-full text-xs font-bold uppercase tracking-wide">
                          {service.category}
                        </span>
                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-white" strokeWidth={1.5} />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 font-heading">
                        {service.title}
                      </h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* White Content Area */}
                    <div className="bg-white p-6 flex flex-col flex-grow">
                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-text mb-3">Key Features:</h4>
                        <ul className="space-y-2">
                          {service.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                              <CheckCircle2 className="w-4 h-4 text-peach-500 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pricing */}
                      <div className="mt-auto pt-4 border-t border-surface">
                        <p className="text-xs text-sage-500 uppercase mb-2">Investment Range</p>
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-2xl font-bold text-text">RM {service.priceMin}</span>
                          <span className="text-text-muted">—</span>
                          <span className="text-2xl font-bold text-text">RM {service.priceMax}</span>
                        </div>

                        <Button
                          className="w-full"
                          variant={service.isPremium ? 'warm' : 'default'}
                          onClick={scrollToContact}
                        >
                          {service.isPremium ? 'Get Started' : 'Learn More'}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-24 bg-sage-600 text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div className="mb-12 lg:mb-0">
                <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-6">
                  Why KitaWorksHub?
                </h2>
                <p className="text-sage-100 text-lg mb-10 leading-relaxed">
                  We don&apos;t just give advice; we architect change. With deep roots in the Malaysian corporate landscape, our approach blends global best practices with local nuance.
                </p>

                <div className="space-y-6">
                  {[
                    { num: '1', title: 'Discovery & Audit', desc: 'Deep dive into your current operational maturity.' },
                    { num: '2', title: 'Strategy Formulation', desc: 'Designing a roadmap tailored to your budget and goals.' },
                    { num: '3', title: 'Execution & Handover', desc: 'Implementation support and knowledge transfer.' }
                  ].map((step) => (
                    <div key={step.num} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-peach-400 text-charcoal font-heading font-bold text-xl shadow-lg">
                          {step.num}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">{step.title}</h4>
                        <p className="text-sage-100">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-10 rounded-2xl border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-heading font-bold text-peach-300 mb-4">Our Commitment</h3>
                <p className="text-sage-100 italic mb-8 text-lg leading-relaxed">
                  &quot;Sustainable growth requires a foundation built on clarity, structure, and empowered leadership.&quot;
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-6 rounded-xl border border-white/10">
                    <span className="block text-4xl font-bold text-white mb-1 font-heading">50+</span>
                    <span className="text-sm text-peach-300 font-medium">Projects Delivered</span>
                  </div>
                  <div className="bg-white/10 p-6 rounded-xl border border-white/10">
                    <span className="block text-4xl font-bold text-white mb-1 font-heading">15+</span>
                    <span className="text-sm text-peach-300 font-medium">Industries Served</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact-section" className="py-24 px-4 bg-surface">
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-2xl border-2 border-sage-100">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-4xl font-heading font-bold text-text mb-4">
                  Let&apos;s Discuss Your Needs
                </CardTitle>
                <CardDescription className="text-lg">
                  Fill out the form below and we&apos;ll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-sage-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-text mb-2">Message Sent!</h3>
                    <p className="text-text-muted mb-6">{message}</p>
                    <Button onClick={reset} variant="outline">Send Another Message</Button>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    {isError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {message}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-text mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 rounded-lg border-2 border-sage-200 bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 outline-none transition-all disabled:opacity-50"
                          placeholder="Ahmad bin Abdullah"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-text mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 rounded-lg border-2 border-sage-200 bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 outline-none transition-all disabled:opacity-50"
                          placeholder="ahmad@company.com.my"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-text mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-lg border-2 border-sage-200 bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 outline-none transition-all disabled:opacity-50"
                        placeholder="+60 12-345 6789"
                      />
                    </div>

                    <div>
                      <label htmlFor="service" className="block text-sm font-semibold text-text mb-2">
                        Service of Interest
                      </label>
                      <select
                        id="service"
                        name="service"
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-lg border-2 border-sage-200 bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 outline-none transition-all disabled:opacity-50"
                      >
                        <option>General Inquiry</option>
                        <option>PMO Setup</option>
                        <option>Leadership Coaching</option>
                        <option>Organization Design</option>
                      </select>
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
                        className="w-full px-4 py-3 rounded-lg border-2 border-sage-200 bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 outline-none transition-all resize-none disabled:opacity-50"
                        placeholder="Tell us about your project requirements..."
                      ></textarea>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      variant="warm"
                      className="w-full py-6 text-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
