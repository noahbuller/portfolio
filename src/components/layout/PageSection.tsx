import styles from "./PageSection.module.css";

interface PageSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  /** Extra top spacing + divider — use before tonal shifts (e.g. Leadership). */
  divided?: boolean;
}

/** Shared section shell: eyebrow heading + content, aligned with project case studies. */
export function PageSection({ id, title, children, divided }: PageSectionProps) {
  return (
    <section
      className={`${styles.section} ${divided ? styles.divided : ""}`}
      aria-labelledby={id}
    >
      <h2 id={id} className="section-eyebrow">
        {title}
      </h2>
      {children}
    </section>
  );
}
