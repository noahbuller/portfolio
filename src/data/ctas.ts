export type SocialIcon = "github" | "linkedin";

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIcon;
}

export interface AerialCta {
  label: string;
  href: string;
  external?: boolean;
}

export interface CtaConfig {
  hero: {
    label: string;
    subtitle: string;
  };
  resume: {
    label: string;
    href: string;
    /** Filename used for the download (the `download` attribute value). */
    download: string;
  };
  contact: {
    label: string;
    href: string;
  };
  social: SocialLink[];
  /** Secondary CTAs carried by planes/boats across the sky and sea. */
  aerial: AerialCta[];
}

// Single source of truth for every CTA in the scene and the fixed nav.
// Swap these placeholder values for real links before launch.
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
  // Carried by planes (and later boats). Placeholders until dedicated
  // Projects/About destinations exist.
  aerial: [
    {
      label: "Projects",
      href: "https://github.com/noahbuller",
      external: true,
    },
    {
      label: "About",
      href: "#about",
    },
  ],
};
