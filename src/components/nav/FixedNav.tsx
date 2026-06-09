"use client";

import Link from "next/link";
import { ctas } from "@/data/ctas";
import { SocialSvg } from "@/components/icons";
import { useAboutOptional } from "@/components/about/AboutProvider";
import styles from "./FixedNav.module.css";

/**
 * Slim persistent top bar. Mirrors every CTA so nothing is ever unreachable
 * while the city scrolls behind it.
 */
export function FixedNav() {
  const about = useAboutOptional();

  return (
    <header className={styles.nav}>
      <Link className={`${styles.brand} font-display`} href="/">
        {ctas.hero.label}
      </Link>

      <nav className={styles.links} aria-label="Primary">
        <Link className={styles.link} href="/projects">
          Projects
        </Link>
        <Link className={styles.link} href="/experience">
          Experience
        </Link>
        {about ? (
          <button type="button" className={styles.linkButton} onClick={about.openAbout}>
            About
          </button>
        ) : null}
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
