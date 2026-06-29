"use client";

import { useEffect, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [prevView, setPrevView] = useState(view);

  if (prevView !== view) {
    setPrevView(view);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;

    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const handleOpenProjects = () => {
    closeMenu();
    openProjects();
  };

  const handleOpenExperience = () => {
    closeMenu();
    openExperience();
  };

  const handleOpenAbout = () => {
    closeMenu();
    openAbout();
  };

  const handleCloseOverlay = () => {
    closeMenu();
    closeOverlay();
  };

  return (
    <header className={styles.nav}>
      <div className={styles.bar}>
        <button
          type="button"
          className={`${styles.brand} font-display`}
          onClick={handleCloseOverlay}
          aria-current={view === null ? "page" : undefined}
        >
          {ctas.hero.label}
        </button>

        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className={styles.menuIcon} aria-hidden="true" />
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
      </div>

      {menuOpen && (
        <div
          className={styles.menuBackdrop}
          onClick={closeMenu}
          role="presentation"
        />
      )}

      <nav
        id="mobile-nav"
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className={styles.mobileLink}
          onClick={handleOpenProjects}
          aria-current={view === "projects" || (typeof view === "object" && view?.type === "project") ? "page" : undefined}
        >
          Projects
        </button>
        <button
          type="button"
          className={styles.mobileLink}
          onClick={handleOpenExperience}
          aria-current={view === "experience" ? "page" : undefined}
        >
          Experience
        </button>
        <button
          type="button"
          className={styles.mobileLink}
          onClick={handleOpenAbout}
          aria-current={view === "about" ? "page" : undefined}
        >
          About
        </button>
        <a className={styles.mobileLink} href={ctas.resume.href} download={ctas.resume.download} onClick={closeMenu}>
          {ctas.resume.label}
        </a>
        <a className={styles.mobileLink} href={ctas.contact.href} onClick={closeMenu}>
          {ctas.contact.label}
        </a>
        <div className={styles.mobileSocial}>
          {ctas.social.map((s) => (
            <a
              key={s.label}
              className={styles.mobileIcon}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              onClick={closeMenu}
            >
              <SocialSvg name={s.icon} />
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
