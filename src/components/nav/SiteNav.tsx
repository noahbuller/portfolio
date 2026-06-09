"use client";

import Link from "next/link";
import { ctas } from "@/data/ctas";
import { useAbout } from "@/components/about/AboutProvider";
import { SocialSvg } from "@/components/icons";
import styles from "./SiteNav.module.css";

interface SiteNavProps {
  current?: "projects" | "experience";
}

/** Coastal-themed nav for scrollable sub-pages. */
export function SiteNav({ current }: SiteNavProps) {
  const { openAbout } = useAbout();

  return (
    <header className={styles.nav}>
      <Link className={styles.brand} href="/">
        ← Back to city
      </Link>

      <nav className={styles.links} aria-label="Primary">
        <Link
          className={`${styles.link} ${current === "projects" ? styles.active : ""}`}
          href="/projects"
        >
          Projects
        </Link>
        <Link
          className={`${styles.link} ${current === "experience" ? styles.active : ""}`}
          href="/experience"
        >
          Experience
        </Link>
        <button type="button" className={styles.linkButton} onClick={openAbout}>
          About
        </button>
        <a className={styles.link} href={ctas.resume.href} download={ctas.resume.download}>
          {ctas.resume.label}
        </a>
        <a className={styles.link} href={ctas.contact.href}>
          {ctas.contact.label}
        </a>
        <span className={styles.divider} aria-hidden="true" />
        <div className={styles.socialGroup}>
          {ctas.social.map((s) => (
            <a
              key={s.label}
              className={styles.icon}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
            >
              <SocialSvg name={s.icon} />
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
