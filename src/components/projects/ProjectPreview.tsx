import Image from "next/image";
import type { ProjectPreview } from "@/data/projects";
import styles from "./ProjectPreview.module.css";

interface ProjectPreviewProps {
  preview: ProjectPreview;
}

/** Hero preview frame for project case studies — links out when a live site exists. */
export function ProjectPreviewFrame({ preview }: ProjectPreviewProps) {
  const image = (
    <Image
      className={styles.image}
      src={preview.src}
      alt={preview.alt}
      width={1200}
      height={675}
      priority
    />
  );

  if (preview.href) {
    return (
      <a
        className={styles.frame}
        href={preview.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {image}
        <span className={styles.overlay}>
          Visit live site <span aria-hidden="true">↗</span>
        </span>
      </a>
    );
  }

  return <div className={styles.frame}>{image}</div>;
}
