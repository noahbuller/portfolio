import styles from "./SkillIcons.module.css";

interface SkillIconsProps {
  /** Comma-separated skillicons.dev slugs (e.g. "java,react,ts"). */
  icons: string;
  label?: string;
}

/** Decorative skill icon strip — not a link. */
export function SkillIcons({ icons, label = "Tech stack" }: SkillIconsProps) {
  const src = `https://skillicons.dev/icons?i=${icons}`;

  return (
    <span className={styles.wrap} role="img" aria-label={label}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.img} src={src} alt="" />
    </span>
  );
}
