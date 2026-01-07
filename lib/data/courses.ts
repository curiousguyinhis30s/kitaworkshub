// Shared course data for consistency across public, portal, and admin

export interface Lesson {
  id: number;
  title: string;
  duration: string;
  type: 'video' | 'reading' | 'quiz' | 'workshop' | 'assignment';
  description?: string;
}

export interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  category: string;
  duration: string;
  instructor: string;
  instructorBio?: string;
  price: string;
  priceValue: number;
  features: string[];
  modules: number;
  curriculum?: Module[];
  learningOutcomes?: string[];
  prerequisites?: string[];
  targetAudience?: string[];
  status: 'published' | 'draft';
  rating: number;
  enrollments: number;
  thumbnail: string;
}

export const courses: Course[] = [
  {
    id: 1,
    title: "Agile Certified Practitioner",
    slug: "agile-certified-practitioner",
    description: "Master Agile principles, Scrum events, and Kanban flows to accelerate delivery and achieve PMI-ACP certification.",
    longDescription: "This comprehensive 4-day program prepares you for the PMI Agile Certified Practitioner (PMI-ACP) examination while building practical skills in Agile project management. You'll learn to apply Agile principles across various methodologies including Scrum, Kanban, Lean, and XP. Through hands-on workshops and real-world simulations, you'll gain the confidence to lead Agile transformations in your organization.",
    category: "Agile Practices",
    duration: "4 Days",
    instructor: "Sarah Lim",
    instructorBio: "Sarah Lim is a certified Agile Coach with 15+ years of experience in software delivery and organizational transformation. She has trained over 2,000 professionals across Southeast Asia and holds CSM, PMI-ACP, and SAFe certifications.",
    price: "3,500",
    priceValue: 3500,
    features: ["PMI-ACP Exam Prep", "Simulation Workshop", "Exam Voucher Included", "Digital Resources"],
    modules: 12,
    learningOutcomes: [
      "Understand and apply all seven Agile principles effectively",
      "Facilitate Scrum ceremonies including Sprint Planning, Daily Standups, and Retrospectives",
      "Implement Kanban systems for continuous flow optimization",
      "Lead Agile transformation initiatives in traditional organizations",
      "Pass the PMI-ACP certification exam with confidence"
    ],
    prerequisites: [
      "Basic understanding of project management concepts",
      "2+ years of professional work experience",
      "Familiarity with software development lifecycle (recommended)"
    ],
    targetAudience: [
      "Project Managers transitioning to Agile",
      "Scrum Masters seeking certification",
      "Team Leads and Development Managers",
      "IT Professionals in Agile environments"
    ],
    curriculum: [
      {
        id: 1,
        title: "Agile Foundations",
        lessons: [
          { id: 1, title: "Introduction to Agile Mindset", duration: "45 min", type: "video", description: "Understanding the core values and principles behind Agile methodology" },
          { id: 2, title: "Agile Manifesto Deep Dive", duration: "30 min", type: "reading", description: "Exploring the 12 principles and their practical applications" },
          { id: 3, title: "Comparing Agile Frameworks", duration: "60 min", type: "video", description: "Scrum vs Kanban vs XP vs Lean - when to use what" },
          { id: 4, title: "Module 1 Assessment", duration: "20 min", type: "quiz" }
        ]
      },
      {
        id: 2,
        title: "Scrum Framework Mastery",
        lessons: [
          { id: 5, title: "Scrum Roles & Responsibilities", duration: "50 min", type: "video", description: "Product Owner, Scrum Master, and Development Team dynamics" },
          { id: 6, title: "Sprint Planning Workshop", duration: "90 min", type: "workshop", description: "Hands-on practice with user story estimation and sprint commitment" },
          { id: 7, title: "Daily Standups That Work", duration: "25 min", type: "video", description: "Running effective 15-minute daily synchronization meetings" },
          { id: 8, title: "Sprint Review & Retrospective", duration: "60 min", type: "video", description: "Maximizing feedback loops and continuous improvement" },
          { id: 9, title: "Scrum Simulation Exercise", duration: "120 min", type: "workshop", description: "Run a complete sprint cycle with your team" }
        ]
      },
      {
        id: 3,
        title: "Kanban & Flow Optimization",
        lessons: [
          { id: 10, title: "Kanban Principles & Practices", duration: "45 min", type: "video", description: "Visualizing work, limiting WIP, and managing flow" },
          { id: 11, title: "Designing Your Kanban Board", duration: "60 min", type: "workshop", description: "Create an effective board for your team's workflow" },
          { id: 12, title: "Metrics That Matter", duration: "40 min", type: "video", description: "Lead time, cycle time, throughput, and CFD analysis" },
          { id: 13, title: "Continuous Improvement with Kaizen", duration: "35 min", type: "reading" }
        ]
      },
      {
        id: 4,
        title: "PMI-ACP Exam Preparation",
        lessons: [
          { id: 14, title: "Exam Format & Strategy", duration: "30 min", type: "video", description: "Understanding the 120 questions across 7 domains" },
          { id: 15, title: "Domain 1-3 Practice Questions", duration: "45 min", type: "quiz" },
          { id: 16, title: "Domain 4-7 Practice Questions", duration: "45 min", type: "quiz" },
          { id: 17, title: "Full Mock Exam", duration: "180 min", type: "assignment", description: "Complete 120-question simulation under exam conditions" },
          { id: 18, title: "Exam Day Tips & Tricks", duration: "20 min", type: "video" }
        ]
      }
    ],
    status: "published",
    rating: 4.8,
    enrollments: 245,
    thumbnail: "ACP"
  },
  {
    id: 2,
    title: "PMO Fundamentals & Setup",
    slug: "pmo-fundamentals-setup",
    description: "Learn to establish, manage, and mature a Project Management Office from scratch with proven frameworks.",
    longDescription: "This intensive 3-day program equips you with the knowledge and tools to establish a high-functioning Project Management Office from the ground up. Whether you're setting up your first PMO or revitalizing an existing one, you'll learn proven governance frameworks, portfolio management techniques, and change management strategies that drive organizational success.",
    category: "PMO Fundamentals",
    duration: "3 Days",
    instructor: "David Chen",
    instructorBio: "David Chen has established 15+ PMOs across banking, telecommunications, and government sectors in Malaysia. He holds PMP, PgMP, and PfMP certifications and serves as an advisor to several Fortune 500 companies.",
    price: "2,800",
    priceValue: 2800,
    features: ["Templates Toolkit", "Governance Frameworks", "Case Studies", "Implementation Guide"],
    modules: 10,
    learningOutcomes: [
      "Design a PMO structure aligned with organizational strategy",
      "Implement effective governance and reporting frameworks",
      "Establish project prioritization and portfolio management processes",
      "Build a competency development program for project managers",
      "Measure and communicate PMO value to stakeholders"
    ],
    prerequisites: [
      "3+ years of project management experience",
      "Understanding of organizational dynamics",
      "Experience working in cross-functional teams"
    ],
    targetAudience: [
      "Aspiring PMO Directors and Managers",
      "Senior Project Managers",
      "IT Directors and CIOs",
      "Transformation Leaders"
    ],
    curriculum: [
      {
        id: 1,
        title: "PMO Strategy & Vision",
        lessons: [
          { id: 1, title: "Types of PMO: Supportive, Controlling, Directive", duration: "50 min", type: "video", description: "Choosing the right PMO model for your organization" },
          { id: 2, title: "Aligning PMO with Business Strategy", duration: "45 min", type: "video" },
          { id: 3, title: "Building the Business Case", duration: "60 min", type: "workshop", description: "Create a compelling PMO proposal for executive approval" },
          { id: 4, title: "PMO Charter Template Workshop", duration: "45 min", type: "workshop" }
        ]
      },
      {
        id: 2,
        title: "Governance Frameworks",
        lessons: [
          { id: 5, title: "Designing Governance Structures", duration: "55 min", type: "video", description: "Stage gates, tollgates, and decision frameworks" },
          { id: 6, title: "Policies, Procedures & Standards", duration: "40 min", type: "reading" },
          { id: 7, title: "Risk & Issue Escalation Paths", duration: "35 min", type: "video" },
          { id: 8, title: "Governance Framework Exercise", duration: "90 min", type: "workshop" }
        ]
      },
      {
        id: 3,
        title: "Portfolio Management",
        lessons: [
          { id: 9, title: "Project Prioritization Techniques", duration: "60 min", type: "video", description: "Scoring models, bubble charts, and MoSCoW method" },
          { id: 10, title: "Resource Capacity Planning", duration: "45 min", type: "video" },
          { id: 11, title: "Portfolio Dashboard Design", duration: "60 min", type: "workshop" },
          { id: 12, title: "Benefits Realization Tracking", duration: "40 min", type: "video" }
        ]
      },
      {
        id: 4,
        title: "PMO Operations & Maturity",
        lessons: [
          { id: 13, title: "PMO Team Structure & Roles", duration: "35 min", type: "video" },
          { id: 14, title: "Knowledge Management Systems", duration: "45 min", type: "video" },
          { id: 15, title: "PMO Maturity Assessment", duration: "50 min", type: "assignment", description: "Assess your current PMO using the P3M3 model" },
          { id: 16, title: "Continuous Improvement Roadmap", duration: "40 min", type: "video" }
        ]
      }
    ],
    status: "published",
    rating: 4.7,
    enrollments: 189,
    thumbnail: "PMO"
  },
  {
    id: 3,
    title: "Executive Leadership Presence",
    slug: "executive-leadership-presence",
    description: "Develop the confidence and communication skills required for C-Suite success and executive influence.",
    longDescription: "In this transformative 2-day program, you'll develop the executive presence that commands attention and inspires action. Through personalized coaching, video feedback, and real-world practice scenarios, you'll master the art of strategic communication, negotiation, and authentic leadership that distinguishes exceptional executives.",
    category: "Leadership Development",
    duration: "2 Days",
    instructor: "Amina Karim",
    instructorBio: "Amina Karim is an ICF-certified Executive Coach and former McKinsey consultant who has coached CEOs and board members across ASEAN. She specializes in leadership presence and high-stakes communication.",
    price: "1,800",
    priceValue: 1800,
    features: ["Public Speaking", "Strategic Negotiation", "Executive Coaching", "Personal Branding"],
    modules: 8,
    learningOutcomes: [
      "Project confidence and authority in high-stakes situations",
      "Deliver compelling presentations to boards and executives",
      "Navigate difficult conversations with grace and influence",
      "Build a distinctive personal brand as a leader",
      "Master the art of strategic storytelling"
    ],
    prerequisites: [
      "5+ years of management experience",
      "Current or aspiring leadership role",
      "Openness to personal feedback and growth"
    ],
    targetAudience: [
      "Senior Managers and Directors",
      "C-Suite Executives",
      "Entrepreneurs and Business Owners",
      "High-Potential Leaders"
    ],
    curriculum: [
      {
        id: 1,
        title: "Foundations of Executive Presence",
        lessons: [
          { id: 1, title: "What is Executive Presence?", duration: "40 min", type: "video", description: "The three dimensions: gravitas, communication, and appearance" },
          { id: 2, title: "Self-Assessment: Your Presence Profile", duration: "30 min", type: "assignment" },
          { id: 3, title: "Body Language & Non-Verbal Mastery", duration: "50 min", type: "video" },
          { id: 4, title: "Voice & Vocal Power", duration: "45 min", type: "workshop" }
        ]
      },
      {
        id: 2,
        title: "High-Impact Communication",
        lessons: [
          { id: 5, title: "The Executive Storytelling Framework", duration: "55 min", type: "video" },
          { id: 6, title: "Presenting to the Board", duration: "60 min", type: "workshop", description: "Practice delivering a 5-minute board presentation" },
          { id: 7, title: "Handling Tough Questions", duration: "40 min", type: "video" },
          { id: 8, title: "Video Feedback Session", duration: "90 min", type: "workshop" }
        ]
      },
      {
        id: 3,
        title: "Strategic Influence",
        lessons: [
          { id: 9, title: "Negotiation for Executives", duration: "60 min", type: "video", description: "BATNA, anchoring, and interest-based negotiation" },
          { id: 10, title: "Managing Up and Across", duration: "45 min", type: "video" },
          { id: 11, title: "Difficult Conversations Workshop", duration: "75 min", type: "workshop" },
          { id: 12, title: "Building Your Influence Map", duration: "35 min", type: "assignment" }
        ]
      },
      {
        id: 4,
        title: "Personal Brand & Legacy",
        lessons: [
          { id: 13, title: "Defining Your Leadership Brand", duration: "45 min", type: "video" },
          { id: 14, title: "Digital Presence & Thought Leadership", duration: "40 min", type: "video" },
          { id: 15, title: "Your 90-Day Presence Plan", duration: "50 min", type: "assignment", description: "Create an actionable development plan" },
          { id: 16, title: "Closing Coaching Session", duration: "60 min", type: "workshop" }
        ]
      }
    ],
    status: "published",
    rating: 4.9,
    enrollments: 312,
    thumbnail: "ELP"
  },
  {
    id: 4,
    title: "Advanced Scrum Master Training",
    slug: "advanced-scrum-master",
    description: "Go beyond basics. Learn facilitation techniques, coaching, and scaling Agile across the organization.",
    longDescription: "Designed for experienced Scrum Masters ready to level up, this 3-day advanced program deepens your coaching skills, expands your facilitation toolkit, and prepares you for organizational-level Agile adoption. You'll learn to navigate complex team dynamics, resolve conflicts, and lead scaling initiatives using SAFe and LeSS frameworks.",
    category: "Agile Practices",
    duration: "3 Days",
    instructor: "Rizwan Malik",
    instructorBio: "Rizwan Malik is a SAFe Program Consultant and Agile transformation expert with 12+ years leading enterprise-scale Agile implementations. He has coached over 50 Scrum teams across manufacturing and technology sectors.",
    price: "2,400",
    priceValue: 2400,
    features: ["Scaling Frameworks", "Retrospective Plans", "Conflict Resolution", "Team Coaching"],
    modules: 14,
    learningOutcomes: [
      "Apply advanced facilitation techniques for complex situations",
      "Coach teams through conflict and dysfunction",
      "Implement SAFe or LeSS for multi-team coordination",
      "Measure team health and agility metrics effectively",
      "Lead organizational Agile transformation initiatives"
    ],
    prerequisites: [
      "CSM or PSM I certification",
      "1+ year experience as Scrum Master",
      "Active involvement in Scrum team activities"
    ],
    targetAudience: [
      "Experienced Scrum Masters",
      "Agile Coaches",
      "Release Train Engineers",
      "Team Leads in Agile organizations"
    ],
    curriculum: [
      {
        id: 1,
        title: "Advanced Facilitation",
        lessons: [
          { id: 1, title: "Facilitation Mastery", duration: "60 min", type: "video", description: "Moving beyond basic facilitation to transformative conversations" },
          { id: 2, title: "Liberating Structures", duration: "90 min", type: "workshop", description: "Practice 10 powerful meeting formats" },
          { id: 3, title: "Managing Group Dynamics", duration: "45 min", type: "video" },
          { id: 4, title: "Creative Retrospective Formats", duration: "60 min", type: "workshop" }
        ]
      },
      {
        id: 2,
        title: "Team Coaching & Dysfunction",
        lessons: [
          { id: 5, title: "Five Dysfunctions of a Team", duration: "50 min", type: "video" },
          { id: 6, title: "Conflict Resolution Techniques", duration: "60 min", type: "video" },
          { id: 7, title: "Coaching vs Mentoring vs Teaching", duration: "35 min", type: "reading" },
          { id: 8, title: "Difficult Team Scenarios", duration: "90 min", type: "workshop", description: "Role-play challenging real-world situations" }
        ]
      },
      {
        id: 3,
        title: "Scaling Agile",
        lessons: [
          { id: 9, title: "Introduction to SAFe", duration: "75 min", type: "video", description: "Roles, events, and artifacts in the Scaled Agile Framework" },
          { id: 10, title: "LeSS Framework Overview", duration: "45 min", type: "video" },
          { id: 11, title: "Program Increment Planning", duration: "60 min", type: "workshop" },
          { id: 12, title: "Coordination Across Teams", duration: "40 min", type: "video" }
        ]
      },
      {
        id: 4,
        title: "Metrics & Organizational Change",
        lessons: [
          { id: 13, title: "Agile Metrics That Matter", duration: "50 min", type: "video" },
          { id: 14, title: "Team Health Assessments", duration: "45 min", type: "workshop" },
          { id: 15, title: "Leading Agile Transformation", duration: "55 min", type: "video" },
          { id: 16, title: "Building an Agile Center of Excellence", duration: "40 min", type: "video" },
          { id: 17, title: "Your Transformation Roadmap", duration: "60 min", type: "assignment" }
        ]
      }
    ],
    status: "published",
    rating: 4.6,
    enrollments: 156,
    thumbnail: "ASM"
  },
  {
    id: 5,
    title: "Project Management Essentials",
    slug: "project-management-essentials",
    description: "A solid foundation in project planning, execution, monitoring, and closing with industry best practices.",
    longDescription: "This comprehensive 5-day program provides everything you need to manage projects successfully from initiation to closure. Based on PMBOK Guide standards, you'll learn practical skills in planning, scheduling, budgeting, risk management, and stakeholder communication that apply to any industry or project type.",
    category: "PMO Fundamentals",
    duration: "5 Days",
    instructor: "Jenny Tan",
    instructorBio: "Jenny Tan is a PMP-certified trainer with 18 years of project management experience in construction, IT, and healthcare. She has trained over 3,000 project managers and serves on the PMI Malaysia Chapter board.",
    price: "2,200",
    priceValue: 2200,
    features: ["Microsoft Project 101", "Risk Management", "Stakeholder Analysis", "Budget Control"],
    modules: 9,
    learningOutcomes: [
      "Develop comprehensive project plans with clear objectives",
      "Create realistic schedules using WBS and network diagrams",
      "Estimate and control project budgets effectively",
      "Identify and mitigate project risks proactively",
      "Communicate with stakeholders at all levels"
    ],
    prerequisites: [
      "No formal prerequisites",
      "Basic computer skills",
      "Interest in project management career"
    ],
    targetAudience: [
      "Aspiring Project Managers",
      "Team Leads managing projects",
      "Functional Managers",
      "Career changers entering PM"
    ],
    curriculum: [
      {
        id: 1,
        title: "Project Initiation",
        lessons: [
          { id: 1, title: "What is a Project?", duration: "35 min", type: "video", description: "Projects vs operations, triple constraint, success criteria" },
          { id: 2, title: "Project Charter Development", duration: "50 min", type: "video" },
          { id: 3, title: "Stakeholder Identification", duration: "45 min", type: "video" },
          { id: 4, title: "Charter Workshop", duration: "60 min", type: "workshop", description: "Create a charter for your practice project" }
        ]
      },
      {
        id: 2,
        title: "Planning: Scope & Schedule",
        lessons: [
          { id: 5, title: "Requirements Gathering", duration: "40 min", type: "video" },
          { id: 6, title: "Work Breakdown Structure", duration: "55 min", type: "video", description: "Decomposing deliverables into manageable work packages" },
          { id: 7, title: "WBS Creation Exercise", duration: "45 min", type: "workshop" },
          { id: 8, title: "Activity Sequencing & Dependencies", duration: "50 min", type: "video" },
          { id: 9, title: "Duration Estimation Techniques", duration: "40 min", type: "video" },
          { id: 10, title: "Microsoft Project Basics", duration: "90 min", type: "workshop" }
        ]
      },
      {
        id: 3,
        title: "Planning: Cost & Risk",
        lessons: [
          { id: 11, title: "Cost Estimation Methods", duration: "45 min", type: "video" },
          { id: 12, title: "Building the Project Budget", duration: "50 min", type: "video" },
          { id: 13, title: "Risk Identification Techniques", duration: "40 min", type: "video" },
          { id: 14, title: "Risk Analysis & Response Planning", duration: "55 min", type: "video" },
          { id: 15, title: "Risk Register Workshop", duration: "60 min", type: "workshop" }
        ]
      },
      {
        id: 4,
        title: "Execution & Control",
        lessons: [
          { id: 16, title: "Leading Project Teams", duration: "45 min", type: "video" },
          { id: 17, title: "Status Reporting & Meetings", duration: "35 min", type: "video" },
          { id: 18, title: "Earned Value Management", duration: "60 min", type: "video", description: "PV, EV, AC, SPI, CPI calculations" },
          { id: 19, title: "Change Control Process", duration: "40 min", type: "video" },
          { id: 20, title: "EVM Practice Problems", duration: "45 min", type: "quiz" }
        ]
      },
      {
        id: 5,
        title: "Closing & Lessons Learned",
        lessons: [
          { id: 21, title: "Project Closure Activities", duration: "35 min", type: "video" },
          { id: 22, title: "Lessons Learned Sessions", duration: "40 min", type: "video" },
          { id: 23, title: "Final Exam", duration: "60 min", type: "quiz" },
          { id: 24, title: "Certificate Ceremony & Networking", duration: "30 min", type: "workshop" }
        ]
      }
    ],
    status: "published",
    rating: 4.8,
    enrollments: 423,
    thumbnail: "PME"
  },
  {
    id: 6,
    title: "Strategic Team Management",
    slug: "strategic-team-management",
    description: "Build high-performance teams with emotional intelligence and clear KPI structures for sustainable results.",
    longDescription: "This intensive 2-day program transforms how you lead and develop teams. You'll learn to leverage emotional intelligence, design effective performance systems, and navigate the challenges of remote and hybrid team management. Walk away with practical tools to build engaged, high-performing teams that deliver results.",
    category: "Leadership Development",
    duration: "2 Days",
    instructor: "Dr. Ali Hassan",
    instructorBio: "Dr. Ali Hassan holds a PhD in Organizational Psychology from UM and has 20 years of experience in leadership development. He specializes in team dynamics and emotional intelligence training.",
    price: "1,500",
    priceValue: 1500,
    features: ["EQ Assessment", "Performance Reviews", "Remote Leadership", "Conflict Management"],
    modules: 6,
    learningOutcomes: [
      "Assess and develop your emotional intelligence as a leader",
      "Design performance management systems that motivate",
      "Lead remote and hybrid teams effectively",
      "Resolve conflicts and build psychological safety",
      "Coach team members for growth and development"
    ],
    prerequisites: [
      "2+ years of people management experience",
      "Currently leading a team of 3+ members",
      "Willingness to complete pre-work assessment"
    ],
    targetAudience: [
      "Team Leaders and Supervisors",
      "Department Managers",
      "HR Professionals",
      "Project Team Leads"
    ],
    curriculum: [
      {
        id: 1,
        title: "Emotional Intelligence for Leaders",
        lessons: [
          { id: 1, title: "Understanding EQ", duration: "40 min", type: "video", description: "Self-awareness, self-regulation, motivation, empathy, social skills" },
          { id: 2, title: "Your EQ Assessment Results", duration: "45 min", type: "workshop" },
          { id: 3, title: "Developing Your EQ", duration: "50 min", type: "video" }
        ]
      },
      {
        id: 2,
        title: "Performance Management",
        lessons: [
          { id: 4, title: "Setting SMART Goals", duration: "35 min", type: "video" },
          { id: 5, title: "Designing KPIs That Work", duration: "50 min", type: "video" },
          { id: 6, title: "Conducting Effective Reviews", duration: "45 min", type: "video" },
          { id: 7, title: "Performance Conversation Role-Play", duration: "75 min", type: "workshop" }
        ]
      },
      {
        id: 3,
        title: "Remote & Hybrid Team Leadership",
        lessons: [
          { id: 8, title: "Challenges of Remote Leadership", duration: "40 min", type: "video" },
          { id: 9, title: "Building Trust at a Distance", duration: "35 min", type: "video" },
          { id: 10, title: "Remote Team Rituals", duration: "45 min", type: "workshop" },
          { id: 11, title: "Your Remote Team Playbook", duration: "40 min", type: "assignment" }
        ]
      },
      {
        id: 4,
        title: "Conflict & Team Development",
        lessons: [
          { id: 12, title: "Conflict Styles Assessment", duration: "30 min", type: "assignment" },
          { id: 13, title: "Resolving Team Conflicts", duration: "50 min", type: "video" },
          { id: 14, title: "Building Psychological Safety", duration: "45 min", type: "video" },
          { id: 15, title: "Team Development Action Plan", duration: "60 min", type: "assignment" }
        ]
      }
    ],
    status: "draft",
    rating: 0,
    enrollments: 0,
    thumbnail: "STM"
  }
];

export const categories = ["All Courses", "PMO Fundamentals", "Leadership Development", "Agile Practices"];

export const getPublishedCourses = () => courses.filter(c => c.status === 'published');
export const getCourseBySlug = (slug: string) => courses.find(c => c.slug === slug);
export const getCourseById = (id: number) => courses.find(c => c.id === id);

// Helper to calculate total lessons
export const getTotalLessons = (course: Course): number => {
  if (!course.curriculum) return 0;
  return course.curriculum.reduce((total, module) => total + module.lessons.length, 0);
};

// Helper to calculate total duration
export const getTotalDuration = (course: Course): string => {
  if (!course.curriculum) return course.duration;
  let totalMinutes = 0;
  course.curriculum.forEach(module => {
    module.lessons.forEach(lesson => {
      const match = lesson.duration.match(/(\d+)/);
      if (match) totalMinutes += parseInt(match[1]);
    });
  });
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};
