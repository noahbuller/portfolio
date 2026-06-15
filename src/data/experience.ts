export interface ExperienceRole {
  id: string;
  company: string;
  title: string;
  location: string;
  dates: string;
  summary: string;
  bullets: string[];
  /** Comma-separated skillicons.dev slugs for this role. */
  skillIcons: string;
}

export interface CourseGroup {
  label: string;
  courses: string[];
  /** Optional skillicons.dev slugs for this course group. */
  skillIcons?: string;
}

export const experienceRoles: ExperienceRole[] = [
  {
    id: "javelin",
    company: "Javelin",
    title: "Software Engineer Intern",
    location: "Remote",
    dates: "March 2025 – March 2026",
    summary:
      "Full-stack internship building Go AWS Lambda services, PostgreSQL search tooling, and API validation for production user flows.",
    bullets: [
      "Developed a Go-based AWS Lambda microservice to validate 12 API keys twice daily, adding retry logic and DynamoDB failure logging to improve reliability.",
      "Engineered a dynamic search-query builder supporting 8 user-facing inputs across 7 PostgreSQL tables (~5,000–6,000 rows), using indexed queries and cross-table checks to increase search speed and reduce invalid responses.",
      "Integrated Zod-based server-side validation across 8 user-input API routes to enforce runtime schema checks and improve backend robustness.",
    ],
    skillIcons: "ts,aws,postgres,go,lambda",
  },
  {
    id: "certifydoc",
    company: "Certifydoc",
    title: "Software Engineer Intern",
    location: "Barcelona, Spain",
    dates: "May – July 2024",
    summary:
      "Full-stack internship on a Next.js/React credential platform, shipping core screens and hardening authentication flows.",
    bullets: [
      "Collaborated with a team of 5 interns to build a Next.js and React web application across 3 core screens for media upload and account workflows.",
      "Reimplemented hashed credential storage and secure session handling to preserve a secure authentication flow across frontend and backend systems.",
    ],
    skillIcons: "nextjs,react,ts,github",
  },
];

export const education = {
  school: "Lehigh University",
  degree: "Bachelor of Science in Computer Science and Business",
  gpa: "3.62",
  dates: "August 2022 – May 2026",
  summary:
    "Dual-degree program combining systems fundamentals, software engineering practice, and business application design.",
  honors: [
    "Upsilon Pi Epsilon Honor Society",
    "Dean's List (5 Semesters)",
  ],
};

export const courseGroups: CourseGroup[] = [
  {
    label: "Computer science core",
    skillIcons: "java,python,ts,linux,docker",
    courses: [
      "Discrete Structures & Algorithms",
      "Operating System Design",
      "Database Systems",
      "Software Engineering Principles",
      "Computer Architecture",
      "Web Systems Programming",
    ],
  },
  {
    label: "Business & communication",
    courses: [
      "Business Application Design",
      "Business Communications",
      "Manegerial Accounting",
      "Princples of Finance",
      "Strategic Management in a Global Enviornment"
    ],
  },
];

export const leadership = {
  organization: "Lehigh University Brazilian Jiu-Jitsu Club",
  shortName: "Lehigh BJJ Club",
  role: "Secretary and Cofounder",
  dates: "March 2024 – May 2026",
  summary:
    "Cofounded Lehigh's first BJJ club and grew membership from zero to 200+ through outreach, events, and consistent weekly coordination.",
  bullets: [
    "Helped found the club and grew GroupMe membership to 200+, with peak event attendance of 65 members.",
    "Coordinated weekly reminders and biweekly events, helping run over 90% of practices and organize meetings with officers and coaches.",
  ],
};
