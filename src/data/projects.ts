export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectPreview {
  src: string;
  alt: string;
  /** Live site URL when the preview is clickable. */
  href?: string;
}

export interface Project {
  slug: string;
  title: string;
  date: string;
  tagline: string;
  role: string;
  summary: string;
  problem: string;
  approach: string;
  outcomes: string[];
  /** Comma-separated skillicons.dev slugs for this project. */
  skillIcons: string;
  links: ProjectLink[];
  preview?: ProjectPreview;
}

/** Profile-wide skills shown in the About modal. */
export const aboutSkillIcons =
  "java,react,go,aws,git,ts,postgres,github,postman,docker,nextjs,python";

export const projects: Project[] = [
  {
    slug: "lockerroom",
    title: "LockerRoom",
    date: "April 2026",
    tagline: "Real-time sports chat and live game rooms",
    role: "Personal project",
    summary:
      "A Next.js sports platform with Supabase realtime chat, authenticated room messaging, and live sports data routes for scores and summaries.",
    problem:
      "Sports fans want a single place to follow live games and talk with others in real time, without juggling separate score apps and chat tools.",
    approach:
      "Built a Next.js sports platform with Supabase realtime chat, authenticated room messaging, and live sports data routes for scores and summaries with semantic HTML to improve user accessibility.",
    outcomes: [
      "Shipped end-to-end auth callback handling and room message APIs.",
      "Architected backend API layer for real-time room messaging, handling auth callbacks and live sports event data to support concurrent user sessions.",
      "Designed live game rooms combining recent plays, authenticated chat, and event context, enabling seamless real-time discussion for concurrent users during live events",
    ],
    skillIcons: "nextjs,react,ts,supabase,github",
    links: [

    ],
    preview: {
      src: "/projects/lockerroom-preview.png",
      alt: "LockerRoom MLB scores dashboard preview",
      href: "https://lockerroom-kappa.vercel.app",
    },
  },
  {
    slug: "headlines-and-sidelines",
    title: "Headlines and Sidelines",
    date: "February 2026",
    tagline: "Full-stack sports news with live ESPN data",
    role: "Personal project",
    summary:
      "A sports news platform combining editorial content and live ESPN data, with a TypeScript React frontend, Markdown-based CMS, and custom Node.js publishing pipeline.",
    problem:
      "Daily sports coverage needs both editorial voice and reliable live scores across multiple leagues, with a workflow that supports consistent publishing.",
    approach:
      "Combined a Markdown CMS and Node.js publishing pipeline with a React frontend that pulls ESPN data through cached API integrations and ships via GitHub Actions to Vercel.",
    outcomes: [
      "Published 2 sports articles per day throughout February 2026.",
      "Integrated ESPN scores and standings for NBA, NHL, NFL, MLB, and EPL with client-side caching and error boundaries.",
      "Automated linting, type-checking, and zero-downtime deployment through GitHub Actions.",
    ],
    skillIcons: "ts,react,nodejs,github,vercel",
    links: [
    ],
    preview: {
      src: "/projects/headlines-preview.png",
      alt: "Headlines and Sidelines sports news site preview",
      href: "https://headlinesandsidelines.com",
    },
  },
  {
    slug: "aigentz-iqube",
    title: "AigentZ & iQube Protocol",
    date: "January – December 2025",
    tagline: "AI-driven blockchain data capstone",
    role: "Lehigh Capstone",
    summary:
      "Lehigh Capstone integrating four AI services with blockchain-secured personal data payloads (iQubes), plus a full cloud infrastructure migration to production.",
    problem:
      "The capstone prototype ran locally behind a reverse proxy and needed production-grade cloud infrastructure while connecting multiple AI services to secured personal data payloads.",
    approach:
      "Integrated four AI services for querying blockchain-secured iQubes, then owned the AWS migration—EC2, DNS, Route 53, Secrets Manager, and Amplify—to move from local prototype to stable production.",
    outcomes: [
      "Enabled AI-driven querying across four integrated AI services and iQube payloads.",
      "Migrated from reverse-proxied local prototype to production on AWS.",
      "Configured EC2, GoDaddy DNS, Route 53, Secrets Manager, and Amplify for stable deployment.",
    ],
    skillIcons: "aws,go,git,github,docker,ts",
    links: [],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
