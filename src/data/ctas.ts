export type SocialIcon = "github" | "linkedin";

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIcon;
}

export type OverlayAction = "about" | "projects" | "experience";

export interface AerialCta {
  label: string;
  href?: string;
  external?: boolean;
  /** Opens an in-app overlay instead of navigating. */
  action?: OverlayAction;
}

export interface CtaConfig {
  hero: {
    label: string;
    subtitle: string;
  };
  resume: {
    label: string;
    href: string;
    download: string;
  };
  contact: {
    label: string;
    href: string;
  };
  social: SocialLink[];
  aerial: AerialCta[];
}

export const ctas: CtaConfig = {
  hero: {
    label: "Noah Buller",
    subtitle: "Software Engineer",
  },
  resume: {
    label: "Resume",
    href: "/resume.pdf",
    download: "NoahBuller_resume.pdf",
  },
  contact: {
    label: "Contact",
    href: "mailto:bullern22@gmail.com?subject=Reaching%20out%20from%20your%20website",
  },
  social: [
    {
      label: "GitHub",
      href: "https://github.com/noahbuller",
      icon: "github",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/noahbuller",
      icon: "linkedin",
    },
  ],
  aerial: [
    {
      label: "Projects",
      action: "projects",
    },
    {
      label: "About",
      action: "about",
    },
  ],
};
