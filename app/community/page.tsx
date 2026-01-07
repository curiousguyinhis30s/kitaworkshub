"use client";

import Link from 'next/link';
import { ArrowRight, BookOpen, Download, MessageCircle, User, Calendar, Star, Users } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import WarmHero from '../components/WarmHero';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const blogPosts = [
  {
    id: 1,
    title: "The Mycelium Model: Why Your PMO Should Think Like a Forest",
    excerpt: "Traditional hierarchies are giving way to network-based structures. Discover how the mycelium metaphor transforms project governance.",
    author: "Sarah Lim",
    date: "Dec 20, 2024",
    readTime: "8 min read",
    category: "Adaptive Leadership",
    featured: true
  },
  {
    id: 2,
    title: "Stoic Project Leadership: Making Better Decisions Under Pressure",
    excerpt: "Ancient philosophy meets modern project management. Learn how Stoic principles create resilient leaders.",
    author: "Dr. Ali Hassan",
    date: "Dec 15, 2024",
    readTime: "6 min read",
    category: "Leadership",
    featured: false
  },
  {
    id: 3,
    title: "From Waterfall to Agile: A Malaysian Company's Journey",
    excerpt: "Real-world case study of a 500-person organization transitioning to Agile methodologies in 12 months.",
    author: "Rizwan Malik",
    date: "Dec 10, 2024",
    readTime: "10 min read",
    category: "Case Study",
    featured: false
  },
  {
    id: 4,
    title: "The Hidden Cost of Bad Meetings (And How to Fix Them)",
    excerpt: "Meetings waste RM 2.5 billion annually in Malaysia. Here's a practical framework to reclaim your time.",
    author: "Jenny Tan",
    date: "Dec 5, 2024",
    readTime: "5 min read",
    category: "Productivity",
    featured: false
  },
  {
    id: 5,
    title: "Building Psychological Safety in Remote Teams",
    excerpt: "Hybrid work demands new leadership skills. Practical tactics for fostering trust and openness across distances.",
    author: "Amina Karim",
    date: "Nov 28, 2024",
    readTime: "7 min read",
    category: "Remote Work",
    featured: false
  },
  {
    id: 6,
    title: "AI for Project Managers: Tools That Actually Work",
    excerpt: "Cut through the hype. A curated list of AI tools that save hours, not create more work.",
    author: "David Chen",
    date: "Nov 20, 2024",
    readTime: "9 min read",
    category: "Technology",
    featured: false
  }
];

const resources = [
  {
    id: 1,
    title: "PMO Setup Checklist (2025 Edition)",
    description: "Complete 45-point checklist for establishing a modern PMO from scratch.",
    type: "PDF",
    size: "2.3 MB",
    downloads: 1248
  },
  {
    id: 2,
    title: "Agile Retrospective Toolkit",
    description: "15 facilitation templates for effective sprint retrospectives.",
    type: "ZIP",
    size: "1.8 MB",
    downloads: 892
  },
  {
    id: 3,
    title: "Leadership Self-Assessment Framework",
    description: "Evaluate your leadership style across 8 dimensions with actionable insights.",
    type: "XLSX",
    size: "450 KB",
    downloads: 2103
  },
  {
    id: 4,
    title: "Stakeholder Mapping Canvas",
    description: "Visual template for analyzing stakeholder influence and interest levels.",
    type: "PDF",
    size: "980 KB",
    downloads: 1567
  }
];

const discussions = [
  {
    id: 1,
    title: "How do you handle scope creep in Agile projects?",
    author: "Ahmad Razak",
    replies: 23,
    views: 487,
    lastActive: "2 hours ago",
    category: "Agile"
  },
  {
    id: 2,
    title: "Best tools for managing distributed teams in Malaysia?",
    author: "Siti Nurhaliza",
    replies: 15,
    views: 312,
    lastActive: "5 hours ago",
    category: "Remote Work"
  },
  {
    id: 3,
    title: "PMI-ACP vs PSM II - Which certification is more valuable?",
    author: "Kumar Selvam",
    replies: 34,
    views: 892,
    lastActive: "1 day ago",
    category: "Certifications"
  },
  {
    id: 4,
    title: "Convincing management to adopt Agile practices",
    author: "Fatimah Zahra",
    replies: 18,
    views: 651,
    lastActive: "2 days ago",
    category: "Leadership"
  }
];

const memberSpotlight = {
  name: "Tan Wei Ming",
  role: "Senior PMO Manager, Petronas",
  avatar: "TW",
  quote: "KitaWorksHub transformed how I approach project governance. The mycelium model helped us reduce decision-making time by 30%.",
  achievements: ["PMI-ACP Certified", "Led 12 major projects", "Speaker at PMI Malaysia"],
  joined: "2023"
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Section */}
        <WarmHero
          className="min-h-[700px] pt-24"
          variant="split"
          imageSrc="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
          imageAlt="Community of leaders collaborating"
        >
          <div className="animate-slide-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-text mb-6 leading-tight">
              Join the{' '}
              <span className="text-sage-500">
                Community of Adaptive Leaders
              </span>
            </h1>
            <p className="text-lg text-text-muted max-w-lg mb-8">
              Share knowledge, access resources, and connect with fellow project leaders across Malaysia and beyond.
            </p>

            <div className="flex flex-wrap gap-6 text-sm font-medium text-text-muted">
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5 text-peach-500" />
                2,500+ Members
              </span>
              <span className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-peach-500" />
                Active Discussions
              </span>
            </div>
          </div>
        </WarmHero>

        {/* Blog Posts Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold font-heading text-text mb-2">Latest Articles</h2>
                <p className="text-text-muted">Insights from practitioners, for practitioners.</p>
              </div>
              <Button variant="outline">
                View All Articles
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Featured Post */}
              {blogPosts.filter(post => post.featured).map(post => (
                <div key={post.id} className="lg:col-span-2 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group">
                  {/* Gradient Header */}
                  <div className="bg-sage-600 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-peach-400 text-charcoal rounded-full text-xs font-bold uppercase">
                        Featured
                      </span>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur text-white rounded-full text-xs font-bold uppercase">
                        {post.category}
                      </span>
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-peach-200 transition-colors font-heading">
                      {post.title}
                    </h3>

                    <p className="text-white/80 text-lg leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* White Content */}
                  <div className="bg-white p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center text-sm font-bold text-sage-700">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text">{post.author}</p>
                        <p className="text-xs text-text-muted">{post.date} · {post.readTime}</p>
                      </div>
                    </div>

                    <Button>
                      Read More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Regular Posts Grid */}
              <div className="lg:col-span-1 space-y-6">
                {blogPosts.filter(post => !post.featured).slice(0, 2).map(post => (
                  <Card key={post.id} className="hover:shadow-xl transition-all duration-300 border border-surface group">
                    <CardHeader className="pb-3">
                      <span className="px-3 py-1 bg-sage-50 text-sage-700 rounded-full text-xs font-semibold mb-2 inline-block">
                        {post.category}
                      </span>
                      <CardTitle className="text-lg font-heading text-text group-hover:text-sage-600 transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <User className="w-3 h-3" />
                        <span>{post.author}</span>
                        <span>·</span>
                        <Calendar className="w-3 h-3" />
                        <span>{post.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* More Posts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {blogPosts.filter(post => !post.featured).slice(2).map(post => (
                <Card key={post.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-surface group">
                  <CardHeader className="pb-3">
                    <span className="px-3 py-1 bg-sage-50 text-sage-700 rounded-full text-xs font-semibold mb-2 inline-block">
                      {post.category}
                    </span>
                    <CardTitle className="text-xl font-heading text-text mb-2 group-hover:text-sage-600 transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span>{post.author}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section className="py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold font-heading text-text mb-4">Free Resources</h2>
              <p className="text-xl text-text-muted">Templates, toolkits, and frameworks to accelerate your work.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource, index) => {
                const bgColors = [
                  'bg-sage-600',
                  'bg-peach-500',
                  'bg-sage-700',
                  'bg-peach-600',
                ];
                const bgClass = bgColors[index % bgColors.length];

                return (
                  <div key={resource.id} className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                    {/* Colored Top Bar */}
                    <div className={`${bgClass} p-4 flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                          <Download className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="px-2 py-1 bg-white/20 text-white rounded text-xs font-bold">
                            {resource.type}
                          </span>
                        </div>
                      </div>
                      <span className="text-white/80 text-sm">↓ {resource.downloads.toLocaleString()}</span>
                    </div>
                    {/* White Content */}
                    <div className="bg-white p-5">
                      <h3 className="text-lg font-bold text-text mb-2 group-hover:text-sage-600 transition-colors font-heading">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-text-muted mb-4">
                        {resource.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-sage-500">{resource.size}</span>
                        <Button size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Discussions Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold font-heading text-text mb-2">Active Discussions</h2>
                <p className="text-text-muted">Join the conversation with fellow project leaders.</p>
              </div>
              <Button variant="outline">
                Join Discussions
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {discussions.map((discussion, index) => {
                const borderColors = [
                  'border-l-sage-600',
                  'border-l-peach-500',
                  'border-l-sage-700',
                  'border-l-peach-600',
                ];
                const borderClass = borderColors[index % borderColors.length];

                return (
                  <div
                    key={discussion.id}
                    className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 ${borderClass} cursor-pointer group`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-sage-100 text-sage-700 rounded text-xs font-semibold">
                              {discussion.category}
                            </span>
                            <span className="text-xs text-sage-500">{discussion.lastActive}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-text mb-2 group-hover:text-sage-600 transition-colors">
                            {discussion.title}
                          </h3>
                          <p className="text-sm text-text-muted">
                            Started by <span className="font-medium text-peach-600">{discussion.author}</span>
                          </p>
                        </div>

                        <div className="flex gap-6 text-sm text-text-muted">
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4 text-peach-500" />
                            <span className="font-medium">{discussion.replies}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-sage-500" />
                            <span>{discussion.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Member Spotlight */}
        <section className="py-20 bg-sage-600 text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 max-w-4xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold font-heading mb-2">Member Spotlight</h2>
              <p className="text-sage-100">Celebrating leaders who make a difference.</p>
            </div>

            <Card className="bg-white/95 backdrop-blur-sm border-2 border-sage-200 shadow-2xl">
              <CardContent className="p-10">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-32 h-32 rounded-full bg-sage-600 flex items-center justify-center text-5xl font-bold text-white flex-shrink-0 shadow-xl font-heading">
                    {memberSpotlight.avatar}
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-3xl font-bold font-heading text-text mb-2">
                      {memberSpotlight.name}
                    </h3>
                    <p className="text-lg text-text-muted mb-4">{memberSpotlight.role}</p>

                    <blockquote className="text-lg italic text-text mb-6 border-l-4 border-peach-500 pl-4">
                      &quot;{memberSpotlight.quote}&quot;
                    </blockquote>

                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                      {memberSpotlight.achievements.map((achievement, i) => (
                        <span key={i} className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {achievement}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm text-text-muted">
                      Member since {memberSpotlight.joined}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-text mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto">
              Get access to exclusive resources, join discussions, and connect with adaptive leaders across Malaysia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="xl"
                asChild
              >
                <Link href="/portal">
                  Join Community
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="xl"
                variant="outline"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
