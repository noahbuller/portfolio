"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectCardMedia } from "@/components/projects/ProjectCardMedia";
import { ProjectPreviewFrame } from "@/components/projects/ProjectPreview";
import { SkillIcons } from "@/components/SkillIcons";
import { OverlayShell } from "@/components/overlays/OverlayShell";
import { useOverlay } from "@/components/overlays/OverlayProvider";
import { getProject, projects } from "@/data/projects";
import { isProjectsView } from "@/lib/overlayView";
import styles from "./projects/projects.module.css";
import detailStyles from "./projects/projectDetail.module.css";

function ProjectsGrid() {
  const { openProject } = useOverlay();

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Projects"
        lead="Selected work from capstone and personal projects."
        titleId="projects-overlay-title"
      />

      <ul className={styles.grid}>
        {projects.map((project) => (
          <li key={project.slug}>
            <button
              type="button"
              className={`glass-panel ${styles.card}`}
              onClick={() => openProject(project.slug)}
            >
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
                <span className={styles.cta}>Learn more →</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function ProjectDetail({ slug }: { slug: string }) {
  const { goBack } = useOverlay();
  const project = getProject(slug);

  if (!project) {
    return (
      <>
        <button type="button" className={detailStyles.back} onClick={goBack}>
          ← All projects
        </button>
        <p className={detailStyles.notFound}>Project not found.</p>
      </>
    );
  }

  return (
    <article className={detailStyles.article}>
      <button type="button" className={detailStyles.back} onClick={goBack}>
        ← All projects
      </button>

      <header className={detailStyles.header}>
        <p className={detailStyles.meta}>
          <span className={detailStyles.date}>{project.date}</span>
          <span className={detailStyles.role}>{project.role}</span>
        </p>
        <h1 id="projects-overlay-title" className={`${detailStyles.title} font-display`}>
          {project.title}
        </h1>
        <p className={detailStyles.tagline}>{project.tagline}</p>
      </header>

      {project.preview && <ProjectPreviewFrame preview={project.preview} />}

      {project.links.length > 0 && (
        <div className={detailStyles.links}>
          {project.links.map((link) => (
            <a
              key={link.href}
              className={detailStyles.external}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      )}

      <section className={`glass-panel ${detailStyles.section}`}>
        <h2 className="section-eyebrow">Overview</h2>
        <p>{project.summary}</p>
      </section>

      <section className={`glass-panel ${detailStyles.section}`}>
        <h2 className="section-eyebrow">Problem</h2>
        <p>{project.problem}</p>
      </section>

      <section className={`glass-panel ${detailStyles.section}`}>
        <h2 className="section-eyebrow">Approach</h2>
        <p>{project.approach}</p>
      </section>

      <section className={`glass-panel ${detailStyles.section}`}>
        <h2 className="section-eyebrow">Outcomes</h2>
        <ul>
          {project.outcomes.map((outcome) => (
            <li key={outcome}>{outcome}</li>
          ))}
        </ul>
      </section>

      <section className={`glass-panel ${detailStyles.section}`}>
        <h2 className="section-eyebrow">Tech stack</h2>
        <SkillIcons icons={project.skillIcons} label={`${project.title} tech stack`} />
      </section>
    </article>
  );
}

export function ProjectsOverlay() {
  const { view, closeOverlay } = useOverlay();
  const isOpen = isProjectsView(view);
  const isDetail = typeof view === "object" && view?.type === "project";
  const slug = isDetail ? view.slug : "";

  return (
    <OverlayShell
      isOpen={isOpen}
      onClose={closeOverlay}
      titleId="projects-overlay-title"
      size={isDetail ? "full" : "wide"}
    >
      {isDetail ? (
        <ProjectDetail slug={slug} />
      ) : (
        <ProjectsGrid />
      )}
    </OverlayShell>
  );
}
