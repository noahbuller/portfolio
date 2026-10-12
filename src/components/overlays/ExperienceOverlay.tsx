"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { PageSection } from "@/components/layout/PageSection";
import { SkillIcons } from "@/components/SkillIcons";
import { OverlayShell } from "@/components/overlays/OverlayShell";
import { useOverlay } from "@/components/overlays/OverlayProvider";
import { SectionRail } from "@/components/overlays/SectionRail";
import {
  courseGroups,
  education,
  experienceRoles,
  leadership,
} from "@/data/experience";
import styles from "./experience.module.css";

// One list drives both the section headings and the "Jump to" rail.
const SECTIONS = {
  internships: { id: "internships-heading", title: "Internships" },
  education: { id: "education-heading", title: "Education" },
  courses: { id: "courses-heading", title: "Relevant coursework" },
  leadership: { id: "leadership-heading", title: "Leadership" },
} as const;

const RAIL_ITEMS = Object.values(SECTIONS);

/** Name, dotted leader, dates — a credits line, the way a marquee bills it. */
function Credit({ name, dates }: { name: string; dates: string }) {
  return (
    <div className={styles.credit}>
      <h3 className={`${styles.creditName} font-display`}>{name}</h3>
      <span className={styles.leader} aria-hidden="true" />
      <p className={styles.creditDates}>{dates}</p>
    </div>
  );
}

export function ExperienceOverlay() {
  const { view, closeOverlay } = useOverlay();
  const isOpen = view === "experience";

  return (
    <OverlayShell
      isOpen={isOpen}
      onClose={closeOverlay}
      titleId="experience-overlay-title"
      size="full"
      accent="gold"
    >
      <PageHeader
        eyebrow="Background"
        title="Experience"
        lead="Software engineering internships and a Computer Science + Business degree from Lehigh University"
        titleId="experience-overlay-title"
      />

      <div className={styles.split}>
        <SectionRail items={RAIL_ITEMS} label="Experience sections" />

        <div className={styles.content}>
          <PageSection
            id={SECTIONS.internships.id}
            title={SECTIONS.internships.title}
          >
            <ul className={styles.entryList}>
              {experienceRoles.map((role) => (
                <li key={role.id} className={styles.entry}>
                  <Credit name={role.company} dates={role.dates} />
                  <p className={styles.entryTitle}>
                    {role.title} · {role.location}
                  </p>
                  <p className={styles.summary}>{role.summary}</p>
                  <ul className={styles.bullets}>
                    {role.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <SkillIcons
                    icons={role.skillIcons}
                    label={`${role.company} tech stack`}
                  />
                </li>
              ))}
            </ul>
          </PageSection>

          <PageSection
            id={SECTIONS.education.id}
            title={SECTIONS.education.title}
          >
            <article className={styles.entry}>
              <Credit name={education.school} dates={education.dates} />
              <p className={styles.entryTitle}>{education.degree}</p>
              <p className={styles.gpa}>GPA {education.gpa}</p>
              <ul className={styles.bullets}>
                {education.honors.map((honor) => (
                  <li key={honor}>{honor}</li>
                ))}
              </ul>
              <p className={styles.summary}>{education.summary}</p>
            </article>
          </PageSection>

          <PageSection id={SECTIONS.courses.id} title={SECTIONS.courses.title}>
            <div className={styles.courseGrid}>
              {courseGroups.map((group) => (
                <article key={group.label} className={styles.courseGroup}>
                  <h3 className={styles.courseLabel}>{group.label}</h3>
                  <ul className={styles.bullets}>
                    {group.courses.map((course) => (
                      <li key={course}>{course}</li>
                    ))}
                  </ul>
                  {group.skillIcons && (
                    <SkillIcons
                      icons={group.skillIcons}
                      label={`${group.label} technologies`}
                    />
                  )}
                </article>
              ))}
            </div>
          </PageSection>

          <PageSection
            id={SECTIONS.leadership.id}
            title={SECTIONS.leadership.title}
            divided
          >
            <article className={styles.entry}>
              <Credit name={leadership.shortName} dates={leadership.dates} />
              <p className={styles.entryTitle}>{leadership.role}</p>
              <p className={styles.summary}>{leadership.summary}</p>
              <ul className={styles.bullets}>
                {leadership.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          </PageSection>
        </div>
      </div>
    </OverlayShell>
  );
}
