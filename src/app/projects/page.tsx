import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectCardMedia } from "@/components/projects/ProjectCardMedia";
import { SkillIcons } from "@/components/SkillIcons";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";
import styles from "./page.module.css";

export const metadata = {
  title: "Projects",
  description: `Selected software projects by ${siteConfig.name} — full-stack builds in Next.js, TypeScript, and AWS.`,
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Projects"
        lead="Selected work from capstone and personal builds."
      />

      <ul className={styles.grid}>
        {projects.map((project) => (
          <li key={project.slug}>
            <Link className={`glass-panel ${styles.card}`} href={`/projects/${project.slug}`}>
              <ProjectCardMedia project={project} />
              <div className={styles.cardBody}>
                <span className={styles.date}>{project.date}</span>
                <h2 className={`${styles.cardTitle} font-display`}>{project.title}</h2>
                <p className={styles.tagline}>{project.tagline}</p>
                <div className={styles.icons}>
                  <SkillIcons
                    icons={project.skillIcons}
                    label={`${project.title} tech stack`}
                  />
                </div>
                <span className={styles.cta}>View case study →</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
