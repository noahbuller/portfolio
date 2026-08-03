export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectPreview {
  src: string;
  alt: string;
  /** Live site URL when the preview is clickable. */
  href?: string;
  /** Overlay label shown on hover when href is set. Defaults to "Visit live site". */
  linkLabel?: string;
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
      "Built authenticated live game rooms on Next.js with Supabase realtime messaging, API routes for sports data, and room-specific event pages that combine scores, recent plays, and chat.",
    outcomes: [
      "Shipped end-to-end auth callback handling and room message APIs.",
      "Designed live game rooms that merge event context, recent plays, and realtime chat.",
      "Integrated live sports data routes for scores and summaries alongside chat.",
    ],
    skillIcons: "nextjs,react,ts,supabase,postgres,github",
    links: [
      {
        label: "Live site",
        href: "https://lockerroom-kappa.vercel.app",
      },
    ],
    preview: {
      src: "/projects/lockerroom-preview.jpg",
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
      "Developed a full-stack sports news platform with React/TypeScript, FastAPI, and PostgreSQL, supporting 56+ published stories and a JWT-secured admin portal for content management.",
    outcomes: [
      "Published 2 sports articles per day throughout February 2026.",
      "Implemented ESPN scores and standings for NBA, NHL, NFL, MLB, and EPL using client-side caching and error boundaries.",
      "Automated linting, type-checking, and zero-downtime deployment through GitHub Actions.",
    ],
    skillIcons: "ts,react,nodejs,github,vercel,postman",
    links: [
      {
        label: "Live site",
        href: "https://headlinesandsidelines.com",
      },
    ],
    preview: {
      src: "/projects/headlines-preview.jpg",
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
      "A 4-person Lehigh Capstone connecting AI agents to blockchain-secured personal data payloads (iQubes), including a full migration from a local prototype to production cloud infrastructure.",
    problem:
      "AI agents and applications need to query and act on personal data without exposing the raw data itself, and the capstone's initial prototype could only demonstrate this locally behind a reverse proxy, with no production-grade infrastructure to run on.",
    approach:
      "As part of a 4-person capstone team, connected 6+ AI and agentic intelligence providers, including OpenAI and DeepSeek, to iQubes so agents could query scoped, verifiable data without ever accessing it in raw form. Owned the migration off the local reverse proxy onto AWS: EC2 for hosting, GoDaddy-managed DNS through Route 53, Secrets Manager for credentials, and Amplify for deployment.",
    outcomes: [
      "Presented the working prototype at Lehigh's capstone poster session, evaluated by faculty.",
      "Migrated from a reverse-proxied local prototype to a production deployment on AWS with managed DNS, secrets, and CI-driven deploys through Amplify.",
      'Selected to continue as a second-year capstone, extending the protocol\'s cross-chain "containment" layer.',
    ],
    skillIcons: "aws,solidity,git,github,docker,ts",
    links: [{ label: "Capstone poster", href: "/projects/iqubeCapstone.png" }],
    preview: {
      src: "/projects/iqubeCapstone.png",
      alt: "iQube Protocol capstone poster covering the abstract, architecture, and results",
      href: "/projects/iqubeCapstone.png",
      linkLabel: "View full poster",
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
