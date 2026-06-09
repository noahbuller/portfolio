import Image from "next/image";
import type { Project } from "@/data/projects";
import styles from "./ProjectCardMedia.module.css";

interface ProjectCardMediaProps {
  project: Project;
}

/** Consistent 16:9 media slot — screenshot or coastal placeholder. */
export function ProjectCardMedia({ project }: ProjectCardMediaProps) {
  if (project.preview) {
    return (
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
    );
  }

  return (
    <div className={styles.placeholder} aria-hidden="true">
      <span className={styles.placeholderTitle}>{project.title}</span>
      <span className={styles.placeholderTagline}>{project.tagline}</span>
    </div>
  );
}
