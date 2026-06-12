import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.shell}>
      <main className={styles.main}>
        <p className={styles.code}>404</p>
        <h1 className={`${styles.title} font-display`}>Wrong turn</h1>
        <p className={styles.lead}>
          Take a wrong turn? You should probably head back to the city... 
        </p>
        <nav className={styles.links} aria-label="Recovery">
          <Link className={styles.primary} href="/">
            Back to city
          </Link>
        </nav>
      </main>
    </div>
  );
}
