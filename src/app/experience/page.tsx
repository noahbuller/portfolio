import { PageHeader } from "@/components/layout/PageHeader";
import { PageSection } from "@/components/layout/PageSection";
import { SkillIcons } from "@/components/SkillIcons";
import {
  courseGroups,
  education,
  experienceRoles,
  leadership,
} from "@/data/experience";
import { siteConfig } from "@/data/site";
import styles from "./page.module.css";

export const metadata = {
  title: "Experience",
  description: `Internships, Lehigh University education, and coursework — ${siteConfig.name}, software engineer.`,
};

export default function ExperiencePage() {
  return (
    <>
      <PageHeader
        eyebrow="Background"
        title="Experience"
        lead="Software engineering internships and a Computer Science + Business degree from Lehigh University"
      />

      <PageSection id="internships-heading" title="Internships">
        <ul className={styles.roleList}>
          {experienceRoles.map((role) => (
            <li key={role.id} className={`glass-panel ${styles.roleCard}`}>
              <div className={styles.roleHeader}>
                <div>
                  <h3 className={`${styles.roleCompany} font-display`}>{role.company}</h3>
                  <p className={styles.roleTitle}>
                    {role.title} · {role.location}
                  </p>
                </div>
                <p className={styles.roleDates}>{role.dates}</p>
              </div>
              <p className={styles.roleSummary}>{role.summary}</p>
              <ul className={styles.bullets}>
                {role.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div className={styles.skillIcons}>
                <SkillIcons
                  icons={role.skillIcons}
                  label={`${role.company} tech stack`}
                />
              </div>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection id="education-heading" title="Education">
        <article className={`glass-panel ${styles.educationCard}`}>
          <div className={styles.roleHeader}>
            <div>
              <h3 className={`${styles.roleCompany} font-display`}>{education.school}</h3>
              <p className={styles.roleTitle}>{education.degree}</p>
            </div>
            <p className={styles.roleDates}>{education.dates}</p>
          </div>
          <p className={styles.gpa}>GPA {education.gpa}</p>
          <ul className={styles.bullets}>
            {education.honors.map((honor) => (
              <li key={honor}>{honor}</li>
            ))}
          </ul>
          <p className={styles.roleSummary}>{education.summary}</p>
        </article>
      </PageSection>

      <PageSection id="courses-heading" title="Relevant coursework">
        <div className={styles.courseGrid}>
          {courseGroups.map((group) => (
            <article key={group.label} className={`glass-panel ${styles.courseGroup}`}>
              <h3 className={styles.courseLabel}>{group.label}</h3>
              {group.skillIcons && (
                <div className={styles.courseSkillIcons}>
                  <SkillIcons
                    icons={group.skillIcons}
                    label={`${group.label} technologies`}
                  />
                </div>
              )}
              <ul className={styles.bullets}>
                {group.courses.map((course) => (
                  <li key={course}>{course}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection id="leadership-heading" title="Leadership" divided>
        <article className={`glass-panel ${styles.leadershipCard}`}>
          <div className={styles.roleHeader}>
            <div>
              <h3 className={`${styles.roleCompany} font-display`}>{leadership.shortName}</h3>
              <p className={styles.roleTitle}>{leadership.role}</p>
            </div>
            <p className={styles.roleDates}>{leadership.dates}</p>
          </div>
          <p className={styles.roleSummary}>{leadership.summary}</p>
          <ul className={styles.bullets}>
            {leadership.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </article>
      </PageSection>
    </>
  );
}
