import { CityScene } from "@/components/city/CityScene";
import { FixedNav } from "@/components/nav/FixedNav";
import { ctas } from "@/data/ctas";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <h1 className={styles.srOnly}>
        {ctas.hero.label} — {ctas.hero.subtitle}
      </h1>
      <FixedNav />
      <CityScene />
    </main>
  );
}
