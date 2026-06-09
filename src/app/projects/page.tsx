import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
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
              {project.preview && (
                <div className={styles.thumbWrap}>
                  <Image
                    className={styles.thumb}
                    src={project.preview.src}
                    alt=""
                    width={1200}
                    height={675}
                    sizes="(max-width: 600px) 100vw, 960px"
                  />
                </div>
              )}
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
