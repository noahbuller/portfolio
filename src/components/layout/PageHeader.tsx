import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  lead: string;
  titleId?: string;
  children?: React.ReactNode;
}

/** Page intro block shared across Projects, Experience, etc. */
export function PageHeader({ eyebrow, title, lead, titleId, children }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1 id={titleId} className={`${styles.title} font-display`}>
        {title}
      </h1>
      <p className={styles.lead}>{lead}</p>
      {children}
    </header>
  );
}
