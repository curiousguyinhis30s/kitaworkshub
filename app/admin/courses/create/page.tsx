"use client";

import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  LearnIcon,
  AddIcon,
  SuccessIcon,
  EditIcon,
  DeleteIcon
} from '../../../components/icons/CustomIcons';

interface Module {
  id: number;
  title: string;
  lessons: { title: string; duration: string; type: string }[];
}

interface GeneratedCourse {
  title: string;
  description: string;
  objectives: string[];
  targetAudience: string;
  duration: string;
  price: string;
  modules: Module[];
}

export default function CreateCoursePage() {
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<GeneratedCourse | null>(null);

  // Form fields for manual input
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCategory, setCourseCategory] = useState("project-management");
  const [targetAudience, setTargetAudience] = useState("");
  const [courseDuration, setCourseDuration] = useState("12");

  const handleAIGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    // Simulate AI generation (in production, this would call GLM API)
    setTimeout(() => {
      const mockCourse: GeneratedCourse = {
        title: prompt.includes("Agile") ? "Advanced Agile Project Management" :
               prompt.includes("Leadership") ? "Strategic Leadership Excellence" :
               prompt.includes("Scrum") ? "Scrum Master Certification Prep" :
               "Professional Development Course",
        description: `A comprehensive course designed to transform professionals into experts. This program covers essential theories, practical applications, and real-world case studies tailored for the Malaysian business environment.`,
        objectives: [
          "Master fundamental concepts and frameworks",
          "Apply best practices in real-world scenarios",
          "Develop strategic thinking and decision-making skills",
          "Build leadership capabilities for team management",
          "Prepare for industry certification examinations"
        ],
        targetAudience: "Mid-level managers, project managers, team leads, and professionals seeking career advancement",
        duration: "16 hours across 4 weeks",
        price: "RM 2,800",
        modules: [
          {
            id: 1,
            title: "Foundations & Core Concepts",
            lessons: [
              { title: "Introduction & Course Overview", duration: "30 min", type: "video" },
              { title: "Core Principles & Frameworks", duration: "45 min", type: "video" },
              { title: "Industry Best Practices", duration: "40 min", type: "video" },
              { title: "Module 1 Assessment", duration: "20 min", type: "quiz" }
            ]
          },
          {
            id: 2,
            title: "Practical Applications",
            lessons: [
              { title: "Real-World Case Studies", duration: "50 min", type: "video" },
              { title: "Hands-On Workshop", duration: "90 min", type: "workshop" },
              { title: "Tool & Template Walkthrough", duration: "35 min", type: "video" },
              { title: "Practice Exercise", duration: "45 min", type: "exercise" }
            ]
          },
          {
            id: 3,
            title: "Advanced Strategies",
            lessons: [
              { title: "Strategic Planning Techniques", duration: "55 min", type: "video" },
              { title: "Stakeholder Management", duration: "40 min", type: "video" },
              { title: "Risk & Change Management", duration: "45 min", type: "video" },
              { title: "Live Q&A Session", duration: "60 min", type: "live" }
            ]
          },
          {
            id: 4,
            title: "Certification & Assessment",
            lessons: [
              { title: "Exam Preparation Guide", duration: "40 min", type: "video" },
              { title: "Mock Examination", duration: "90 min", type: "exam" },
              { title: "Review & Feedback", duration: "30 min", type: "video" },
              { title: "Final Certification Exam", duration: "120 min", type: "exam" }
            ]
          }
        ]
      };

      setGeneratedCourse(mockCourse);
      setCourseTitle(mockCourse.title);
      setIsGenerating(false);
      setStep(2);
    }, 3000);
  };

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-primary-100 text-primary-700';
      case 'quiz': return 'bg-accent-100 text-accent-700';
      case 'workshop': return 'bg-orange-100 text-orange-700';
      case 'exercise': return 'bg-emerald-100 text-emerald-700';
      case 'live': return 'bg-red-100 text-red-700';
      case 'exam': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminLayout title="Create Course" subtitle="Use AI to generate course content or build manually">
      {/* Progress Steps */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: "Course Idea" },
            { num: 2, label: "Review Structure" },
            { num: 3, label: "Finalize & Publish" }
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className={`flex items-center gap-3 ${step >= s.num ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step > s.num ? 'bg-primary-600 text-white' :
                  step === s.num ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {step > s.num ? <SuccessIcon size={20} /> : s.num}
                </div>
                <span className="font-medium">{s.label}</span>
              </div>
              {i < 2 && (
                <div className={`w-32 h-1 mx-4 rounded ${step > s.num ? 'bg-primary-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: AI Generation */}
      {step === 1 && (
        <div className="grid grid-cols-2 gap-8">
          {/* AI Generation Panel */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <LearnIcon size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI Course Generator</h2>
                <p className="text-primary-200">Powered by GLM</p>
              </div>
            </div>

            <p className="text-primary-100 mb-6">
              Describe the course you want to create and our AI will generate a complete curriculum including modules, lessons, learning objectives, and assessments.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-primary-200 mb-2">
                Describe your course idea
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Create a comprehensive Agile Project Management course for Malaysian corporate professionals. Include practical workshops, case studies relevant to local industries, and prepare students for PMI-ACP certification..."
                className="w-full h-40 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-primary-200 mb-2">Category</label>
                <select
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="project-management">Project Management</option>
                  <option value="leadership">Leadership</option>
                  <option value="agile">Agile & Scrum</option>
                  <option value="pmo">PMO</option>
                  <option value="soft-skills">Soft Skills</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-200 mb-2">Target Duration (hours)</label>
                <input
                  type="number"
                  value={courseDuration}
                  onChange={(e) => setCourseDuration(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="12"
                />
              </div>
            </div>

            <button
              onClick={handleAIGenerate}
              disabled={isGenerating || !prompt.trim()}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                isGenerating || !prompt.trim()
                  ? 'bg-white/20 text-white/50 cursor-not-allowed'
                  : 'bg-white text-primary-700 hover:bg-primary-50'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-6 h-6 border-3 border-primary-300 border-t-primary-600 rounded-full animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <AddIcon size={24} />
                  Generate Course Structure
                </>
              )}
            </button>
          </div>

          {/* Manual Creation Panel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Or Create Manually</h2>
            <p className="text-gray-500 mb-6">Build your course structure step by step without AI assistance.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Who is this course for?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option>Project Management</option>
                  <option>Leadership</option>
                  <option>Agile & Scrum</option>
                  <option>PMO</option>
                  <option>Soft Skills</option>
                </select>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Continue to Structure →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Review Structure */}
      {step === 2 && generatedCourse && (
        <div className="space-y-6">
          {/* Course Overview */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-2 inline-block">
                    AI Generated
                  </span>
                  <h2 className="text-3xl font-bold mb-2">{generatedCourse.title}</h2>
                  <p className="text-primary-100 max-w-2xl">{generatedCourse.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{generatedCourse.price}</p>
                  <p className="text-primary-200">{generatedCourse.duration}</p>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Learning Objectives</h3>
                <ul className="space-y-2">
                  {generatedCourse.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <SuccessIcon size={18} className="text-primary-500 mt-0.5 flex-shrink-0" />
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Target Audience</h3>
                <p className="text-gray-600">{generatedCourse.targetAudience}</p>

                <h3 className="font-bold text-gray-900 mt-6 mb-3">Course Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-primary-600">{generatedCourse.modules.length}</p>
                    <p className="text-sm text-gray-500">Modules</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-accent-600">
                      {generatedCourse.modules.reduce((sum, m) => sum + m.lessons.length, 0)}
                    </p>
                    <p className="text-sm text-gray-500">Lessons</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modules */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Course Modules</h3>
            {generatedCourse.modules.map((module) => (
              <div key={module.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center font-bold">
                      {module.id}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{module.title}</h4>
                      <p className="text-sm text-gray-500">{module.lessons.length} lessons</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-white rounded-lg transition-colors">
                      <EditIcon size={18} className="text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                      <DeleteIcon size={18} className="text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {module.lessons.map((lesson, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                          {i + 1}
                        </span>
                        <span className="text-gray-700">{lesson.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${getLessonTypeColor(lesson.type)}`}>
                          {lesson.type}
                        </span>
                        <span className="text-sm text-gray-500">{lesson.duration}</span>
                      </div>
                    </div>
                  ))}
                  <button className="w-full p-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
                    <AddIcon size={18} />
                    Add Lesson
                  </button>
                </div>
              </div>
            ))}

            <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
              <AddIcon size={20} />
              Add Module
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              ← Back to Generator
            </button>
            <div className="flex gap-4">
              <button className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                Save as Draft
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                Continue to Publish →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Finalize */}
      {step === 3 && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <SuccessIcon size={40} className="text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Course Ready to Publish!</h2>
            <p className="text-gray-500 mb-8">
              Your course &quot;{generatedCourse?.title}&quot; has been prepared with {generatedCourse?.modules.length} modules and {generatedCourse?.modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-bold text-gray-900 mb-4">Before Publishing:</h3>
              <div className="space-y-3">
                {[
                  "Upload video content for each lesson",
                  "Add downloadable materials (PDFs, templates)",
                  "Set up quiz questions for assessments",
                  "Configure pricing and payment gateway",
                  "Review all lesson content for accuracy"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-gray-300 rounded" />
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                ← Edit Structure
              </button>
              <button className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
                Publish Course
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
