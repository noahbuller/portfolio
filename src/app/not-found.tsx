import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.shell}>
      <main className={styles.main}>
        <p className={styles.code}>404</p>
        <h1 className={`${styles.title} font-display`}>Wrong turn</h1>
        <p className={styles.lead}>
          This page isn&apos;t on the map. Head back to the city or browse projects
          and experience.
        </p>
        <nav className={styles.links} aria-label="Recovery">
          <Link className={styles.primary} href="/">
            Back to city
          </Link>
          <Link className={styles.secondary} href="/projects">
            Projects
          </Link>
          <Link className={styles.secondary} href="/experience">
            Experience
          </Link>
        </nav>
      </main>
    </div>
  );
}
