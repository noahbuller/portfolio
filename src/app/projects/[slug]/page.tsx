import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectPreviewFrame } from "@/components/projects/ProjectPreview";
import { SkillIcons } from "@/components/SkillIcons";
import { getAllProjectSlugs, getProject } from "@/data/projects";
import styles from "./page.module.css";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <article className={styles.article}>
      <Link className={styles.back} href="/projects">
        ← All projects
      </Link>

      <header className={styles.header}>
        <p className={styles.meta}>
          <span className={styles.date}>{project.date}</span>
          <span className={styles.role}>{project.role}</span>
        </p>
        <h1 className={`${styles.title} font-display`}>{project.title}</h1>
        <p className={styles.tagline}>{project.tagline}</p>
      </header>

      {project.preview && <ProjectPreviewFrame preview={project.preview} />}

      {project.links.length > 0 && (
        <div className={styles.links}>
          {project.links.map((link) => (
            <a
              key={link.href}
              className={styles.external}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      )}

      <section className={`glass-panel ${styles.section}`}>
        <h2 className="section-eyebrow">Overview</h2>
        <p>{project.summary}</p>
      </section>

      <section className={`glass-panel ${styles.section}`}>
        <h2 className="section-eyebrow">Problem</h2>
        <p>{project.problem}</p>
      </section>

      <section className={`glass-panel ${styles.section}`}>
        <h2 className="section-eyebrow">Approach</h2>
        <p>{project.approach}</p>
      </section>

      <section className={`glass-panel ${styles.section}`}>
        <h2 className="section-eyebrow">Outcomes</h2>
        <ul>
          {project.outcomes.map((outcome) => (
            <li key={outcome}>{outcome}</li>
          ))}
        </ul>
      </section>

      <section className={`glass-panel ${styles.section}`}>
        <h2 className="section-eyebrow">Tech stack</h2>
        <SkillIcons icons={project.skillIcons} label={`${project.title} tech stack`} />
      </section>
    </article>
  );
}
