import Link from 'next/link';
import { ArrowRight, Users, BookOpen, Target, Sparkles } from 'lucide-react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import WarmHero from './components/WarmHero';
import { TreeLogo } from './components/icons/TreeLogo';
import { Button } from './components/ui/button';

export default function Home() {
  const services = [
    {
      id: 1,
      title: 'PMO Setup & Advisory',
      category: 'Delivery Excellence',
      description: 'We help you build a project office that actually works for your team, not against them.',
      num: '01',
      features: ['Right-sized for your needs', 'Practical governance', 'Your team, empowered']
    },
    {
      id: 2,
      title: 'Leadership Development',
      category: 'Capability Building',
      description: 'Hands-on coaching for project managers and team leads who want to grow.',
      num: '02',
      features: ['Real scenarios', 'Small group sessions', '1-on-1 mentoring']
    },
    {
      id: 3,
      title: 'Team & Process Consulting',
      category: 'Community',
      description: 'Sometimes teams just need fresh eyes. We listen, observe, and help you improve.',
      num: '03',
      features: ['No-jargon approach', 'Quick wins first', 'Sustainable change']
    },
  ];

  const stats = [
    { label: 'Clients Served', value: '12', icon: Users },
    { label: 'Workshops Delivered', value: '28', icon: BookOpen },
    { label: 'Happy Teams', value: '100%', icon: Sparkles },
    { label: 'Years in Practice', value: '8', icon: Target },
  ];

  const pillars = [
    {
      title: 'Delivery Excellence',
      description: 'Building sustainable systems that help teams deliver consistently.',
      color: 'sage',
    },
    {
      title: 'Capability Building',
      description: 'Growing people through practical learning and real-world application.',
      color: 'peach',
    },
    {
      title: 'Community',
      description: 'Creating safe spaces for learning, sharing, and growing together.',
      color: 'lavender',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Section - Split layout with image */}
        <WarmHero
          className="min-h-[700px] pt-24"
          variant="split"
          imageSrc="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
          imageAlt="Team collaboration and leadership development"
        >
          <div className="animate-slide-up">
            {/* Subtle label */}
            <p className="text-sm font-medium text-sage-500 uppercase tracking-[0.2em] mb-6">
              Consultancy-first Platform
            </p>

            {/* Main headline - Space Grotesk */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6 leading-[1.1] font-heading">
              Where Leaders
              <br />
              <span className="text-sage-500">Grow Deep</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-text-muted mb-8 max-w-lg leading-relaxed">
              Practical consulting and training for Malaysian businesses ready to grow.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="xl"
                asChild
              >
                <Link href="/services">
                  Explore Services
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="xl"
                variant="outline"
                asChild
              >
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </WarmHero>

        {/* Pillars Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-sm font-medium text-sage-500 uppercase tracking-[0.2em] mb-4">Our Focus</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-text font-heading">Three Pillars of Growth</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {pillars.map((pillar, index) => (
                <div
                  key={pillar.title}
                  className={`p-8 rounded-2xl transition-all duration-300 hover:shadow-lg ${
                    pillar.color === 'sage' ? 'bg-sage-50 hover:bg-sage-100' :
                    pillar.color === 'peach' ? 'bg-peach-50 hover:bg-peach-100' :
                    'bg-lavender-50 hover:bg-lavender-100'
                  }`}
                >
                  <h3 className={`text-xl font-semibold mb-3 font-heading ${
                    pillar.color === 'sage' ? 'text-sage-800' :
                    pillar.color === 'peach' ? 'text-peach-800' :
                    'text-lavender-800'
                  }`}>
                    {pillar.title}
                  </h3>
                  <p className={`leading-relaxed ${
                    pillar.color === 'sage' ? 'text-sage-700' :
                    pillar.color === 'peach' ? 'text-peach-700' :
                    'text-lavender-700'
                  }`}>{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sage-100 mb-4">
                    <stat.icon className="w-6 h-6 text-sage-600" />
                  </div>
                  <div className="text-4xl font-bold text-text mb-2 font-heading">{stat.value}</div>
                  <div className="text-sm text-text-muted font-medium uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <p className="text-sm font-medium text-sage-500 uppercase tracking-[0.2em] mb-4">What We Do</p>
              <h2 className="text-4xl md:text-5xl font-semibold text-text mb-6 max-w-3xl leading-tight font-heading">
                We help leaders navigate complexity
              </h2>
              <p className="text-lg text-text-muted max-w-2xl">
                Practical consulting and training that makes a real difference. No fluff, just results.
              </p>
            </div>

            <div className="space-y-0">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="group border-t border-surface py-10 md:py-14 grid md:grid-cols-12 gap-6 md:gap-12 items-start hover:bg-sage-50/50 transition-colors duration-300 px-4 -mx-4 rounded-xl"
                >
                  {/* Number */}
                  <div className="md:col-span-1">
                    <span className="text-5xl md:text-6xl font-bold text-sage-200 group-hover:text-sage-300 transition-colors font-heading">{service.num}</span>
                  </div>

                  {/* Title & Category */}
                  <div className="md:col-span-4">
                    <span className="text-xs font-medium text-sage-500 uppercase tracking-[0.15em] mb-2 block">{service.category}</span>
                    <h3 className="text-2xl md:text-3xl font-semibold text-text group-hover:text-sage-700 transition-colors font-heading">{service.title}</h3>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-4">
                    <p className="text-lg text-text-muted leading-relaxed mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-text-muted">
                          <span className="w-1.5 h-1.5 rounded-full bg-peach-400"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="md:col-span-3 flex md:justify-end">
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2 text-sage-600 font-medium hover:text-peach-500 transition-colors group/link"
                    >
                      Learn more
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
              <div className="border-t border-surface"></div>
            </div>
          </div>
        </section>

        {/* CTA Section - Sage themed */}
        <section className="py-24 px-4 bg-sage-600 relative overflow-hidden">
          {/* Subtle pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 font-heading leading-tight">
              Let&apos;s Have a Conversation
            </h2>
            <p className="text-xl text-sage-100 mb-10 leading-relaxed">
              No pressure, no sales pitch. Just a friendly chat about where you are and where you&apos;d like to be.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="xl"
                variant="warm"
                asChild
              >
                <Link href="/contact">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
