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
              className={styles.card}
              onClick={() => openProject(project.slug)}
            >
              <ProjectCardMedia project={project} />
              <div className={styles.cardBody}>
                <span className={styles.date}>{project.date}</span>
                <h2 className={`${styles.cardTitle} font-display`}>
                  {project.title}
                </h2>
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

      <div className={detailStyles.layout}>
        <div>
          <header className={detailStyles.header}>
            <p className={detailStyles.meta}>
              <span className={detailStyles.date}>{project.date}</span>
              <span className={detailStyles.role}>{project.role}</span>
            </p>
            <h1
              id="projects-overlay-title"
              className={`${detailStyles.title} font-display`}
            >
              {project.title}
            </h1>
            <p className={detailStyles.tagline}>{project.tagline}</p>
          </header>

          {project.preview && (
            <ProjectPreviewFrame preview={project.preview} />
          )}

          {/* The window sill: stack on the left, outbound links on the right. */}
          <div className={detailStyles.sill}>
            <section className={detailStyles.stack}>
              <h2 className={detailStyles.label}>Tech stack</h2>
              <SkillIcons
                icons={project.skillIcons}
                label={`${project.title} tech stack`}
              />
            </section>
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
          </div>
        </div>

        <div className={detailStyles.acts}>
          <section className={detailStyles.act}>
            <h2 className={detailStyles.label}>Overview</h2>
            <p>{project.summary}</p>
          </section>

          <section className={detailStyles.act}>
            <h2 className={detailStyles.label}>Problem</h2>
            <p>{project.problem}</p>
          </section>

          <section className={detailStyles.act}>
            <h2 className={detailStyles.label}>Approach</h2>
            <p>{project.approach}</p>
          </section>

          <section className={detailStyles.act}>
            <h2 className={detailStyles.label}>Outcomes</h2>
            <ul>
              {project.outcomes.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </article>
  );
}

export function ProjectsOverlay() {
  const { view, closeOverlay, goBack } = useOverlay();
  const isOpen = isProjectsView(view);
  const isDetail = typeof view === "object" && view?.type === "project";
  const slug = isDetail ? view.slug : "";

  return (
    <OverlayShell
      isOpen={isOpen}
      // From a project's detail view, Escape/backdrop-click/X should step
      // back to the list first — the same thing the in-panel "← All
      // projects" button does — instead of closing the whole overlay.
      onClose={isDetail ? goBack : closeOverlay}
      titleId="projects-overlay-title"
      size={isDetail ? "full" : "wide"}
      accent="rose"
      // List ↔ detail swaps the board's contents in place instead of
      // closing and reopening it.
      contentKey={isDetail ? slug : "list"}
    >
      {isDetail ? <ProjectDetail slug={slug} /> : <ProjectsGrid />}
    </OverlayShell>
  );
}
