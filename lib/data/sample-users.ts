/**
 * Sample Malaysian User Profiles for Demo/Testing
 * Use these for development and demonstration purposes
 */

export interface SampleUser {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'instructor' | 'admin';
  company: string;
  department: string;
  position: string;
  phone: string;
  skills: string[];
  avatar_initials: string;
  member_type: 'free' | 'premium';
}

export const sampleUsers: SampleUser[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    email: "siti.aminah@petronas.com.my",
    name: "Siti Aminah Binti Zulkifli",
    role: "student",
    company: "Petronas",
    department: "Project Management",
    position: "Senior Project Engineer",
    phone: "+60 12-345 6789",
    skills: ["Scrum", "Risk Management", "Stakeholder Management", "MS Project"],
    avatar_initials: "SA",
    member_type: "premium"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    email: "wei.tan@gmail.com",
    name: "Tan Wei Ming",
    role: "instructor",
    company: "Freelance / Tenaga Nasional",
    department: "Training & Development",
    position: "Agile Coach",
    phone: "+60 19-234 5678",
    skills: ["Kanban", "SAFe", "Leadership", "Coaching", "Jira"],
    avatar_initials: "TW",
    member_type: "premium"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    email: "arjun.subra@cimb.com.my",
    name: "Arjun Subramaniam a/l Ramasamy",
    role: "student",
    company: "CIMB",
    department: "Digital Transformation",
    position: "Product Owner",
    phone: "+60 17-345 6789",
    skills: ["User Stories", "SQL", "Product Strategy", "Data Analysis"],
    avatar_initials: "AS",
    member_type: "premium"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    email: "farhana.ali@maxis.com.my",
    name: "Farhana Binti Ali",
    role: "student",
    company: "Maxis",
    department: "Software Engineering",
    position: "QA Lead",
    phone: "+60 14-567 8901",
    skills: ["Automated Testing", "Selenium", "CI/CD", "Java"],
    avatar_initials: "FA",
    member_type: "free"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    email: "jason.lee@maybank.com.my",
    name: "Jason Lee Jun Wei",
    role: "student",
    company: "Maybank",
    department: "Investment Technology",
    position: "Software Engineer",
    phone: "+60 18-567 8901",
    skills: ["React", "TypeScript", "Node.js", "Agile"],
    avatar_initials: "JL",
    member_type: "free"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    email: "raj.kumar@airasia.com",
    name: "Rajesh Kumar",
    role: "student",
    company: "AirAsia",
    department: "Digital Labs",
    position: "Scrum Master",
    phone: "+60 10-234 5678",
    skills: ["Facilitation", "Confluence", "Trello", "Team Management"],
    avatar_initials: "RK",
    member_type: "premium"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    email: "nurul.huda@gmail.com",
    name: "Nurul Huda Binti Kassim",
    role: "admin",
    company: "Public Bank",
    department: "IT Operations",
    position: "System Admin",
    phone: "+60 12-987 6543",
    skills: ["Linux", "AWS", "Security", "ITIL", "PowerShell"],
    avatar_initials: "NH",
    member_type: "premium"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440008",
    email: "david.lim@celcom.com.my",
    name: "Lim David",
    role: "student",
    company: "CelcomDigi",
    department: "Network Infrastructure",
    position: "Technical Project Manager",
    phone: "+60 19-876 5432",
    skills: ["PMP", "Telecoms", "Budgeting", "Gantt Charts"],
    avatar_initials: "LD",
    member_type: "free"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440009",
    email: "premalatha.shantu@gov.my",
    name: "Premalatha a/l Shanty",
    role: "student",
    company: "Jabatan Perkhidmatan Awam (JPA)",
    department: "HR Development",
    position: "Assistant Director",
    phone: "+60 13-456 7890",
    skills: ["Public Administration", "Communication", "Training Coordination"],
    avatar_initials: "PS",
    member_type: "free"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440010",
    email: "ahmad.fikri@tnb.com.my",
    name: "Ahmad Fikri Bin Al Bakri",
    role: "instructor",
    company: "Tenaga Nasional",
    department: "Academy",
    position: "Technical Trainer",
    phone: "+60 16-345 6789",
    skills: ["Engineering", "Leadership", "Technical Writing", "Presentation"],
    avatar_initials: "AF",
    member_type: "premium"
  }
];

// Quick access helpers
export const getDemoUser = () => sampleUsers.find(u => u.role === 'student');
export const getInstructor = () => sampleUsers.find(u => u.role === 'instructor');
export const getAdmin = () => sampleUsers.find(u => u.role === 'admin');
export const getPremiumUsers = () => sampleUsers.filter(u => u.member_type === 'premium');
export const getFreeUsers = () => sampleUsers.filter(u => u.member_type === 'free');

// Demo credentials for login page
export const demoCredentials = {
  student: { email: 'ahmad@demo.com', password: 'demo123456' },
  instructor: { email: 'wei.tan@gmail.com', password: 'instructor123' },
  admin: { email: 'admin@kitaworkshub.com', password: 'admin123456' },
};
