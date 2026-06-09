import { HomeShell } from "@/components/HomeShell";
import { ctas } from "@/data/ctas";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <h1 className={styles.srOnly}>
        {ctas.hero.label} — {ctas.hero.subtitle}
      </h1>
      <HomeShell />
    </main>
  );
}
