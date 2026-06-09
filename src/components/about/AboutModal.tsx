"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { aboutSkillIcons } from "@/data/projects";
import { education, experienceRoles } from "@/data/experience";
import { SkillIcons } from "@/components/SkillIcons";
import { useAbout } from "./AboutProvider";
import styles from "./AboutModal.module.css";

/**
 * Focus-trapped overlay with resume-sourced bio, education, experience, and skills.
 */
export function AboutModal() {
  const { isOpen, closeAbout } = useAbout();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAbout();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeAbout]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={closeAbout} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className={styles.close}
          onClick={closeAbout}
          aria-label="Close about panel"
        >
          ×
        </button>

        <header className={styles.header}>
          <p className={styles.eyebrow}>About</p>
          <h2 id="about-title" className={`${styles.title} font-display`}>
            Noah Buller
          </h2>
          <p className={styles.subtitle}>Software Engineer</p>
        </header>

        <p className={styles.bio}>
          Lehigh CS + Business graduate (GPA {education.gpa}) with startup
          internship experience building Go backend services, Next.js apps, and AWS
          deployments.
        </p>

        <section className={styles.section}>
          <h3 className="section-eyebrow">Experience</h3>
          <ul className={styles.roleList}>
            {experienceRoles.map((role) => (
              <li key={role.id} className={styles.roleItem}>
                <div className={styles.roleMeta}>
                  <strong className={styles.roleCompany}>{role.company}</strong>
                  <span className={styles.roleDates}>{role.dates}</span>
                </div>
                <p className={styles.roleDetail}>
                  {role.title} · {role.location}
                </p>
                <p className={styles.roleSummary}>{role.summary}</p>
              </li>
            ))}
          </ul>
          <Link className={styles.readMore} href="/experience" onClick={closeAbout}>
            Full experience & coursework →
          </Link>
        </section>

        <section className={styles.section}>
          <h3 className="section-eyebrow">Education</h3>
          <p className={styles.educationDegree}>{education.degree}</p>
          <p className={styles.educationMeta}>
            {education.school} · {education.dates}
          </p>
          <p className={styles.educationGpa}>GPA {education.gpa}</p>
          <ul className={styles.honors}>
            {education.honors.map((honor) => (
              <li key={honor}>{honor}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h3 className="section-eyebrow">Skills</h3>
          <SkillIcons icons={aboutSkillIcons} label="Noah Buller skills" />
        </section>
      </div>
    </div>
  );
}
