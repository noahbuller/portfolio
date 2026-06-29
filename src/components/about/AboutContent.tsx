"use client";

import { aboutSkillIcons } from "@/data/projects";
import { education, experienceRoles } from "@/data/experience";
import { SkillIcons } from "@/components/SkillIcons";
import { useOverlay } from "@/components/overlays/OverlayProvider";
import styles from "./AboutOverlay.module.css";

/** Resume-sourced bio, education, experience, and skills for the About modal. */
export function AboutContent() {
  const { openExperience } = useOverlay();

  return (
    <>
      <header className={styles.header}>
        <p className={styles.eyebrow}>About</p>
        <h2 id="about-title" className={`${styles.title} font-display`}>
          Noah Buller
        </h2>
        <p className={styles.subtitle}>Software Engineer</p>
      </header>

      <p className={styles.bio}>
        Lehigh CS + Business graduate with full-stack internship experience in Next.js, React, and AWS.
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
        <button type="button" className={styles.readMore} onClick={openExperience}>
          Full experience & coursework →
        </button>
      </section>

      <section className={styles.section}>
        <h3 className="section-eyebrow">Education</h3>
        <p className={styles.educationMeta}>{education.school}</p>
        <p className={styles.educationDegree}>{education.degree}</p>
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
    </>
  );
}
