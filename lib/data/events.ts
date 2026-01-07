// Shared event data for consistency across public, portal, and admin

export interface AgendaItem {
  time: string;
  title: string;
  description?: string;
}

export interface Event {
  id: number;
  title: string;
  slug: string;
  type: 'Workshop' | 'Seminar' | 'Networking';
  date: string;
  month: string;
  time: string;
  location: string;
  address?: string;
  capacity: number;
  registered: number;
  price: string;
  priceValue: number;
  description: string;
  longDescription?: string;
  speaker: string;
  speakerBio?: string;
  highlights: string[];
  agenda?: AgendaItem[];
  requirements?: string[];
  featured?: boolean;
}

export const events: Event[] = [
  {
    id: 1,
    title: "Building Resilient PMO Systems",
    slug: "building-resilient-pmo-systems",
    type: "Workshop",
    date: "15",
    month: "Jan 2025",
    time: "9:00 AM - 5:00 PM",
    location: "KL Convention Centre",
    address: "Kuala Lumpur Convention Centre, Jalan Pinang, KLCC, 50088 Kuala Lumpur",
    capacity: 50,
    registered: 32,
    price: "450",
    priceValue: 450,
    description: "Hands-on workshop designing PMO frameworks that adapt to organizational change.",
    longDescription: "Join us for an intensive full-day workshop where you'll learn to design and implement Project Management Office frameworks that can withstand organizational turbulence. Through practical exercises and real-world case studies, you'll develop the skills to build PMOs that drive value and adapt to changing business needs.",
    speaker: "Sarah Lim, PMO Director",
    speakerBio: "Sarah Lim is a PMO Director with 15+ years of experience establishing and transforming PMOs across banking, telecommunications, and manufacturing sectors in Malaysia and Singapore.",
    highlights: ["Interactive Exercises", "PMO Templates", "Case Studies", "Networking Lunch"],
    agenda: [
      { time: "9:00 AM", title: "Registration & Networking", description: "Coffee and light refreshments" },
      { time: "9:30 AM", title: "PMO Fundamentals Refresher", description: "Types, roles, and value proposition" },
      { time: "11:00 AM", title: "Resilience Framework Workshop", description: "Building adaptable PMO structures" },
      { time: "12:30 PM", title: "Networking Lunch", description: "Catered lunch with fellow participants" },
      { time: "1:30 PM", title: "Case Study Analysis", description: "Learning from real PMO transformations" },
      { time: "3:00 PM", title: "Hands-on Exercise", description: "Design your PMO resilience plan" },
      { time: "4:30 PM", title: "Group Presentations & Feedback" },
      { time: "5:00 PM", title: "Closing & Certificates" }
    ],
    requirements: [
      "Laptop for exercises",
      "Basic understanding of project management",
      "Current or aspiring PMO role"
    ],
    featured: true
  },
  {
    id: 2,
    title: "Leadership in the Age of AI",
    slug: "leadership-in-the-age-of-ai",
    type: "Seminar",
    date: "22",
    month: "Jan 2025",
    time: "2:00 PM - 5:00 PM",
    location: "Online (Zoom)",
    capacity: 200,
    registered: 145,
    price: "150",
    priceValue: 150,
    description: "Explore how AI transforms leadership, decision-making, and team dynamics.",
    longDescription: "As AI reshapes the workplace, leaders must evolve their approach to decision-making, team management, and strategic planning. This seminar explores the intersection of human leadership and artificial intelligence, providing practical frameworks for leading in an AI-augmented world.",
    speaker: "Dr. Ali Hassan",
    speakerBio: "Dr. Ali Hassan holds a PhD in Organizational Psychology and has 20 years of experience in leadership development. He specializes in the future of work and human-AI collaboration.",
    highlights: ["AI Strategy", "Future of Work", "Q&A Session", "Certificate"],
    agenda: [
      { time: "2:00 PM", title: "Welcome & Introduction" },
      { time: "2:15 PM", title: "The AI Leadership Landscape", description: "Current trends and future projections" },
      { time: "3:00 PM", title: "Human-AI Decision Making", description: "Frameworks for augmented leadership" },
      { time: "3:45 PM", title: "Break" },
      { time: "4:00 PM", title: "Leading AI-Enabled Teams", description: "New dynamics and challenges" },
      { time: "4:30 PM", title: "Q&A Session" },
      { time: "5:00 PM", title: "Closing & Certificate Distribution" }
    ],
    requirements: [
      "Stable internet connection",
      "Zoom installed on device",
      "Quiet space for participation"
    ]
  },
  {
    id: 3,
    title: "Project Leaders Networking Mixer",
    slug: "project-leaders-networking-mixer",
    type: "Networking",
    date: "28",
    month: "Jan 2025",
    time: "6:00 PM - 9:00 PM",
    location: "The Exchange TRX, KL",
    address: "The Exchange TRX, Tun Razak Exchange, 55188 Kuala Lumpur",
    capacity: 80,
    registered: 58,
    price: "80",
    priceValue: 80,
    description: "Connect with fellow project leaders, share insights, and build lasting relationships.",
    longDescription: "Join us for an evening of meaningful connections at one of KL's most prestigious venues. This networking mixer brings together project managers, PMO professionals, and business leaders for an informal evening of relationship-building, knowledge sharing, and fun.",
    speaker: "Open Networking",
    highlights: ["Speed Networking", "Food & Drinks", "Door Prizes", "Informal Talks"],
    agenda: [
      { time: "6:00 PM", title: "Arrival & Registration", description: "Welcome drinks" },
      { time: "6:30 PM", title: "Speed Networking Round 1", description: "Meet 6 new connections" },
      { time: "7:15 PM", title: "Dinner Service", description: "Buffet dinner with networking" },
      { time: "8:00 PM", title: "Speed Networking Round 2", description: "Meet 6 more connections" },
      { time: "8:30 PM", title: "Door Prize Drawing" },
      { time: "9:00 PM", title: "Event Closes" }
    ],
    requirements: [
      "Business cards (recommended)",
      "Business casual attire"
    ]
  },
  {
    id: 4,
    title: "Agile at Scale Workshop",
    slug: "agile-at-scale-workshop",
    type: "Workshop",
    date: "05",
    month: "Feb 2025",
    time: "9:00 AM - 4:00 PM",
    location: "Sunway University",
    address: "Sunway University, No.5 Jalan Universiti, Bandar Sunway, 47500 Petaling Jaya",
    capacity: 40,
    registered: 18,
    price: "550",
    priceValue: 550,
    description: "Deep dive into SAFe, LeSS, and other frameworks for scaling Agile across enterprises.",
    longDescription: "Ready to take Agile beyond individual teams? This hands-on workshop explores the leading frameworks for scaling Agile across the enterprise, including SAFe, LeSS, and Nexus. Through simulation games and practical exercises, you'll learn how to coordinate multiple teams and deliver value at scale.",
    speaker: "Rizwan Malik",
    speakerBio: "Rizwan Malik is a SAFe Program Consultant (SPC) with 12+ years leading enterprise-scale Agile implementations. He has coached over 50 Scrum teams across manufacturing and technology sectors.",
    highlights: ["Scaling Frameworks", "Simulation Games", "Toolkits", "Lunch Included"],
    agenda: [
      { time: "9:00 AM", title: "Welcome & Introductions" },
      { time: "9:30 AM", title: "Why Scale? When Scale?", description: "Understanding the need for scaling" },
      { time: "10:30 AM", title: "SAFe Deep Dive", description: "Roles, events, and artifacts" },
      { time: "12:00 PM", title: "Lunch Break" },
      { time: "1:00 PM", title: "LeSS & Nexus Overview", description: "Alternative scaling approaches" },
      { time: "2:00 PM", title: "PI Planning Simulation", description: "Experience Program Increment planning" },
      { time: "3:30 PM", title: "Implementation Roadmap Workshop" },
      { time: "4:00 PM", title: "Closing & Certificates" }
    ],
    requirements: [
      "Prior Scrum experience required",
      "Laptop recommended",
      "Open mindset for collaboration"
    ],
    featured: true
  },
  {
    id: 5,
    title: "Women in Project Management",
    slug: "women-in-project-management",
    type: "Seminar",
    date: "12",
    month: "Feb 2025",
    time: "10:00 AM - 1:00 PM",
    location: "Menara Hap Seng, KL",
    address: "Menara Hap Seng, Jalan P. Ramlee, 50250 Kuala Lumpur",
    capacity: 100,
    registered: 67,
    price: "Free",
    priceValue: 0,
    description: "Celebrating and empowering women leaders in the project management field.",
    longDescription: "Join us for an inspiring morning celebrating women leaders in project management. Hear from a panel of accomplished professionals who share their journeys, challenges, and advice for navigating the field. Connect with mentors and build your support network.",
    speaker: "Panel Discussion",
    speakerBio: "Featuring 5 accomplished women leaders from various industries including technology, construction, healthcare, and finance.",
    highlights: ["Inspiring Stories", "Career Tips", "Mentorship Network", "Refreshments"],
    agenda: [
      { time: "10:00 AM", title: "Registration & Networking", description: "Coffee and refreshments" },
      { time: "10:30 AM", title: "Opening Keynote", description: "Breaking barriers in PM" },
      { time: "11:00 AM", title: "Panel Discussion", description: "5 women leaders share their stories" },
      { time: "12:00 PM", title: "Mentorship Matching Session" },
      { time: "12:30 PM", title: "Networking Lunch" },
      { time: "1:00 PM", title: "Event Closes" }
    ],
    requirements: [
      "Open to all genders",
      "Register early - limited seats"
    ]
  },
  {
    id: 6,
    title: "Hybrid Teams Management Workshop",
    slug: "hybrid-teams-management-workshop",
    type: "Workshop",
    date: "18",
    month: "Feb 2025",
    time: "1:00 PM - 6:00 PM",
    location: "MRANTI Park, Cyberjaya",
    address: "MRANTI Park, Persiaran APEC, Cyberjaya, 63000 Selangor",
    capacity: 35,
    registered: 22,
    price: "380",
    priceValue: 380,
    description: "Master the art of managing distributed teams across time zones and cultures.",
    longDescription: "The future of work is hybrid. This workshop equips you with practical strategies for managing teams that span offices, homes, and time zones. Learn to build trust, maintain productivity, and create inclusive cultures in distributed environments.",
    speaker: "Jenny Tan",
    speakerBio: "Jenny Tan is a PMP-certified trainer with 18 years of project management experience. She specializes in remote and hybrid team leadership, having managed global teams across 8 countries.",
    highlights: ["Remote Tools", "Cultural Intelligence", "Async Communication", "Tea Break"],
    agenda: [
      { time: "1:00 PM", title: "Welcome & Icebreaker" },
      { time: "1:30 PM", title: "Hybrid Work Reality Check", description: "Challenges and opportunities" },
      { time: "2:30 PM", title: "Tools & Tech Stack", description: "Building your remote toolkit" },
      { time: "3:30 PM", title: "Tea Break" },
      { time: "4:00 PM", title: "Cultural Intelligence", description: "Managing across cultures and time zones" },
      { time: "5:00 PM", title: "Async Communication Workshop", description: "Mastering written communication" },
      { time: "5:45 PM", title: "Action Planning & Closing" }
    ],
    requirements: [
      "Currently managing or will manage hybrid teams",
      "Laptop for interactive exercises",
      "List of current team challenges to discuss"
    ]
  }
];

export const eventTypes = ["All Events", "Workshop", "Seminar", "Networking"] as const;
export const eventMonths = ["All Months", "Jan 2025", "Feb 2025"] as const;

export const getUpcomingEvents = () => events;
export const getFeaturedEvents = () => events.filter(e => e.featured);
export const getEventBySlug = (slug: string) => events.find(e => e.slug === slug);
export const getEventById = (id: number) => events.find(e => e.id === id);
export const getEventsByType = (type: string) =>
  type === "All Events" ? events : events.filter(e => e.type === type);
export const getEventsByMonth = (month: string) =>
  month === "All Months" ? events : events.filter(e => e.month === month);
