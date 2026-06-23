"use client";

import { ctas } from "@/data/ctas";
import { SocialSvg } from "@/components/icons";
import { useOverlay } from "@/components/overlays/OverlayProvider";
import styles from "./FixedNav.module.css";

/**
 * Slim persistent top bar. Mirrors every CTA so nothing is ever unreachable
 * while the city scrolls behind it.
 */
export function FixedNav() {
  const { view, openAbout, openProjects, openExperience, closeOverlay } = useOverlay();

  return (
    <header className={styles.nav}>
      <button
        type="button"
        className={`${styles.brand} font-display`}
        onClick={closeOverlay}
        aria-current={view === null ? "page" : undefined}
      >
        {ctas.hero.label}
      </button>

      <nav className={styles.links} aria-label="Primary">
        <button
          type="button"
          className={styles.linkButton}
          onClick={openProjects}
          aria-current={view === "projects" || (typeof view === "object" && view?.type === "project") ? "page" : undefined}
        >
          Projects
        </button>
        <button
          type="button"
          className={styles.linkButton}
          onClick={openExperience}
          aria-current={view === "experience" ? "page" : undefined}
        >
          Experience
        </button>
        <button
          type="button"
          className={styles.linkButton}
          onClick={openAbout}
          aria-current={view === "about" ? "page" : undefined}
        >
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
