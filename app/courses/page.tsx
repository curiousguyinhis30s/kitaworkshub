"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, User, CheckCircle2, Loader2 } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import WarmHero from '../components/WarmHero';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';
import { getPublishedCourses, categories } from '@/lib/data/courses';

// Only show published courses on public site
const courses = getPublishedCourses();

export default function CoursesPage() {
  const [activeCategory, setActiveCategory] = useState("All Courses");
  const formRef = useRef<HTMLFormElement>(null);
  const { isSubmitting, isSuccess, isError, message, submit, reset } = useFormSubmit('/api/enrollments');

  const filteredCourses = activeCategory === "All Courses"
    ? courses
    : courses.filter(course => course.category === activeCategory);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await submit({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      courseId: formData.get('course') as string,
      message: formData.get('message') as string,
    }, formRef.current);
  };

  const scrollToEnroll = (courseTitle: string) => {
    const enrollSection = document.getElementById('enroll-section');
    enrollSection?.scrollIntoView({ behavior: 'smooth' });

    // Pre-select course in dropdown
    setTimeout(() => {
      const select = document.getElementById('course-select') as HTMLSelectElement;
      if (select) {
        const option = Array.from(select.options).find(opt =>
          opt.value.toLowerCase().includes(courseTitle.toLowerCase().split(' ')[0])
        );
        if (option) select.value = option.value;
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Section */}
        <WarmHero
          className="min-h-[700px] pt-24"
          variant="split"
          imageSrc="/images/heroes/hero-courses.jpeg"
          imageAlt="Interactive professional workshop classroom"
        >
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-6xl font-bold font-heading text-text mb-6 leading-tight">
              Advance Your Career with{' '}
              <span className="text-sage-500">
                Expert-Led
              </span>{' '}
              Training
            </h1>
            <p className="text-lg text-text-muted max-w-lg mb-8">
              Master PMO Fundamentals, Agile Practices, and Leadership Development. Join industry leaders and transform your professional potential today.
            </p>

            <div className="flex flex-wrap gap-6 text-sm font-medium text-text-muted">
              <span className="flex items-center gap-2">
                <User className="w-5 h-5 text-peach-500" />
                5,000+ Graduates
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-peach-500" />
                Certified Instructors
              </span>
            </div>
          </div>
        </WarmHero>

        {/* Filter Section */}
        <section className="sticky top-20 z-30 bg-white border-b border-surface shadow-sm py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-2xl font-heading font-bold text-text">Course Catalog</h2>

              <div className="flex flex-wrap justify-center gap-2 p-1 bg-sage-50 rounded-lg">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeCategory === category
                        ? 'bg-sage-600 text-white shadow-md'
                        : 'text-sage-700 hover:bg-sage-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Course Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-text-muted text-lg">No courses found in this category.</p>
                <Button
                  variant="link"
                  className="mt-4 text-sage-600"
                  onClick={() => setActiveCategory("All Courses")}
                >
                  View All Courses
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course, index) => {
                  const bgColors = [
                    'bg-sage-600',
                    'bg-peach-500',
                    'bg-sage-700',
                  ];
                  const bgClass = bgColors[index % bgColors.length];

                  return (
                    <div
                      key={course.id}
                      className="group flex flex-col rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                    >
                      {/* Colored Header */}
                      <div className={`${bgClass} p-6`}>
                        <div className="flex justify-between items-start mb-4">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur text-white rounded-full text-xs font-bold uppercase tracking-wide">
                            {course.category}
                          </span>
                          <span className="flex items-center gap-1 text-white/80 text-xs">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 font-heading">
                          {course.title}
                        </h3>
                        <p className="text-white/80 text-sm leading-relaxed">
                          {course.description}
                        </p>
                      </div>

                      {/* White Content Area */}
                      <div className="bg-white p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-surface">
                          <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-sm font-bold text-sage-700">
                            {course.instructor.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-sage-600">
                            {course.instructor}
                          </span>
                        </div>

                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-text mb-3">Course Includes:</h4>
                          <ul className="space-y-2">
                            {course.features.map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                                <CheckCircle2 className="w-4 h-4 text-peach-500 flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-auto pt-4 border-t border-surface">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <span className="block text-xs text-sage-500 uppercase mb-1">Price</span>
                              <span className="font-bold text-3xl text-text font-heading">RM {course.price}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Link href={`/courses/${course.slug}`} className="flex-1">
                              <Button
                                variant="outline"
                                className="w-full"
                              >
                                View Details
                              </Button>
                            </Link>
                            <Button
                              className="flex-1"
                              onClick={() => scrollToEnroll(course.title)}
                            >
                              Enroll
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Us - Clean, No Icon Boxes */}
        <section className="py-20 bg-surface">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl font-bold text-text mb-4">Why Learn With Us?</h2>
              <p className="text-lg text-text-muted">Practical skills. Real impact.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-sage-600 mb-2 font-heading">5,000+</p>
                <p className="text-sm font-medium text-text-muted">Graduates across Malaysia</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-sage-600 mb-2 font-heading">15+</p>
                <p className="text-sm font-medium text-text-muted">Years of industry experience</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-sage-600 mb-2 font-heading">92%</p>
                <p className="text-sm font-medium text-text-muted">Would recommend to colleagues</p>
              </div>
            </div>
          </div>
        </section>

        {/* Enrollment Section */}
        <section id="enroll-section" className="py-24 bg-sage-600 text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading">Ready to Enroll?</h2>
              <p className="text-sage-100 text-lg">Fill out the form below and our admissions team will contact you within 24 hours.</p>
            </div>

            <Card className="shadow-2xl border-0 bg-white">
              <CardContent className="p-6 sm:p-8 md:p-12">
                {isSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-sage-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-text mb-2">Thank You!</h3>
                    <p className="text-text-muted mb-6">{message}</p>
                    <Button onClick={reset} variant="outline">Submit Another Inquiry</Button>
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
                      <label htmlFor="course-select" className="block text-sm font-semibold text-text mb-2">
                        Interested Course
                      </label>
                      <select
                        id="course-select"
                        name="course"
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-lg border-2 border-sage-200 bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 outline-none transition-all disabled:opacity-50"
                      >
                        {courses.map(course => (
                          <option key={course.id} value={course.title}>{course.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-text mb-2">
                        Message (Optional)
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-lg border-2 border-sage-200 bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 outline-none transition-all resize-none disabled:opacity-50"
                        placeholder="Tell us about your training goals..."
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
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Inquiry
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
