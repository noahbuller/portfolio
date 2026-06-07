import { ctas } from "@/data/ctas";
import { SocialSvg } from "@/components/icons";
import styles from "./FixedNav.module.css";

/**
 * Slim persistent top bar. Mirrors every CTA so nothing is ever unreachable
 * while the city scrolls behind it.
 */
export function FixedNav() {
  return (
    <header className={styles.nav}>
      <span className={styles.brand}>{ctas.hero.label}</span>

      <nav className={styles.links} aria-label="Primary">
        <a className={styles.link} href={ctas.resume.href} download={ctas.resume.download}>
          {ctas.resume.label}
        </a>
        <a className={styles.link} href={ctas.contact.href}>
          {ctas.contact.label}
        </a>
        <span className={styles.divider} aria-hidden="true" />
        {ctas.social.map((s) => (
          <a
            key={s.label}
            className={styles.icon}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
          >
            <SocialSvg name={s.icon} />
          </a>
        ))}
      </nav>
    </header>
  );
}
