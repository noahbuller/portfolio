"use client";

import { aboutSkillIcons } from "@/data/projects";
import { education, experienceRoles } from "@/data/experience";
import { SkillIcons } from "@/components/SkillIcons";
import { useOverlay } from "@/components/overlays/OverlayProvider";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageSection } from "@/components/layout/PageSection";
import styles from "./AboutOverlay.module.css";

/** Resume-sourced bio, education, experience, and skills for the About modal. */
export function AboutContent() {
  const { openExperience } = useOverlay();

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Noah Buller"
        lead="Software Engineer"
        titleId="about-title"
      >
        <p className={styles.bio}>
          Lehigh CS + Business graduate with full-stack internship experience in
          Next.js, React, and AWS.
        </p>
      </PageHeader>

      <div className={styles.columns}>
        <PageSection id="about-experience-heading" title="Experience">
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
          <button
            type="button"
            className={styles.readMore}
            onClick={openExperience}
          >
            Full experience & coursework →
          </button>
        </PageSection>

        <div>
          <PageSection id="about-education-heading" title="Education">
            <p className={styles.educationMeta}>{education.school}</p>
            <p className={styles.educationDegree}>{education.degree}</p>
            <ul className={styles.honors}>
              {education.honors.map((honor) => (
                <li key={honor}>{honor}</li>
              ))}
            </ul>
          </PageSection>

          <PageSection id="about-skills-heading" title="Skills">
            <SkillIcons icons={aboutSkillIcons} label="Noah Buller skills" />
          </PageSection>
        </div>
      </div>
    </>
  );
}
