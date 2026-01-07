"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Clock, User, Users, Star, CheckCircle2, PlayCircle, FileText, HelpCircle, Wrench, ClipboardCheck, ChevronDown, ChevronUp } from 'lucide-react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Button } from '../../components/ui/button';
import { getCourseBySlug, getTotalLessons, getTotalDuration, Lesson } from '@/lib/data/courses';

// Icon mapping for lesson types
const lessonTypeIcons: Record<Lesson['type'], React.ReactNode> = {
  video: <PlayCircle className="w-4 h-4" />,
  reading: <FileText className="w-4 h-4" />,
  quiz: <HelpCircle className="w-4 h-4" />,
  workshop: <Wrench className="w-4 h-4" />,
  assignment: <ClipboardCheck className="w-4 h-4" />,
};

const lessonTypeLabels: Record<Lesson['type'], string> = {
  video: 'Video',
  reading: 'Reading',
  quiz: 'Quiz',
  workshop: 'Workshop',
  assignment: 'Assignment',
};

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const course = getCourseBySlug(slug);
  const [openModules, setOpenModules] = useState<number[]>([1]); // First module open by default

  if (!course) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Course Not Found</h1>
            <p className="text-gray-600 mb-8">The course you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link href="/courses">
              <Button>Browse All Courses</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalLessons = getTotalLessons(course);
  const totalDuration = getTotalDuration(course);

  const toggleModule = (moduleId: number) => {
    setOpenModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const scrollToEnroll = () => {
    const enrollSection = document.getElementById('enroll-section');
    enrollSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main>
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Courses
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-primary-800 text-white pt-12 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Course Info */}
              <div className="lg:col-span-2">
                <div className="mb-4">
                  <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold uppercase tracking-wide">
                    {course.category}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">{course.title}</h1>
                <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                  {course.longDescription || course.description}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-primary-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{course.enrollments.toLocaleString()} enrolled</span>
                  </div>
                  {course.rating > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating} rating</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 shadow-2xl text-gray-900">
                  <div className="mb-6">
                    <span className="text-sm text-gray-500">Course Fee</span>
                    <p className="text-4xl font-bold text-primary-900">RM {course.price}</p>
                  </div>

                  <Button
                    onClick={scrollToEnroll}
                    className="w-full bg-primary-700 hover:bg-primary-800 text-white py-6 text-lg mb-4"
                  >
                    Enroll Now
                  </Button>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-primary-700" />
                      <span>{totalLessons} lessons ({totalDuration})</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-primary-700" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-primary-700" />
                      <span>Lifetime access to materials</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-primary-700" />
                      <span>Hands-on workshops included</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* What You'll Learn */}
                {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">What You&apos;ll Learn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.learningOutcomes.map((outcome, index) => (
                        <div key={index} className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary-700 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Curriculum */}
                {course.curriculum && course.curriculum.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
                      <span className="text-sm text-gray-500">
                        {course.curriculum.length} modules • {totalLessons} lessons
                      </span>
                    </div>

                    <div className="space-y-4">
                      {course.curriculum.map((module) => (
                        <div
                          key={module.id}
                          className="border border-gray-200 rounded-xl overflow-hidden"
                        >
                          {/* Module Header */}
                          <button
                            onClick={() => toggleModule(module.id)}
                            className="w-full px-6 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-lg bg-primary-700 text-white flex items-center justify-center text-sm font-bold">
                                {module.id}
                              </div>
                              <div className="text-left">
                                <h3 className="font-semibold text-gray-900">{module.title}</h3>
                                <p className="text-sm text-gray-500">{module.lessons.length} lessons</p>
                              </div>
                            </div>
                            {openModules.includes(module.id) ? (
                              <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </button>

                          {/* Module Lessons */}
                          {openModules.includes(module.id) && (
                            <div className="divide-y divide-gray-100">
                              {module.lessons.map((lesson) => (
                                <div key={lesson.id} className="px-6 py-4 flex items-start gap-4">
                                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                                    {lessonTypeIcons[lesson.type]}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-medium text-gray-900 truncate">{lesson.title}</h4>
                                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs font-medium flex-shrink-0">
                                        {lessonTypeLabels[lesson.type]}
                                      </span>
                                    </div>
                                    {lesson.description && (
                                      <p className="text-sm text-gray-500">{lesson.description}</p>
                                    )}
                                  </div>
                                  <span className="text-sm text-gray-400 flex-shrink-0">{lesson.duration}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instructor */}
                {course.instructorBio && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Instructor</h2>
                    <div className="bg-gray-50 rounded-xl p-6 flex gap-6">
                      <div className="w-20 h-20 rounded-xl bg-primary-700 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                        {course.instructor.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{course.instructor}</h3>
                        <p className="text-gray-600">{course.instructorBio}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-8">
                {/* Course Features */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">This Course Includes</h3>
                  <ul className="space-y-3">
                    {course.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-700">
                        <CheckCircle2 className="w-5 h-5 text-primary-700 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prerequisites */}
                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Prerequisites</h3>
                    <ul className="space-y-2">
                      {course.prerequisites.map((prereq, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Target Audience */}
                {course.targetAudience && course.targetAudience.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Who Is This For?</h3>
                    <ul className="space-y-2">
                      {course.targetAudience.map((audience, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <User className="w-4 h-4 text-primary-700 flex-shrink-0 mt-0.5" />
                          {audience}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="enroll-section" className="py-20 bg-primary-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-primary-100 text-lg mb-8">
              Join {course.enrollments.toLocaleString()}+ professionals who have already enrolled in this course.
            </p>
            <div className="bg-white rounded-2xl p-8 text-gray-900 max-w-md mx-auto">
              <div className="mb-6">
                <span className="text-sm text-gray-500">Course Fee</span>
                <p className="text-4xl font-bold text-primary-900">RM {course.price}</p>
              </div>
              <Link href={`/courses?enroll=${course.slug}`}>
                <Button className="w-full bg-primary-700 hover:bg-primary-800 text-white py-6 text-lg">
                  Enroll Now
                </Button>
              </Link>
              <p className="text-sm text-gray-500 mt-4">
                Secure payment • Certificate included • Lifetime access
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
