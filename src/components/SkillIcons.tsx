import styles from "./SkillIcons.module.css";

interface SkillIconsProps {
  /** Comma-separated skillicons.dev slugs (e.g. "java,react,ts"). */
  icons: string;
  label?: string;
  /** Set false for above-the-fold strips. Defaults to lazy. */
  lazy?: boolean;
}

/** Decorative skill icon strip — not a link. */
export function SkillIcons({ icons, label = "Tech stack", lazy = true }: SkillIconsProps) {
  const src = `https://skillicons.dev/icons?i=${icons}`;

  return (
    <span className={styles.wrap} role="img" aria-label={label}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.img}
        src={src}
        alt=""
        width={360}
        height={48}
        loading={lazy ? "lazy" : "eager"}
        decoding="async"
      />
    </span>
  );
}
